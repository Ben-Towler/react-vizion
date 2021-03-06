import searchHelper from '@clinia/search-helper';
import createWidgetsManager from './createWidgetsManager';
import createStore from './createStore';
import { HIGHLIGHT_TAGS } from './highlight';
import { hasMultipleIndices } from './indexUtils';
import { version as ReactVersion } from 'react';
import version from './version';

function addCliniaAgents(searchClient) {
  if (typeof searchClient.addCliniaAgent === 'function') {
    searchClient.addCliniaAgent(`react (${ReactVersion})`);
    searchClient.addCliniaAgent(`react-vizion (${version})`);
  }
}

const isMultiIndexContext = widget =>
  hasMultipleIndices({
    cvi: widget.props.contextValue,
    multiIndexContext: widget.props.indexContextValue,
  });
const isTargetedIndexEqualIndex = (widget, indexId) =>
  widget.props.indexContextValue.targetedIndex === indexId;

// Relying on the `indexId` is a bit brittle to detect the `Index` widget.
// Since it's a class we could rely on `instanceof` or similar. We never
// had an issue though. Works for now.
const isIndexWidget = widget => Boolean(widget.props.indexId);
const isIndexWidgetEqualIndex = (widget, indexId) =>
  widget.props.indexId === indexId;

const sortIndexWidgetsFirst = (firstWidget, secondWidget) => {
  if (isIndexWidget(firstWidget)) {
    return -1;
  }
  if (isIndexWidget(secondWidget)) {
    return 1;
  }
  return 0;
};

// This function is copied from the clinia v2 API Client. If modified,
// consider updating it also in `serializeQueryParameters` from `@clinia/transporter`.
function serializeQueryParameters(parameters) {
  const isObjectOrArray = value =>
    Object.prototype.toString.call(value) === '[object Object]' ||
    Object.prototype.toString.call(value) === '[object Array]';

  const encode = (format, ...args) => {
    let i = 0;
    return format.replace(/%s/g, () => encodeURIComponent(args[i++]));
  };

  return Object.keys(parameters)
    .map(key =>
      encode(
        '%s=%s',
        key,
        isObjectOrArray(parameters[key])
          ? JSON.stringify(parameters[key])
          : parameters[key]
      )
    )
    .join('&');
}

/**
 * Creates a new instance of the VizionManager which controls the widgets and
 * trigger the search when the widgets are updated.
 * @param {string} indexName - the main index name
 * @param {object} initialState - initial widget state
 * @param {object} SearchParameters - optional additional parameters to send to the clinia API
 * @param {number} stalledSearchDelay - time (in ms) after the search is stalled
 * @return {VizionManager} a new instance of VizionManager
 */
export default function createVizionManager({
  indexName,
  initialState = {},
  searchClient,
  resultsState,
  stalledSearchDelay,
}) {
  const helper = searchHelper(searchClient, indexName, {
    ...HIGHLIGHT_TAGS,
  });

  addCliniaAgents(searchClient);

  helper
    .on('search', handleNewSearch)
    .on('result', handleSearchSuccess({ indexId: indexName }))
    .on('error', handleSearchError);

  let querySuggestionsIndex;
  let geocodingClient;

  let skip = false;
  let stalledSearchTimer = null;
  let initialSearchParameters = helper.state;

  const widgetsManager = createWidgetsManager(onWidgetsUpdate);

  hydrateSearchClient(searchClient, resultsState);

  const store = createStore({
    widgets: initialState,
    metadata: [],
    results: hydrateResultsState(resultsState),
    error: null,
    searching: false,
    isSearchStalled: true,
    searchingForQuerySuggestions: false,
    searchingForLocations: false,
  });

  function skipSearch() {
    skip = true;
  }

  function updateClient(client) {
    addCliniaAgents(client);
    helper.setClient(client);
    search();
  }

  function clearCache() {
    helper.clearCache();
    search();
  }

  function getMetadata(state) {
    return widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getMetadata))
      .map(widget => widget.getMetadata(state));
  }

  function getSearchParameters() {
    const sharedParameters = widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getSearchParameters))
      .filter(widget => !isMultiIndexContext(widget) && !isIndexWidget(widget))
      .reduce(
        (res, widget) => widget.getSearchParameters(res),
        initialSearchParameters
      );

    const mainParameters = widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getSearchParameters))
      .filter(widget => {
        const targetedIndexEqualMainIndex =
          isMultiIndexContext(widget) &&
          isTargetedIndexEqualIndex(widget, indexName);

        const subIndexEqualMainIndex =
          isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);

        return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
      })
      // We have to sort the `Index` widgets first so the `index` parameter
      // is correctly set in the `reduce` function for the following widgets
      .sort(sortIndexWidgetsFirst)
      .reduce(
        (res, widget) => widget.getSearchParameters(res),
        sharedParameters
      );

    const derivedIndices = widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getSearchParameters))
      .filter(widget => {
        const targetedIndexNotEqualMainIndex =
          isMultiIndexContext(widget) &&
          !isTargetedIndexEqualIndex(widget, indexName);

        const subIndexNotEqualMainIndex =
          isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);

        return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
      })
      // We have to sort the `Index` widgets first so the `index` parameter
      // is correctly set in the `reduce` function for the following widgets
      .sort(sortIndexWidgetsFirst)
      .reduce((indices, widget) => {
        const indexId = isMultiIndexContext(widget)
          ? widget.props.indexContextValue.targetedIndex
          : widget.props.indexId;

        const widgets = indices[indexId] || [];

        return {
          ...indices,
          [indexId]: widgets.concat(widget),
        };
      }, {});

    const derivedParameters = Object.keys(derivedIndices).map(indexId => ({
      parameters: derivedIndices[indexId].reduce(
        (res, widget) => widget.getSearchParameters(res),
        sharedParameters
      ),
      indexId,
    }));

    return { mainParameters, derivedParameters };
  }

  function search() {
    if (skip) return;

    const { mainParameters, derivedParameters } = getSearchParameters();

    // We have to call `slice` because the method `detach` on the derived
    // helpers mutates the value `derivedHelpers`. The `forEach` loop does
    // not iterate on each value and we're not able to correctly clear the
    // previous derived helpers (memory leak + useless requests).
    helper.derivedHelpers.slice().forEach(derivedHelper => {
      // Since we detach the derived helpers on **every** new search they
      // won't receive intermediate results in case of a stalled search.
      // Only the last result is dispatched by the derived helper because
      // they are not detached yet:
      //
      // - a -> main helper receives results
      // - ap -> main helper receives results
      // - app -> main helper + derived helpers receive results
      //
      // The quick fix is to avoid to detach them on search but only once they
      // received the results. But it means that in case of a stalled search
      // all the derived helpers not detached yet register a new search inside
      // the helper. The number grows fast in case of a bad network and it's
      // not deterministic.
      derivedHelper.detach();
    });

    derivedParameters.forEach(({ indexId, parameters }) => {
      const derivedHelper = helper.derive(() => parameters);

      derivedHelper
        .on('result', handleSearchSuccess({ indexId }))
        .on('error', handleSearchError);
    });

    helper.setState(mainParameters);

    helper.search();
  }

  function handleSearchSuccess({ indexId }) {
    return event => {
      const state = store.getState();
      const isDerivedHelpersEmpty = !helper.derivedHelpers.length;

      let results = state.results ? state.results : {};

      // Switching from mono index to multi index and vice versa must reset the
      // results to an empty object, otherwise we keep reference of stalled and
      // unused results.
      results = !isDerivedHelpersEmpty && results.getFacetByName ? {} : results;

      if (!isDerivedHelpersEmpty) {
        results[indexId] = event.results;
      } else {
        results = event.results;
      }

      const currentState = store.getState();
      let nextIsSearchStalled = currentState.isSearchStalled;
      if (!helper.hasPendingRequests()) {
        clearTimeout(stalledSearchTimer);
        stalledSearchTimer = null;
        nextIsSearchStalled = false;
      }

      const { ...partialState } = currentState;

      store.setState({
        ...partialState,
        results,
        isSearchStalled: nextIsSearchStalled,
        searching: false,
        error: null,
      });
    };
  }

  function handleSearchError({ error }) {
    const currentState = store.getState();

    let nextIsSearchStalled = currentState.isSearchStalled;
    if (!helper.hasPendingRequests()) {
      clearTimeout(stalledSearchTimer);
      nextIsSearchStalled = false;
    }

    const { ...partialState } = currentState;

    store.setState({
      ...partialState,
      isSearchStalled: nextIsSearchStalled,
      error,
      searching: false,
    });
  }

  function handleNewSearch() {
    if (stalledSearchTimer) return;

    stalledSearchTimer = setTimeout(() => {
      const { ...partialState } = store.getState();

      store.setState({
        ...partialState,
        isSearchStalled: true,
      });
    }, stalledSearchDelay);
  }

  function hydrateSearchClient(client, results) {
    if (!results) return;

    // Disable cache hydration on:
    // - Clinia API Client < v2 with cache disabled
    // - Third party clients (detected by the `addCliniaAgent` function missing)
    if (
      !client.transporter &&
      (!client._useCache || typeof client.addCliniaAgent !== 'function')
    ) {
      return;
    }

    // Clinia API Client >= v4
    // To hydrate the client we need to populate the cache with the data from
    // the server (done in `hydrateSearchClientWithMultiIndexRequest` or
    // `hydrateSearchClientWithSingleIndexRequest`). But since there is no way
    // for us to compute the key the same way as `clinia-client` we need
    // to populate it on a custom key and override the `search` method to
    // search on it first.
    if (client.transporter) {
      const baseMethod = client.search;
      client.search = (requests, ...methodArgs) => {
        const requestsWithSerializedParams = requests.map(request => ({
          ...request,
          params: serializeQueryParameters(request.params),
        }));

        return client.transporter.responsesCache.get(
          {
            method: 'search',
            args: [requestsWithSerializedParams, ...methodArgs],
          },
          () => {
            return baseMethod(requests, ...methodArgs);
          }
        );
      };
    }

    if (Array.isArray(results)) {
      hydrateSearchClientWithMultiIndexRequest(client, results);
      return;
    }

    hydrateSearchClientWithSingleIndexRequest(client, results);
  }

  function hydrateSearchClientWithMultiIndexRequest(client, results) {
    // Clinia API Client >= v2s
    // Populate the cache with the data from the server
    if (client.transporter) {
      client.transporter.responsesCache.set(
        {
          method: 'search',
          args: [
            results.reduce(
              (acc, result) =>
                acc.concat(
                  result.rawResults.map(request => ({
                    indexName: request.index,
                    params: request.params,
                  }))
                ),
              []
            ),
          ],
        },
        {
          results: results.reduce(
            (acc, result) => acc.concat(result.rawResults),
            []
          ),
        }
      );
      return;
    }

    // Clinia API Client < v2
    // Prior to client v2 we didn't have a proper API to hydrate the client
    // cache from the outside. The following code populates the cache with
    // a single-index result. You can find more information about the
    // computation of the key inside the client (see link below).
    const key = `/1/indexes/*/queries_body_${JSON.stringify({
      requests: results.reduce((acc, result) =>
        acc.concat(
          result.rawResults.map(request => ({
            indexName: request.index,
            params: request.params,
          }))
        )
      ),
    })}`;

    client.cache = {
      ...client.cache,
      [key]: JSON.stringify({
        results: results.reduce(
          (acc, result) => acc.concat(result.rawResults),
          []
        ),
      }),
    };
  }

  function hydrateSearchClientWithSingleIndexRequest(client, results) {
    const key = `/1/indexes/*/queries_body_${JSON.stringify({
      requests: results.rawResults.map(request => ({
        indexName: request.index,
        params: request.params,
      })),
    })}`;

    client.cache = {
      ...client.cache,
      [key]: JSON.stringify({
        results: results.rawResults,
      }),
    };
  }

  function hydrateResultsState(results) {
    if (!results) return null;

    if (Array.isArray(results)) {
      return results.reduce(
        (acc, result) => ({
          ...acc,
          [result._internalIndexId]: new searchHelper.SearchResults(
            new searchHelper.SearchParameters(result.state),
            result.rawResults
          ),
        }),
        {}
      );
    }

    return new searchHelper.SearchResults(
      new searchHelper.SearchParameters(results.state),
      results.rawResults
    );
  }

  // Called whenever a widget has been rendered with new props.
  function onWidgetsUpdate() {
    const metadata = getMetadata(store.getState().widgets);

    store.setState({
      ...store.getState(),
      metadata,
      searching: true,
    });

    // Since the `getSearchParameters` method of widgets also depends on props,
    // the result search parameters might have changed.
    search();
  }

  function transitionState(nextSearchState) {
    const searchState = store.getState().widgets;

    return widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.transitionState))
      .reduce(
        (res, widget) => widget.transitionState(searchState, res),
        nextSearchState
      );
  }

  function onExternalStateUpdate(nextSearchState) {
    const metadata = getMetadata(nextSearchState);

    store.setState({
      ...store.getState(),
      widgets: nextSearchState,
      metadata,
      searching: true,
    });

    search();
  }

  function onSearchForQuerySuggestions({ query, ...params }) {
    // Initialize the index if not existing
    if (!querySuggestionsIndex) {
      querySuggestionsIndex = searchClient.initIndex('query_suggestions');
    }

    store.setState({
      ...store.getState(),
      searchingForQuerySuggestions: true,
    });

    querySuggestionsIndex
      .search(query, {
        ...params,
      })
      .then(res => {
        store.setState({
          ...store.getState(),
          searchingForQuerySuggestions: false,
          resultsQuerySuggestions: res,
        });
      })
      .catch(error => {
        store.setState({
          ...store.getState(),
          searchingForQuerySuggestions: false,
          error,
        });

        setTimeout(() => {
          throw error;
        });
      });
  }

  function onSearchForLocations({ query, ...params }) {
    if (!geocodingClient) {
      const geocoding = () => {
        return {
          search: (geocodingQuery, requestOptions) => {
            return searchClient.transporter.read({
              method: 'POST',
              path: 'geocoding/v1/autocomplete',
              data: {
                query: geocodingQuery,
                ...requestOptions,
              },
              cacheable: true,
            });
          },
        };
      };
      geocodingClient = geocoding();
    }

    store.setState({
      ...store.getState(),
      searchingForLocations: true,
    });

    geocodingClient
      .search(query, {
        ...params,
      })
      .then(res => {
        store.setState({
          ...store.getState(),
          searchingForLocations: false,
          resultsLocations: res,
        });
      })
      .catch(error => {
        store.setState({
          ...store.getState(),
          searchingForLocations: false,
          error,
        });

        setTimeout(() => {
          throw error;
        });
      });
  }

  function updateIndex(newIndex) {
    initialSearchParameters = initialSearchParameters.setIndex(newIndex);
    // No need to trigger a new search here as the widgets will also update and trigger it if needed.
  }

  function getWidgetsIds() {
    return store
      .getState()
      .metadata.reduce(
        (res, meta) =>
          typeof meta.id !== 'undefined' ? res.concat(meta.id) : res,
        []
      );
  }

  return {
    store,
    widgetsManager,
    getWidgetsIds,
    getSearchParameters,
    onSearchForQuerySuggestions,
    onSearchForLocations,
    onExternalStateUpdate,
    transitionState,
    updateClient,
    updateIndex,
    clearCache,
    skipSearch,
  };
}
