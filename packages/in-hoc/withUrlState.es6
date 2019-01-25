import { createFactory, Component } from 'react';
import { isEqual } from 'lodash';

import { mutateUrl, navigationParameters$, getModifiedUrlStream } from 'in-stores/navigation';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { addReset, removeReset } from 'in-stores/navigation/urlParameterResets';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { identity } from 'in-services/util/function';
import history from 'in-stores/navigation/history';

// Sample usage
// withUrlState({
//   // only these keys will be mapped / read from the URL
//   bind: [
//     { // matrix parameter
//       path: '/things',
//       name: 'page'
//       as: 'page', // optional, will use "name" when "as" is not defined
//       parser: v => v != null ? parseInt(v) : v,
//       serializer: String,
//       initialState: 1
//     },
//     { // query parameter because path definition is missing
//       name: 'snapshotId'
//     }
//   ],
//
//   // define cases which should reset / change the URL state
//   resets: [
//     // reset the page to 1 when one of the properties changes which are used in get
//     {
//       bind: [
//         {
//           name: 'snapshotId'
//         }
//       ],
//       reset: { page: 1 }
//     }
//   ],
//
//   // function to set the new page/order/query
//   reducerName: 'onChange',
//
//   // function to be used to apply changes and to get the result as an URL observable
//   reduceAndGetAsUrlName: 'getChangeAsUrl',
//
//   reducer: (prev, change) => ({...prev, foo: change}),
//
//  // whether or not the history should be replaced or not, i.e. whether new history entries
//  // should be created for any call to the reducer.
//  replaceHistory: true
// })

export default ({
  bind,
  resets = emptyArray,
  reducerName,
  reduceAndGetAsUrlName,
  reducer = defaultingReducer,
  replaceHistory = true
}) => BaseComponent => {
  const bindByAs = {};
  bind = bind.map(b => {
    bindByAs[b.as || b.name] = b;
    return {
      ...b,
      as: b.as || b.name
    };
  });
  resets = resets.map(r => ({
    ...r,
    as: r.as || r.name
  }));

  reduceAndGetAsUrlName = reduceAndGetAsUrlName || `${reducerName}AndGetAsUrl`;
  replaceHistory = Boolean(replaceHistory);

  const factory = createFactory(BaseComponent);

  return class WithUrlState extends Component {
    static displayName = getDisplayName(BaseComponent, 'withUrlState');

    constructor(props) {
      super(props);
      // Initialize initial state so that the initial state already depends on the URL.
      // Otherwise we risk WithUrlState resets kicking in as well as unnecessary data retrieval.
      this.state = this.determineStateChange(history.location, emptyObject) || emptyObject;
    }

    componentDidMount() {
      if (resets.length > 0) {
        addReset(this.executeResets);
      }

      this.locationSubscription = navigationParameters$
        // Simple yet effective way to avoid state updates when navigating away from a route.
        // When not doing this, it can happen that we update this state and a downstream
        // component makes a backend request. Following that request, the component is
        // immediately unmounted and therefore the request is pointless.
        // Handling updates on the next frame will mean that React gets a chance to unmount
        // a component which will call this component's componentWillUnmount which will
        // cancel the location subscription.
        .nextFrame()
        .subscribe(this.onLocationChange);
    }

    componentWillUnmount() {
      if (resets.length > 0) {
        removeReset(this.executeResets);
      }

      if (this.locationSubscription) {
        this.locationSubscription.dispose();
      }
    }

    onLocationChange = location => {
      const newState = this.determineStateChange(location, this.state);
      if (newState) {
        this.setState(newState);
      }
    };

    determineStateChange(location, currentState) {
      let newState = {};
      bind.forEach(({ path, name, as, parser = identity, initialState }) => {
        let value = undefined;
        if (path) {
          value = getMatrixParameter(location, path, name);
        } else {
          value = location.query[name];
        }

        if (value != null) {
          newState[as] = parser(value);
        } else {
          newState[as] = initialState;
        }
      });

      return isEqual(newState, currentState) ? null : newState;
    }

    reducer = change => {
      const newState = this.applyReducer(change);
      mutateUrl(location => this.modifyLocation(newState, location), replaceHistory);
    };

    getModifiedUrl = change => {
      const state = this.applyReducer(change);
      return getModifiedUrlStream(location => this.modifyLocation(state, location));
    };

    applyReducer(change) {
      return reducer(this.state, change);
    }

    modifyLocation(state, location) {
      bind.forEach(bind => this.setBindValue(bind, state[bind.as], location));
    }

    setBindValue({ path, name, serializer = String }, value, location) {
      if (path) {
        if (value != null) {
          setOrDeleteMatrixKey(location, path, name, serializer(value));
        } else {
          setOrDeleteMatrixKey(location, path, name);
        }
      } else {
        if (value != null) {
          location.query[name] = serializer(value);
        } else {
          delete location.query[name];
        }
      }
    }

    executeResets = (previousLocation, nextLocation) => {
      resets.forEach(({ bind, reset }) => {
        if (this.shouldExecuteReset(previousLocation, nextLocation, bind)) {
          Object.keys(reset).forEach(key => this.setBindValue(bindByAs[key], reset[key], nextLocation));
        }
      });
    };

    shouldExecuteReset(previousLocation, nextLocation, bind) {
      // fori loop for early return
      for (let i = 0; i < bind.length; i++) {
        const { path, name } = bind[i];
        let previousValue;
        let nextValue;

        if (path) {
          previousValue = getMatrixParameter(previousLocation, path, name);
          nextValue = getMatrixParameter(nextLocation, path, name);
        } else {
          previousValue = previousLocation.query[name];
          nextValue = nextLocation.query[name];
        }

        if (nextValue !== previousValue) {
          return true;
        }
      }

      return false;
    }

    render() {
      return factory({
        ...this.props,
        ...this.state,
        [reducerName]: this.reducer,
        [reduceAndGetAsUrlName]: this.getModifiedUrl
      });
    }
  };
};

function defaultingReducer(state, change) {
  return {
    ...state,
    ...change
  };
}
