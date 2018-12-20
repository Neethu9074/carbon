import { createFactory, Component } from 'react';
import { create } from 'reactive-observables';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
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
        tagSuggestionResult: null,
        tagSecondLevelNameSuggestionResult: null
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
        node.name == 'trace.id' || // no value suggestion for trace.id tag
        (node.type == TAG_TYPES.KEY_VALUE_PAIR.technicalName && !custom2ndLevelName)
      ) {
        this.setState({ tagSuggestionResult: null });
        return;
      }

      this.tagValueSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: filters.timeConfig
        },
        tagFilters: getTagFilterListForBackendSubscription(filters.tagFilter),
        tagName,
        secondLevelKeyTagName: custom2ndLevelName,
        valueFilter: null
      })
        .startWith(null)
        .subscribe(tagSuggestionResult => this.setState({ tagSuggestionResult }));
    }

    get2ndLevelNameSuggestions({ _name }) {
      this.dispose2ndLevelNameSuggestion();

      const tagName = _name;
      const filters = this.props.filters;
      const node = findSubTreeByFullyQualifiedName(tagName);
      if (!node || node.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
        this.setState({ tagSecondLevelNameSuggestionResult: null });
        return;
      }

      this.tag2ndLevelNameSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: filters.timeConfig
        },
        tagFilters: getTagFilterListForBackendSubscription(filters.tagFilter),
        tagName,
        secondLevelKeyTagName: null,
        valueFilter: null
      }).subscribe(tagSecondLevelNameSuggestionResult => this.setState({ tagSecondLevelNameSuggestionResult }));
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
