import { createFactory, Component } from 'react';
import { create } from 'reactive-observables';

import { applicationFilter as applicationFilterMatrixParameter } from 'in-analyze/navigation/matrix';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';

export default () => ComposedComponent => {
  const factory = createFactory(ComposedComponent);

  return class StatefulFlowMapComponent extends Component {
    static displayName = getDisplayName('withTagSuggestions', ComposedComponent);

    constructor(props) {
      super(props);

      this.state = {
        name: props.name || '',
        value: props.value || '',
        tagSuggestionOptions: []
      };

      this.applyChangesQueue$ = create();

      this.applyChangesQueueSubscription = this.applyChangesQueue$.throttle(500).subscribe(() => this.getSuggestions());
    }

    componentDidMount() {
      this.applyChangesQueue$.emit('signal', true);
    }

    componentWillUpdate(nextProps, nextState) {
      if (this.state.name === nextState.name && this.state.value === nextState.value) {
        return;
      }

      this.applyChangesQueue$.emit('signal', true);
    }

    componentWillUnmount() {
      this.disposeTagSubscription();

      this.applyChangesQueueSubscription.dispose();
      this.applyChangesQueueSubscription = null;
    }

    render() {
      return factory({
        setName: this.setNameForTagSuggestion,
        setValue: this.setValueForTagSuggestion,
        ...this.props,
        ...this.state
      });
    }

    setNameForTagSuggestion = name => {
      this.setState = { name };
    };

    setValueForTagSuggestion = value => {
      this.setState = { value };
    };

    queueNextFlowMapState = nextFlowMapState => {
      this.flowMapStateQueue$.emit(nextFlowMapState);
    };

    getSuggestions() {
      this.disposeTagSubscription();

      this.tagSuggestions$ = getTagSuggestions({
        filter: {
          timeConfig: this.props.filters.get('timeConfig')
        },
        tagFilters: getTagFilterList(this.props.filters),
        tagName: this.state.name,
        secondLevelKeyTagName: null,
        requestingSecondaryKeySuggestions: false,
        valueFilter: null
      })
        .map(getEndpointTypesComboBoxItems)
        .subscribe(tagSuggestionOptions => this.setState({ tagSuggestionOptions }));
    }

    disposeTagSubscription = () => {
      if (this.tagSuggestions$) {
        this.tagSuggestions$.dispose();
        this.tagSuggestions$ = null;
      }
    };
  };
};

export function getEndpointTypesComboBoxItems(autoCompletedValuesResult) {
  if (!autoCompletedValuesResult.data) {
    return [];
  }

  return autoCompletedValuesResult.data.suggestions.map(suggestion => ({
    value: suggestion,
    label: suggestion
  }));
}

function getTagFilterList(filters) {
  const tagFilters = [];

  const application = filters.getIn([applicationFilterMatrixParameter, APPLICATION.id]);
  const service = filters.getIn([applicationFilterMatrixParameter, SERVICE.id]);
  const endpoint = filters.getIn([applicationFilterMatrixParameter, ENDPOINT.id]);
  if (application) {
    tagFilters.push({ name: APPLICATION.technicalName, stringValue: application.get('value') });
  }
  if (service) {
    tagFilters.push({ name: SERVICE.technicalName, stringValue: service.get('value') });
  }
  if (endpoint) {
    tagFilters.push({ name: ENDPOINT.technicalName, stringValue: endpoint.get('value') });
  }

  return tagFilters;
}
