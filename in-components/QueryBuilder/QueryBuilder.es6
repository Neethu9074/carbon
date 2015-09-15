

import React from 'react/addons';
import Immutable from 'immutable';
import irpt from 'react-immutable-proptypes';

import * as filters from 'in-services/stores/filters';
import * as filtering from 'in-services/filterSuggester';

import enhance from '../hoc/enhance';
import FilterBadge from './FilterBadge.es6';
import QueryInput from './QueryInput.es6';
import SuggestionPanel from './SuggestionPanel.es6';

import './QueryBuilder.less';

const block = 'in-query-builder';
const noSuggestions = Immutable.List();

// TODO expanding: http://jquery-plugins.net/image/plugin/mobile-friendly-responsive-expanding-search-bar.png

const QueryBuilder = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    activeFilters: irpt.list
  },

  statics: {
    createObservables: () => {
      return {
        activeFilters: filters.activeFilters
      };
    }
  },

  getInitialState() {
    return {
      selectedSuggestion: -1,
      currentTypedInValue: '',
      suggestions: noSuggestions
    };
  },

  render() {
    let activeFilters = null;
    if (this.props.activeFilters) {
      activeFilters = this.props.activeFilters.toArray().map(filter =>
        <FilterBadge filter={filter}
                     key={filter.get('label') + filter.get('type')}
                     onRemove={filters.removeFilter}/>
      );
    }
    return (
      <div className={block}>
        <div className={block + '__input-simulation'}>
          {activeFilters}
          <QueryInput value={this.state.currentTypedInValue}
                      onChange={this.onInputChange}
                      onConfirm={this.onConfirm}
                      onNextSuggestion={this.onNextSuggestion}
                      onPreviousSuggestion={this.onPreviousSuggestion}
                      onClear={this.onClear}/>
        </div>

        <SuggestionPanel suggestions={this.state.suggestions}
                         activeFilters={this.props.activeFilters}
                         onSuggestionClick={this.onSuggestionClick}
                         selectedSuggestion={this.state.selectedSuggestion}/>
      </div>
    );
  },

  onInputChange(newValue) {
    if (newValue.trim().length > 2) {
      this.setState({
        currentTypedInValue: newValue
      });
      this.loadSuggestions(newValue);
    } else {
      this.setState({
        currentTypedInValue: newValue,
        suggestions: noSuggestions,
        selectedSuggestion: -1
      });
      this.disposeSuggestions();
    }
  },

  loadSuggestions(query) {
    const previousSubscription = this.suggestionSubscription;

    this.suggestionSubscription = filtering.getSuggestions(query)
      .subscribe(suggestions => {
        // ensure that the selecred index shrinks when the number of possible
        // selections are reduced.
        const nextIndex = Math.min(
          this.state.selectedSuggestion,
          suggestions.size - 1
        );

        this.setState({
          suggestions,
          selectedSuggestion: nextIndex
        });
      });

    if (previousSubscription) {
      previousSubscription.dispose();
    }
  },

  disposeSuggestions() {
    if (this.suggestionSubscription) {
      this.suggestionSubscription.dispose();
      this.suggestionSubscription = null;
    }
  },

  onSuggestionClick(suggestion) {
    filters.addFilter(suggestion);
    this.setState({
      selectedSuggestion: -1,
      currentTypedInValue: '',
      suggestions: noSuggestions
    });
    this.disposeSuggestions();
  },

  onConfirm() {
    let selectedSuggestion = this.state.selectedSuggestion;
    if (selectedSuggestion === -1) {
      selectedSuggestion = 0;
    }

    const suggestion = this.state.suggestions.get(selectedSuggestion);
    if (suggestion) {
      this.onSuggestionClick(suggestion);
    }
  },

  onNextSuggestion() {
    const nextIndex = Math.min(
      this.state.selectedSuggestion + 1,
      this.state.suggestions.size - 1
    );
    this.setState({
      selectedSuggestion: nextIndex
    });
  },

  onPreviousSuggestion() {
    const nextIndex = Math.max(
      this.state.selectedSuggestion - 1,
      0
    );
    this.setState({
      selectedSuggestion: nextIndex
    });
  },

  onClear() {
    this.setState({
      selectedSuggestion: -1,
      currentTypedInValue: '',
      suggestions: noSuggestions
    });
    this.disposeSuggestions();
  }
});

export default enhance(QueryBuilder);
