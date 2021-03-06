<div align="center">
  <img src="../../.github/clinia-logo.svg" width="250">
  <h1>React Vizion Widgets</h1>
  <h4>Widgets provide bare UI components to ease the integration Clinia's API suite inside a provider's application.</h4>
  <h4>This documentation is generated using <a href="https://github.com/jsdoc/jsdoc">JSDoc</a></h4>
</div>

## Overview
All properties in the different modules are either optional or are provided with a default value. For further examples on how to use the different widgets, refer to the [example](./examples/react-router).

## Modules

<dl>
<dt><a href="#module_Configure">Configure</a></dt>
<dd></dd>
<dt><a href="#module_Index">Index</a></dt>
<dd></dd>
<dt><a href="#module_Vizion">Vizion</a></dt>
<dd></dd>
<dt><a href="#module_AutoComplete">AutoComplete</a></dt>
<dd></dd>
<dt><a href="#module_Hits">Hits</a></dt>
<dd></dd>
<dt><a href="#module_InfiniteHits">InfiniteHits</a></dt>
<dd></dd>
<dt><a href="#module_Location">Location</a></dt>
<dd></dd>
<dt><a href="#module_SearchBox">SearchBox</a></dt>
<dd></dd>
<dt><a href="#module_Control">Control</a></dt>
<dd></dd>
<dt><a href="#module_CustomMarker">CustomMarker</a></dt>
<dd></dd>
<dt><a href="#module_GeoSearch">GeoSearch</a></dt>
<dd></dd>
<dt><a href="#module_GoogleMapsLoader">GoogleMapsLoader</a></dt>
<dd></dd>
<dt><a href="#module_Marker">Marker</a></dt>
<dd></dd>
<dt><a href="#module_Redo">Redo</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LatLngPropType">LatLngPropType</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BoundingBoxPropType">BoundingBoxPropType</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GeolocHitPropType">GeolocHitPropType</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Configure"></a>

## Configure
<a name="exp_module_Configure--_default"></a>

<p>Configure is a widget that lets you provide raw search parameters
to the Clinia API.</p>
<p>This widget can be used either with react-dom and react-native. It will not render anything
on screen, only configure some parameters.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| queryType | <code>string</code> | <code>&quot;prefix_none&quot;</code> | <p>Sets the matching strategy for the search. Value is either <code>prefix_none</code> for complete word matching or <code>prefix_last</code> for partial word matching.</p> |
| perPage | <code>perPage</code> |  | <p>Sets the number of search results to return per page.</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion, Configure, Hits } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
  'TODO',
  'test'
);

const App = () => (
  <Vizion
    searchClient={searchClient}
    indexName="health_facility"
  >
    <Configure perPage={5} queryType="prefix_last" />
    <Hits />
  </Vizion>
);
```
<a name="module_Index"></a>

## Index
<a name="exp_module_Index--exports.IndexComponentWithoutContext"></a>

<p>The component that allows you to apply widgets to a dedicated index. It's
useful if you want to build an interface that targets multiple indexes.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| indexName | <code>string</code> | <p>The name of the targeted index. Value is either <code>health_facility</code> or <code>professional</code>.</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion. Index, SearcbBox, Hits, Configure } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
 'TODO',
 'test'
);

const App = () => (
  <Vizion searchClient={searchClient} indexName="health_facility">
    <Configure perPage={5} />
    <SearchBox />
    <Index indexName="health_facility">
      <Hits />
    </Index>
    <Index indexName="professional">
      <Hits />
    </Index>
  </Vizion>
);
```
<a name="module_Vizion"></a>

## Vizion
<a name="exp_module_Vizion--Vizion"></a>

<p><code>Vizion</code> is the root component of all React Vizion implementations.
It provides all the connected components (aka widgets) a mean to interact
with the searchState.</p>

**Kind**: Exported widget
**Requirements**: You will need to have an Clinia account to be able to use this widget.
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| createURL | <code>func</code> |  | <p>Function to call when creating links, useful for <a href="guide/Routing.html">URL Routing</a>.</p> |
| indexName | <code>string</code> |  | <p>Main index in which to search.</p> |
| onSearchStateChange | <code>func</code> |  | <p>Function to be called everytime a new search is done. Useful for <a href="guide/Routing.html">URL Routing</a>.</p> |
| refresh | <code>boolean</code> | <code>false</code> | <p>Flag to activate when the cache needs to be cleared so that the front-end is updated when a change occurs in the index.</p> |
| resultsState | <code>SearchResults</code> \| <code>Array.&lt;SearchResults&gt;</code> |  | <p>Use this to inject the results that will be used at first rendering. Those results are found by using the <code>findResultsState</code> function. Useful for <a href="guide/Server-side_rendering.html">Server Side Rendering</a>.</p> |
| root | <code>Object</code> |  | <p>Use this to customize the root element. Default value: <code>{ Root: 'div' }</code></p> |
| searchClient | <code>object</code> |  | <p>Provide a custom search client.</p> |
| searchState | <code>object</code> |  | <p>Object to inject some search state. Switches the Vizion component in controlled mode. Useful for <a href="guide/Routing.html">URL Routing</a>.</p> |
| stalledSearchDelay | <code>number</code> | <code>200</code> | <p>The amount of time before considering that the search takes too much time. The time is expressed in milliseconds.</p> |

<a name="module_AutoComplete"></a>

## AutoComplete
<a name="exp_module_AutoComplete--_default"></a>

<p>The AutoComplete component displays a search box that lets the user search for a specific query.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Set autoFocus to the autocomplete input.</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the AutoComplete form container.</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title.</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| highlightPostTag | <code>string</code> |  | <p>The post tag that will highlight the matched part of the query in each suggestion. Usually a html tag like <code>&lt;/strong&gt;</code>.</p> |
| highlightPreTag | <code>string</code> |  | <p>The pre tag that will highlight the matched part of the query in each suggestion. Usually a html tag like <code>&lt;strong&gt;</code>.</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the AutoComplete form container.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the AutoComplete form container.</p> |
| onSuggestionSelected | <code>function</code> |  | <p>Executes every time that a suggestion is selected.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder.</p> |
| renderSuggestion | <code>function</code> |  | <p>Define how suggestions will be rendered.</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title.</p> |
| size | <code>number</code> | <code>5</code> | <p>Number of suggestions to show.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <Vizion>. By default, the value is 200ms.</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to the AutoComplete form container.</p> |
| triggerSubmitOnSuggestionSelected | <code>boolean</code> | <code>false</code> | <p>Define if the AutoComplete form container should be submitted onSuggestionSelected.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-autocomplete | <p>The root div of the widget.</p> |
| cvi-autocomplete-clear | <p>The reset button used to clear the content of the input.</p> |
| cvi-autocomplete-clearicon | <p>The default reset icon used inside the reset button.</p> |
| cvi-autocomplete-form | <p>The wrapping form.</p> |
| cvi-autocomplete-input | <p>The search input.</p> |
| cvi-autocomplete-loadingicon | <p>The default loading icon.</p> |
| cvi-autocomplete-loadingindicator | <p>The loading indicator container.</p> |
| cvi-autocomplete-submit | <p>The submit button.</p> |
| cvi-autocomplete-submiticon | <p>The default magnifier icon used with the search input.</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion, AutoComplete } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App = () => (
  <Vizion
    searchClient={searchClient}
  >
    <AutoComplete />
  </Vizion>
);
```
<a name="module_Hits"></a>

## Hits
<a name="exp_module_Hits--_default"></a>

<p>Displays a list of hits.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | <p>Add a custom CSS class to the component.</p> |
| emptySearch | <code>string</code> | <p>The text shown on empty results.</p> |
| hitComponent | <code>Component</code> | <p>Component used for rendering each hit from the results. If it is not provided the rendering defaults to displaying the hit in its JSON form. The component will be called with a <code>hit</code> prop.</p> |
| noResultsFound | <code>node</code> | <p>Change the apparence of the default empty results found.</p> |
| style | <code>object</code> | <p>Add a custom React.CSSProperties object to the Hits container.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-hits | <p>The root div of the widget.</p> |
| cvi-hits-item | <p>The hit list item</p> |
| cvi-hits-list | <p>The list of results.</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion, Hits } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
  'TODO',
  'test'
);
const App = () => (
  <Vizion
    searchClient={searchClient}
    indexName="health_facility"
  >
    <Hits />
  </Vizion>
);
```
<a name="module_InfiniteHits"></a>

## InfiniteHits
<a name="exp_module_InfiniteHits--_default"></a>

<p>Displays an infinite list of hits along with a <strong>load more</strong> button.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| className | <code>string</code> |  | <p>Add a custom CSS class to the component.</p> |
| hitComponent | <code>Component</code> |  | <p>Component used for rendering each hit from the results. If it is not provided the rendering defaults to displaying the hit in its JSON form. The component will be called with a <code>hit</code> prop.</p> |
| loadMore | <code>string</code> |  | <p>The label of load more button.</p> |
| loadPrevious | <code>string</code> |  | <p>The label of load previous button.</p> |
| showPrevious | <code>boolean</code> | <code>false</code> | <p>Define if button of <code>load previous</code> should be shown.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-infinitehits | <p>The root div of the widget</p> |
| cvi-infinitehits-item | <p>The hit list item</p> |
| cvi-infinitehits-list | <p>The list of hits</p> |
| cvi-infinitehits-loadmore | <p>The button used to display more results</p> |
| cvi-infinitehits-loadmore--disabled | <p>The disabled button used to display more results</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion, InfiniteHits } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
  'TODO',
  'test'
);

const App = () => (
  <Vizion
    searchClient={searchClient}
    indexName="health_facility"
  >
    <InfiniteHits />
  </Vizion>
);
```
<a name="module_Location"></a>

## Location
<a name="exp_module_Location--Location"></a>

<p>The Location component displays a search box that lets the user search for a specific location.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Set autoFocus to the autocomplete input</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the Location form container</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title</p> |
| country | <code>string</code> |  | <p>Filter the suggestion to the given country codes. (The countries values must be formatted according to the ISO 3166, e.g. &quot;CA&quot;).</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| limit | <code>number</code> | <code>5</code> | <p>Define the limit number for the presented suggestions.</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| locale | <code>string</code> | <code>&quot;en&quot;</code> | <p>Define the language for the presented suggestions (The locale value must be formatted according to the ISO 639, e.g. 'en').</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the Location form container.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the Location form container.</p> |
| onSuggestionSelected | <code>function</code> |  | <p>Executes every time that a suggestion is selected.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder</p> |
| renderSuggestion | <code>function</code> |  | <p>Define how suggestions will be rendered.</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <Vizion>. By default, the value is 200ms.</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to the Location form container</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |
| triggerSubmitOnSuggestionSelected | <code>boolean</code> | <code>false</code> | <p>Define if the Location form container should be submitted onSuggestionSelected</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-location | <p>The root div of the widget.</p> |
| cvi-location-clear | <p>The reset button used to clear the content of the input.</p> |
| cvi-location-clearicon | <p>The default reset icon used inside the reset button.</p> |
| cvi-location-form | <p>The wrapping form.</p> |
| cvi-location-input | <p>The search input.</p> |
| cvi-location-loadingicon | <p>The default loading icon.</p> |
| cvi-location-loadingindicator | <p>The loading indicator container.</p> |
| cvi-location-submit | <p>The submit button.</p> |
| cvi-location-submiticon | <p>The default magnifier icon used with the search input.</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion, Location } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App = () => (
  <Vizion
    searchClient={searchClient}
  >
    <Location />
  </Vizion>
);
```
<a name="module_SearchBox"></a>

## SearchBox
<a name="exp_module_SearchBox--_default"></a>

<p>The SearchBox component displays a search box that lets the user search for a specific query.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus | <code>boolean</code> | <code>false</code> | <p>Should the search box be focused on render?</p> |
| className | <code>string</code> |  | <p>Add a custom CSS class to the SearchBox form container.</p> |
| clear | <code>node</code> |  | <p>Change the apparence of the default reset button (cross).</p> |
| clearTitle | <code>string</code> |  | <p>The reset button title.</p> |
| defaultRefinement | <code>string</code> |  | <p>Provide default refinement value when component is mounted.</p> |
| focusShortcuts | <code>Array.&lt;string&gt;</code> | <code>[&#x27;s&#x27;,&#x27;/&#x27;</code> | <p>List of keyboard shortcuts that focus the search box. Accepts key names and key codes.</p> |
| loadingIndicator | <code>node</code> |  | <p>Change the apparence of the default loading indicator (spinning circle).</p> |
| onClear | <code>function</code> |  | <p>Listen to <code>reset</code> event sent from the SearchBox form container.</p> |
| onSubmit | <code>function</code> |  | <p>Intercept submit event sent from the SearchBox form container.</p> |
| on* | <code>function</code> |  | <p>Listen to any events sent from the search input itself.</p> |
| placeholder | <code>string</code> |  | <p>The label of the input placeholder.</p> |
| searchAsYouType | <code>boolean</code> | <code>true</code> | <p>Should we search on every change to the query? If you disable this option, new searches will only be triggered by clicking the search button or by pressing the enter key while the search box is focused.</p> |
| searchTitle | <code>string</code> |  | <p>The submit button title.</p> |
| showLoadingIndicator | <code>boolean</code> | <code>false</code> | <p>Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with <code>stalledSearchDelay</code> props on <Vizion>. By default, the value is 200ms.</p> |
| style | <code>object</code> |  | <p>Add a custom React.CSSProperties object to SearchBox form container.</p> |
| submit | <code>node</code> |  | <p>Change the apparence of the default submit button (magnifying glass).</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-searchbox | <p>The root div of the widget.</p> |
| cvi-searchbox-clear | <p>The reset button used to clear the content of the input.</p> |
| cvi-searchbox-clearicon | <p>The default reset icon used inside the reset button.</p> |
| cvi-searchbox-form | <p>The wrapping form.</p> |
| cvi-searchbox-input | <p>The search input.</p> |
| cvi-searchbox-loadingindicator | <p>The loading indicator container.</p> |
| cvi-searchbox-loadingicon | <p>The default loading icon.</p> |
| cvi-searchbox-submit | <p>The submit button.</p> |
| cvi-searchbox-submiticon | <p>The default magnifier icon used with the search input.</p> |

**Example**
```js
import React from 'react';
import cliniasearch from 'cliniasearch/lite';
import { Vizion, SearchBox } from '@clinia/react-vizion-dom';

const searchClient = cliniasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App = () => (
  <Vizion
    searchClient={searchClient}
  >
    <SearchBox />
  </Vizion>
);
```
<a name="module_Control"></a>

## Control
<a name="exp_module_Control--exports.Control"></a>

<p>Control to enable, disable or to manually trigger a search on map movement.</p>

**Kind**: Exported widget
**Themes**

| Name | Description |
| --- | --- |
| cvi-geosearch-control | <p>The root div of the Control.</p> |
| cvi-geosearch-label | <p>The label of the checkbox.</p> |
| cvi-geosearch-input | <p>The checkbox.</p> |
| cvi-geosearch-redo | <p>The re-search button.</p> |

**Example**
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ hits }) => (
        <Fragment>
          <Control />
          {hits.map(hit => (
            <Marker
              key={hit.id}
              hit={hit}
            />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_CustomMarker"></a>

## CustomMarker
<a name="exp_module_CustomMarker--exports.CustomMarker"></a>

<p>Allow the creation a custom map marker.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| anchor | <code>Object</code> | <p>The anchor of the marker.</p> |
| className | <code>string</code> | <p>Classname for the custom marker.</p> |
| label | <code>string</code> | <p>Label to display.</p> |
| on* | <code>function</code> | <p>Listen to any mouse events sent from the marker.</p> |
| hit | [<code>GeolocHitPropType</code>](#GeolocHitPropType) | <p>Record to display.</p> |

**Example**
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ hits }) => (
        <Fragment>
          {hits.map(hit => (
             <CustomMarker
               key={hit.id}
               hit={hit}
               anchor={{ x: 5, y: 0 }}
               onMouseEnter={() => {}}
               onMouseLeave={() => {}}
             >
               <div className={classNames.join(' ').trim()}>
                 <span>{hit.name}</span>
               </div>
             </CustomMarker>
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_GeoSearch"></a>

## GeoSearch
<a name="exp_module_GeoSearch--module.exports"></a>

<p>Map component to display search results.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| defaultRefinement | [<code>BoundingBoxPropType</code>](#BoundingBoxPropType) | <p>The default bounds of the map.</p> |
| enableRefine | <code>boolean</code> | <p>If the refinement is enabled at all for the map.</p> |
| enableRefineOnMapMove | <code>boolean</code> | <p>If the map should trigger a new search on map movement.</p> |
| google | <code>Object</code> | <p>The google client.</p> |
| initialPosition | [<code>LatLngPropType</code>](#LatLngPropType) | <p>The initial position of the map.</p> |
| initialZoom | <code>number</code> | <p>The initial zoom value.</p> |

<a name="module_GoogleMapsLoader"></a>

## GoogleMapsLoader
<a name="exp_module_GoogleMapsLoader--GoogleMapsLoader"></a>

<p>Instantiate an instance of the Google maps client on the client side.
Since this component rely on the <code>document</code> property, this won't be run on the server during any <a href="guide/Server-side_rendering.html">Server Side Rendering</a> phase.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | <p>Your Google maps api key.</p> |
| endpoint | <code>string</code> | <code>&quot;https://maps.googleapis.com/maps/api/js?v&#x3D;quarterly&quot;</code> | <p>The default endpoint to get the maps from.</p> |

**Example**
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch
      google={google}
      defaultRefinement={{
        northEast: { lat: 45.7058381, lng: -73.47426 },
        southWest: { lat: 45.410246, lng: -73.986345 },
      }}
    >
      {({ hits }) => (
        <Fragment>
          {hits.map(hit => (
            <Marker key={hit.id} hit={hit} />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_Marker"></a>

## Marker
<a name="exp_module_Marker--exports.Marker"></a>

<p>Map marker.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hit | [<code>GeolocHitPropType</code>](#GeolocHitPropType) | <p>Record to display.</p> |
| label | <code>string</code> | <p>Label to display.</p> |
| on* | <code>function</code> | <p>Listen to any mouse events sent from the marker.</p> |

**Example**
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ hits }) => (
        <Fragment>
          {hits.map(hit => (
            <Marker
              key={hit.id}
              hit={hit}
              label={hit.name}
              onClick={() => {}}
              onDoubleClick={() => {}}
            />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="module_Redo"></a>

## Redo
<a name="exp_module_Redo--exports.Redo"></a>

<p>Button that indicate triggers a search when clicked.</p>

**Kind**: Exported widget
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| translate | <code>function</code> | <p>Should return the text to display in the button.</p> |

**Themes**

| Name | Description |
| --- | --- |
| cvi-geosearch-control | <p>The root div of the Control.</p> |
| cvi-geosearch-redo | <p>The re-search button.</p> |
| cvi-geosearch-redo--disabled | <p>The re-search button while disabled.</p> |

**Example**
```js
<GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  {google => (
    <GeoSearch google={google}>
      {({ hits }) => (
        <Fragment>
          <Redo />
          {hits.map(hit => (
            <Marker
              key={hit.id}
              hit={hit}
            />
          ))}
        </Fragment>
      )}
    </GeoSearch>
  )}
</GoogleMapsLoader>
```
<a name="LatLngPropType"></a>

## LatLngPropType : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lat | <code>number</code> | <p>Latitude (-90 to 90).</p> |
| lng | <code>number</code> | <p>Longitude (-180 tp 180).</p> |

<a name="BoundingBoxPropType"></a>

## BoundingBoxPropType : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| northEast | [<code>LatLngPropType</code>](#LatLngPropType) | <p>NorthEast coordinate descibing the bounds.</p> |
| southWest | [<code>LatLngPropType</code>](#LatLngPropType) | <p>SouthWest coordinate descibing the bounds.</p> |

<a name="GeolocHitPropType"></a>

## GeolocHitPropType : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _geoPoint | [<code>LatLngPropType</code>](#LatLngPropType) | <p>Coordinate of the hit.</p> |

