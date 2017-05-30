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
      this.subscriptions = new Map();
      this.observables = new Map();

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
      const oldProperties = this.observables;

      for (let i = 0, length = newProperties.length; i < length; i++) {
        const property = newProperties[i];
        const prevObservable = this.observables.get(property);
        const newObservable = observables[property];

        if (prevObservable === newObservable) {
          // Nothing to do, we have the same observable
          return;
        }

        const oldSubscription = this.subscriptions.get(property);
        this.observables.set(property, newObservable);
        this.subscriptions.set(property, newObservable.subscribe(this.onNewValue, null, property));

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
      const removedProperties = [];
      oldProperties.forEach((property, key) => {
        if (!observables[key]) {
          removedProperties.push(key);
        }
      });

      const clearStateProps = {};
      for (let i = 0, len = removedProperties.length; i < len; i++) {
        const property = removedProperties[i];
        this.subscriptions.get(property).dispose();
        this.subscriptions.delete(property);
        this.observables.delete(property);
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
      this.subscriptions.forEach(sub => sub.dispose());
    }

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  };
}
