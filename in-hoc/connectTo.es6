import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import { defaultsDeep } from 'lodash';

const defaultOptions = {
  pure: true
};

export default function connectTo(createObservables, ComposedComponent, opts) {
  const needsToCreateObservables = typeof createObservables === 'function';
  opts = defaultsDeep(opts || {}, defaultOptions);

  return class extends React.Component {
    static displayName = 'connectTo hoc for ' + (ComposedComponent.displayName || ComposedComponent.name);
    state = {};

    componentWillMount() {
      this.subscriptions = {};
      this.observables = {};

      let observables;
      if (needsToCreateObservables) {
        observables = createObservables(this.props);
      } else {
        observables = createObservables;
      }
      this.subscribe(observables);
    }

    componentWillReceiveProps(nextProps) {
      if (needsToCreateObservables && (!opts.pure || !shallowEquals(this.props, nextProps))) {
        this.subscribe(createObservables(nextProps));
      }
    }

    subscribe = observables => {
      const newProperties = Object.keys(observables);
      const oldProperties = Object.keys(this.observables);

      for (let i = 0, len = newProperties.length; i < len; i++) {
        const property = newProperties[i];
        const prevObservable = this.observables[property];
        const newObservable = observables[property];

        if (prevObservable === newObservable) {
          // Nothing to do, we have the same observable
          return;
        }

        const oldSubscription = this.subscriptions[property];
        this.observables[property] = newObservable;
        this.subscriptions[property] = newObservable.subscribe(this.onNewValue, property);

        // dispose previous subscriptions only after new subscriptions were
        // established to ensure that the connection to the backend does not
        // need to be reestablished. This makes reference counting more
        // efficient for subscriptions which are immediately disposed or
        // for which values are immediately recalculated.
        if (oldSubscription) {
          oldSubscription.dispose();
        }
      }

      // Remove properties / subscriptions for all properties that haven't been
      // recreated / are not found in the new observable map.
      const removedProperties = oldProperties.filter(property => !observables[property]);
      const clearStateProps = {};
      for (let i = 0, len = removedProperties.length; i < len; i++) {
        const property = removedProperties[i];
        this.subscriptions[property].dispose();
        delete this.subscriptions[property];
        delete this.observables[property];
        clearStateProps[property] = null;
      }
      this.setState(clearStateProps);
    };

    onNewValue = (value, property) => {
      this.setState({
        [property]: value
      });
    };

    componentWillUnmount() {
      Object.keys(this.subscriptions).forEach(key => this.subscriptions[key].dispose());
    }

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  };
}
