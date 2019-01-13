import { createFactory, Component } from 'react';
import { isEqual } from 'lodash';

import { mutateUrl, navigationParameters$, getModifiedUrlStream } from 'in-stores/navigation';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { identity } from 'in-services/util/function';
import history from 'in-stores/navigation/history';

// Sample usage
// withUrlState({
//   // only these keys will be mapped / read from the URL
//   bind: [
//     { // matrix parameter
//       path: '/things',
//       name: 'thingId'
//       as: 'thing', // optional, will use "name" when "as" is not defined
//       parser: parseInt
//     },
//     { // query parameter because path definition is missing
//       name: 'snapshotId'
//     }
//   ],
//
//   // define the initial state for the bound keys
//   initialState,
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
//       onReset: () => ({ page: 1 })
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
  initialState,
  bind,
  // TODO
  // resets = emptyArray,
  reducerName,
  reduceAndGetAsUrlName,
  reducer = defaultingReducer,
  replaceHistory = true
}) => BaseComponent => {
  bind.forEach(b => (b.as = b.as || b.name));

  reduceAndGetAsUrlName = reduceAndGetAsUrlName || `${reducerName}AndGetAsUrl`;
  replaceHistory = Boolean(replaceHistory);

  const factory = createFactory(BaseComponent);

  return class WithUrlState extends Component {
    static displayName = getDisplayName(BaseComponent, 'withUrlState');

    constructor(props) {
      super(props);
      // Initialize initial state so that the initial state already depends on the URL.
      // Otherwise we risk WithUrlState resets kicking in as well as unnecessary data retrieval.
      let state = initialState;
      state = this.determineStateChange(history.location, state) || state;
      this.state = state;
    }

    componentDidMount() {
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
      // retrieve all bindings from the URL
      let newState = {};
      bind.forEach(({ path, name, as, parser = identity }) => {
        let value = undefined;
        if (path) {
          value = getMatrixParameter(location, path, name);
        } else {
          value = location.query[name];
        }

        if (value != null) {
          newState[as] = parser(value);
        } else {
          newState[as] = initialState[as];
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
      bind.forEach(({ path, name, as, serializer = identity }) => {
        const value = state[as];
        if (path) {
          setOrDeleteMatrixKey(location, path, name, serializer(value));
        } else {
          if (value != null) {
            location.query[name] = serializer(value);
          } else {
            delete location.query[name];
          }
        }
      });
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
    change
  };
}
