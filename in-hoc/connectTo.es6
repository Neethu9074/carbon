import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

export default function connectTo(createObservables, ComposedComponent) {
  return React.createClass({
    displayName: 'connectTo hoc for ' + ComposedComponent.displayName,

    mixins: [SubscriptionMixin],

    getInitialState() {
      return {};
    },

    componentWillMount() {
      this.subscribe(this.props);
    },

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps);
    },

    subscribe(props) {
      let observables;
      if (typeof createObservables === 'function') {
        observables = createObservables(props);
      } else {
        observables = createObservables;
      }

      const newSubscriptions = Object.keys(observables).map(key => {
        return observables[key].subscribe(value => {
          this.setState({
            [key]: value
          });
        });
      });

      // dispose previous subscriptions only after new subscriptions were
      // established to ensure that the connection to the backend does not
      // need to be reestablished.
      this.disposeSubscriptions();
      newSubscriptions.forEach(this.addSubscription);
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
