/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import { defaultsDeep } from 'lodash';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { shallowEquals } from 'in-services/util/object';
import { emptyObject } from 'in-services/fixedObjects';

const defaultOptions = {
  pure: true
};

export default function connectTo(createObservables, ComposedComponent, opts) {
  if (arguments.length === 1) {
    return doCreateConnectedComponent.bind(null, createObservables);
  }
  return doCreateConnectedComponent(createObservables, ComposedComponent, opts);
}

function doCreateConnectedComponent(createObservables, ComposedComponent, opts) {
  const needsToCreateObservables = typeof createObservables === 'function';
  opts = defaultsDeep(opts || {}, defaultOptions);

  class ConnectedComponent extends React.Component {
    static displayName = getDisplayName(ComposedComponent, 'connect');
    static propTypes = ComposedComponent.propTypes;
    state = {};

    UNSAFE_componentWillMount() {
      this.subscriptions = new Map();
      this.observables = new Map();

      let observables;
      if (needsToCreateObservables) {
        observables = createObservables(this.props, emptyObject);
      } else {
        observables = createObservables;
      }
      this.subscribe(observables);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (needsToCreateObservables && (!opts.pure || !shallowEquals(this.props, nextProps))) {
        this.subscribe(createObservables(nextProps, this.props));
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
          continue;
        }

        const oldSubscription = this.subscriptions.get(property);
        if (newObservable) {
          this.observables.set(property, newObservable);
          this.subscriptions.set(property, newObservable.subscribe(this.onNewValue, null, property));
        }

        // dispose previous subscriptions only after new subscriptions were
        // established to ensure that the connection to the backend does not
        // need to be reestablished. This makes reference counting more
        // efficient for subscriptions that are immediately disposed or
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
      return <ComposedComponent {...this.props} {...this.state} ref={this.props.refSetter} />;
    }
  }

  return forwardRef(function connectedComponentRefWrapper(props, ref) {
    return <ConnectedComponent {...props} refSetter={ref} />;
  });
}
