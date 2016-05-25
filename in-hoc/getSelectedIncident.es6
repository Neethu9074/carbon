import React from 'react';

import {selectedIncident$} from 'in-stores/incident';

export default function getSelectedIncident(ComposedComponent) {
  return React.createClass({
    displayName: 'getSelectedIncident hoc for ' + ComposedComponent.displayName,

    getInitialState() {
      return {
        incidentId: null,
        incident: null
      };
    },

    componentWillMount() {
      this.subscription = selectedIncident$.subscribe(incident =>
        this.setState({
          incident
        }));
    },

    componentWillUnmount() {
      this.subscription.dispose();
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
