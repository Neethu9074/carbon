import { createFactory, Component } from 'react';
import { create } from 'reactive-observables';

import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
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
        tag2ndLevelSuggestionOptions: []
      };

      this.getValueQueue$ = create();
      this.get2ndLevelTagQueue$ = create();

      this.getValueQueueSubscription = this.getValueQueue$
        .debounce(500)
        .subscribe(state => this.getValueSuggestions(state));

      // temp disable until we support it
      // this.get2ndLevelTagQueueSubscription = this.get2ndLevelTagQueue$
      //   .debounce(500)
      //   .subscribe(state => this.get2ndLevelNameSuggestions(state));

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

      // this.get2ndLevelTagQueueSubscription.dispose();
      // this.get2ndLevelTagQueueSubscription = null;

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

      if (_name !== APPLICATION.name && _name !== SERVICE.name && _name !== ENDPOINT.name) {
        this.setState({ tagSuggestionOptions: undefined });
        return;
      }

      const tagName = _name;
      const filters = this.props.filters;
      const node = findSubTreeByFullyQualifiedName(tagName);
      if (!node || !node.isTag) {
        return;
      }

      this.tagValueSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: filters.get('timeConfig')
        },
        tagFilters: getTagFilterList(tagName, filters),
        tagName,
        secondLevelKeyTagName: custom2ndLevelName,
        requestingSecondaryKeySuggestions: false,
        valueFilter: null
      })
        .startWith(null)
        .map(getEndpointTypesComboBoxItems)
        .subscribe(tagSuggestionOptions => this.setState({ tagSuggestionOptions }));
    }

    get2ndLevelNameSuggestions({ _name }) {
      this.dispose2ndLevelNameSuggestion();

      const tagName = _name;
      const filters = this.props.filters;
      const node = findSubTreeByFullyQualifiedName(tagName);
      if (!node || !node.isTag || node.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
        return;
      }

      this.tag2ndLevelNameSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: filters.get('timeConfig')
        },
        tagFilters: getTagFilterList(tagName, filters),
        tagName,
        secondLevelKeyTagName: tagName,
        requestingSecondaryKeySuggestions: true,
        valueFilter: null
      })
        .map(getEndpointTypesComboBoxItems)
        .subscribe(tag2ndLevelSuggestionOptions => this.setState({ tag2ndLevelSuggestionOptions }));
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

function getEndpointTypesComboBoxItems(autoCompletedValuesResult) {
  if (!autoCompletedValuesResult || !autoCompletedValuesResult.data) {
    return null;
  }

  return autoCompletedValuesResult.data.suggestions.map(suggestion => ({
    value: suggestion,
    label: suggestion
  }));
}

function getTagFilterList(tagName, filters) {
  const tagFilters = [];

  const tagFilter = filters.get('tagFilter').toJS();

  let application;
  let service;
  let endpoint;

  for (let i = 0; i < tagFilter.length; i++) {
    const tag = tagFilter[i];
    if (tag.name === APPLICATION.name) {
      application = tag;
    } else if (tag.name === SERVICE.name) {
      service = tag;
    } else if (tag.name === ENDPOINT.name) {
      endpoint = tag;
    }
  }

  const isApplicationTag = tagName !== APPLICATION.name;
  const isServiceTag = tagName !== SERVICE.name;
  const isEndpointTag = tagName !== ENDPOINT.name;

  if (application && isApplicationTag) {
    tagFilters.push({ name: APPLICATION.technicalName, stringValue: application.value });
  }
  if (service && (isApplicationTag && isServiceTag)) {
    tagFilters.push({ name: SERVICE.technicalName, stringValue: service.value });
  }
  if (endpoint && (isApplicationTag && isServiceTag && isEndpointTag)) {
    tagFilters.push({ name: ENDPOINT.technicalName, stringValue: endpoint.value });
  }

  return tagFilters;
}
