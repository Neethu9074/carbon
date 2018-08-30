import { createFactory, Component } from 'react';
import { create } from 'reactive-observables';

import { getTagFilterListForSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { TAG_TYPES } from 'in-analyze/applicationFilter';

export default () => ComposedComponent => {
  const factory = createFactory(ComposedComponent);

  return class StatefulWithTagSuggestionsComponent extends Component {
    static displayName = getDisplayName('withTagSuggestions', ComposedComponent);

    constructor(props) {
      super(props);

      this.state = {
        _name: props.name,
        custom2ndLevelName: null,
        tagSuggestionOptions: undefined,
        tag2ndLevelNameSuggestionOptions: undefined
      };

      this.getValueQueue$ = create();
      this.get2ndLevelTagQueue$ = create();

      this.getValueQueueSubscription = this.getValueQueue$
        .debounce(500)
        .subscribe(state => this.getValueSuggestions(state));

      this.get2ndLevelTagQueueSubscription = this.get2ndLevelTagQueue$
        .debounce(500)
        .subscribe(state => this.get2ndLevelNameSuggestions(state));

      this.getValueQueue$.emit(this.state);
      this.get2ndLevelTagQueue$.emit(this.state);
    }

    componentWillUpdate(nextProps, nextState) {
      const isNameEqual = this.state._name === nextState._name;
      const is2ndLevelNameEqual = this.state.custom2ndLevelName === nextState.custom2ndLevelName;

      if (isNameEqual && is2ndLevelNameEqual) {
        return;
      } else if (isNameEqual && !is2ndLevelNameEqual) {
        this.getValueQueue$.emit(nextState);
      } else {
        this.getValueQueue$.emit(nextState);
        this.get2ndLevelTagQueue$.emit(nextState);
      }
    }

    componentWillUnmount() {
      this.disposeTagSubscriptions();

      this.getValueQueueSubscription.dispose();
      this.getValueQueueSubscription = null;

      this.get2ndLevelTagQueueSubscription.dispose();
      this.get2ndLevelTagQueueSubscription = null;

      this.getValueQueue$ = null;
      this.get2ndLevelTagQueue$ = null;
    }

    render() {
      return factory({
        setNameForTagSuggestion: this.setNameForTagSuggestion,
        set2ndLevelNameForTagSuggestion: this.set2ndLevelNameForTagSuggestion,
        ...this.props,
        ...this.state
      });
    }

    setNameForTagSuggestion = name => {
      this.setState({ _name: name });
    };

    set2ndLevelNameForTagSuggestion = custom2ndLevelName => {
      this.setState({ custom2ndLevelName });
    };

    getValueSuggestions({ _name, custom2ndLevelName }) {
      this.disposeValueSuggestion();

      const tagName = _name;
      const filters = this.props.filters;
      const node = findSubTreeByFullyQualifiedName(tagName);
      if (
        !node ||
        node.type == TAG_TYPES.NUMBER.technicalName || // no value suggestion for number type tag
        node.type == TAG_TYPES.BOOLEAN.technicalName || // no value suggestion for boolean type tag
        (node.type == TAG_TYPES.KEY_VALUE_PAIR.technicalName && !custom2ndLevelName)
      ) {
        this.setState({ tagSuggestionOptions: undefined });
        return;
      }

      this.tagValueSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: filters.get('timeConfig')
        },
        tagFilters: getTagFilterListForSubscription(filters.get('tagFilter').toJS()),
        tagName,
        secondLevelKeyTagName: custom2ndLevelName,
        valueFilter: null
      })
        .startWith(null)
        .map(getTagSuggestionOptions)
        .subscribe(tagSuggestionOptions => this.setState({ tagSuggestionOptions }));
    }

    get2ndLevelNameSuggestions({ _name }) {
      this.dispose2ndLevelNameSuggestion();

      const tagName = _name;
      const filters = this.props.filters;
      const node = findSubTreeByFullyQualifiedName(tagName);
      if (!node || node.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
        return;
      }

      this.tag2ndLevelNameSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: filters.get('timeConfig')
        },
        tagFilters: getTagFilterListForSubscription(filters.get('tagFilter').toJS()),
        tagName,
        secondLevelKeyTagName: null,
        valueFilter: null
      })
        .map(getTagSuggestionOptions)
        .subscribe(tag2ndLevelNameSuggestionOptions => this.setState({ tag2ndLevelNameSuggestionOptions }));
    }

    disposeValueSuggestion = () => {
      if (this.tagValueSuggestions$) {
        this.tagValueSuggestions$.dispose();
        this.tagValueSuggestions$ = null;
      }
    };

    dispose2ndLevelNameSuggestion = () => {
      if (this.tag2ndLevelNameSuggestions$) {
        this.tag2ndLevelNameSuggestions$.dispose();
        this.tag2ndLevelNameSuggestions$ = null;
      }
    };

    disposeTagSubscriptions = () => {
      this.disposeValueSuggestion();
      this.dispose2ndLevelNameSuggestion();
    };
  };
};

function getTagSuggestionOptions(getTagSuggestionsResult) {
  if (!getTagSuggestionsResult) {
    return null;
  }

  if (getTagSuggestionsResult.errors.length > 0) {
    return [];
  }

  if (!getTagSuggestionsResult.data) {
    return null;
  }

  return getTagSuggestionsResult.data.suggestions.map(suggestion => ({
    value: suggestion,
    label: suggestion
  }));
}
