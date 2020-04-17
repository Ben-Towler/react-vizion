import { connectHighlight } from '@clinia/react-vision-core';
import Highlight from '../components/Highlight';

/**
 * Renders any property from a hit into its highlighted form when relevant.
 *
 * @name Highlight
 * @kind widget
 * @propType {string} property - location of the highlighted property in the hit (the corresponding element can be either a string or an array of strings)
 * @propType {object} hit - hit object containing the highlighted property
 * @propType {string} [tagName='em'] - tag to be used for highlighted parts of the hit
 * @propType {string} [nonHighlightedTagName='span'] - tag to be used for the parts of the hit that are not highlighted
 * @propType {node} [separator=',<space>'] - symbol used to separate the elements of the array in case the property points to an array of strings.
 * @themeKey cvi-Highlight - root of the component
 * @themeKey cvi-Highlight-highlighted - part of the text which is highlighted
 * @themeKey cvi-Highlight-nonHighlighted - part of the text that is not highlighted
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vision, SearchBox, Hits, Highlight } from '@clinia/react-vision-dom';
 *
 * const Hit = ({ hit }) => (
 *   <div>
 *     <Highlight property="name" hit={hit} />
 *   </div>
 * );
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <SearchBox defaultRefinement="Pho" />
 *     <Hits hitComponent={Hit} />
 *   </Vision>
 * );
 */

export default connectHighlight(Highlight);
