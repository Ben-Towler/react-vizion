import isEqual from 'react-fast-compare';

import createConnector from '../core/createConnector';
import {
  getCurrentRefinementValue,
  refineValue,
  getResults,
} from '../core/indexUtils';
import { addAbsolutePositions, addQueryID } from '../core/utils';

function getId() {
  return 'page';
}

function getCurrentRefinement(props, searchState, context) {
  const id = getId();
  const page = 1;
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    id,
    page
  );

  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }
  return currentRefinement;
}

/**
 * InfiniteHits connector provides the logic to create connected
 * components that will render an continuous list of results retrieved from
 * Clinia. This connector provides a function to load more results.
 * @name connectInfiniteHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @providedPropType {boolean} hasMore - indicates if there are more pages to load
 * @providedPropType {function} refine - call to load more results
 */
export default createConnector({
  displayName: 'CliniaInfiniteHits',

  getProvidedProps(props, searchState, searchResults) {
    const results = getResults(searchResults, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    this._allResults = this._allResults || [];
    this._prevState = this._prevState || {};

    if (!results) {
      return {
        hits: [],
        hasPrevious: false,
        hasMore: false,
        refine: () => {},
        refinePrevious: () => {},
        refineNext: () => {},
      };
    }

    const {
      hits,
      page,
      perPage,
      numPages,
      _state: { page: p, ...currentState } = {},
    } = results;

    const hitsWithPositions = addAbsolutePositions(hits, perPage, page);
    const hitsWithPositionsAndQueryID = addQueryID(
      hitsWithPositions,
      results.queryID
    );

    if (
      this._firstReceivedPage === undefined ||
      !isEqual(currentState, this._prevState)
    ) {
      this._allResults = [...hitsWithPositionsAndQueryID];
      this._firstReceivedPage = page;
      this._lastReceivedPage = page;
    } else if (this._lastReceivedPage < page) {
      this._allResults = [...this._allResults, ...hitsWithPositionsAndQueryID];
      this._lastReceivedPage = page;
    } else if (this._firstReceivedPage > page) {
      this._allResults = [...hitsWithPositionsAndQueryID, ...this._allResults];
      this._firstReceivedPage = page;
    }

    this._prevState = currentState;

    const hasPrevious = this._firstReceivedPage > 0;
    const lastPageIndex = numPages - 1;
    const hasMore = page < lastPageIndex;
    const refinePrevious = event =>
      this.refine(event, this._firstReceivedPage - 1);
    const refineNext = event => this.refine(event, this._lastReceivedPage + 1);

    return {
      hits: this._allResults,
      hasPrevious,
      hasMore,
      refinePrevious,
      refineNext,
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQueryParameters({
      page:
        getCurrentRefinement(props, searchState, {
          cvi: props.contextValue,
          multiIndexContext: props.indexContextValue,
        }) - 1,
    });
  },

  refine(props, searchState, event, index) {
    if (index === undefined && this._lastReceivedPage !== undefined) {
      index = this._lastReceivedPage + 1;
    } else if (index === undefined) {
      index = getCurrentRefinement(props, searchState, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      });
    }

    const id = getId();
    const nextValue = { [id]: index + 1 };
    const resetPage = false;
    return refineValue(
      searchState,
      nextValue,
      { cvi: props.contextValue, multiIndexContext: props.indexContextValue },
      resetPage
    );
  },
});
