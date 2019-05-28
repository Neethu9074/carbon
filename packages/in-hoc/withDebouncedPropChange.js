import shallowEquals from 'fbjs/lib/shallowEqual';
import { createFactory, Component } from 'react';
import { pick } from 'lodash';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';

// propsConfig maps each property name to a function which determines the change delay
// [property name]: (prevProp, nextProp) => number
export default propsConfig => ComposedComponent => {
  const debouncedKeys = Object.keys(propsConfig);
  const factory = createFactory(ComposedComponent);

  return class WithDebouncedPropChange extends Component {
    static displayName = getDisplayName('withDebouncedPropChange', ComposedComponent);

    constructor(props) {
      super(props);
      this.state = pick(props, debouncedKeys);
      this.debounceHandles = new Map();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const immediateStateTransition = {};

      debouncedKeys.forEach(key => {
        const currentProp = this.props[key];
        const nextProp = nextProps[key];
        if (shallowEquals(currentProp, nextProp)) {
          // nothing to do. Either we have already scheduled a delayed update of this.state
          // or the value is up to date in this.state
          return;
        }

        this.clearDebounceHandle(key);

        const delay = propsConfig[key](currentProp, nextProp);
        if (delay == null || delay < 1) {
          immediateStateTransition[key] = nextProp;
        } else {
          this.debounceHandles.set(key, setTimeout(this.setStateValue, delay, key, nextProp));
        }
      });

      this.setState(immediateStateTransition);
    }

    setStateValue = (k, v) => {
      this.setState({ [k]: v });
    };

    clearDebounceHandle(key) {
      const handle = this.debounceHandles.get(key);
      if (handle) {
        clearTimeout(handle);
        this.debounceHandles.delete(key);
      }
    }

    componentWillUnmount() {
      this.debounceHandles.forEach(handle => clearTimeout(handle));
    }

    render() {
      return factory({
        ...this.props,
        ...this.state
      });
    }
  };
};
