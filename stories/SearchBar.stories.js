import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { connectSearchBar } from '@clinia/react-vizion-dom';
import { WrapWithHits } from './utils';

const stories = storiesOf('SearchBar', module);

class WrappedSearchBar extends Component {
  static propTypes = {
    querySuggestionHits: PropTypes.arrayOf(PropTypes.object),
    locationHits: PropTypes.arrayOf(PropTypes.object),
    searchForQuerySuggestions: PropTypes.func,
    searchForLocations: PropTypes.func,
    refine: PropTypes.func,
  };

  state = {
    query: null,
    aroundLatLng: null,
  };

  componentDidUpdate(props) {
    // Week comparison, just to get an idea
    if (
      props.locationHits.length > 0 &&
      this.props.locationHits.length !== props.locationHits.length
    ) {
      this.setState({ aroundLatLng: props.locationHits[0].geometry.location });
    }
  }

  onQueryChange = e => {
    this.setState({ query: e.target.value });
    this.props.searchForQuerySuggestions(e.target.value);
  };

  onLocationChange = e => {
    this.setState({ location: e.target.value });
    this.props.searchForLocations(e.target.value);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.refine(this.state);
  };

  render() {
    const { querySuggestionHits, locationHits } = this.props;
    return (
      <>
        <form onSubmit={this.handleSubmit} style={{ float: 'left' }}>
          <div>
            <input
              onChange={this.onQueryChange}
              placeholder="Search for resources"
            />
            <ul>
              {querySuggestionHits.map(hit => (
                <li key={hit.id}>{hit.query}</li>
              ))}
            </ul>
          </div>
          <div>
            <input onChange={this.onLocationChange} placeholder="Postal code" />
            <ul>
              {locationHits.map(hit => (
                <li key={hit.formattedAddress}>{hit.formattedAddress}</li>
              ))}
            </ul>
          </div>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
}
const SearchBar = connectSearchBar(WrappedSearchBar);

stories.add('default', () => (
  <WrapWithHits
    searchBox={false}
    hasPlayground={true}
    linkedStoryGroup="SearchBar"
  >
    <SearchBar />
  </WrapWithHits>
));
