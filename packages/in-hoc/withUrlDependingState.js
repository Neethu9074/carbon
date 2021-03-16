/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { pick, curryRight, defaults, isEqual } from 'lodash';
import React, { Component } from 'react';

import { mutateUrl, navigationParameters$, getModifiedUrlStream } from 'in-stores/navigation';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { identity } from 'in-services/util/function';
import history from 'in-stores/navigation/history';

// Sample usage
// withUrlDependingState({
//   // the path segment under which the matrix parameters are registered
//   getPathSegment: ({ pathSegment }) => pathSegment,
//
//   // an optional prefix for the matrix parameter keys
//   getMatrixPrefix: ({ matrixPrefix }) => matrixPrefix || '',
//
//   // only these keys will be mapped / read from the URL
//   boundKeys: ['orderBy', 'orderDirection', 'page', 'pageSize', 'query'],
//
//   // given the props, define the initial state
//   getInitialState,
//
//   // define cases which should reset / change the URL state
//   resets: [
//     // reset the page to 1 when one of the properties changes that are used in get
//     {
//       getResettingProps: ({paginationResettingProps}) => paginationResettingProps || emptyArray,
//       onReset: () => ({ page: 1 })
//     },
//
//     // reset everything once one of the basic properties changes
//     {
//       getResettingProps: () => [
//         'columnDefinitions',
//         'defaultOrderBy',
//         'defaultOrderDirection',
//         'defaultPageSize',
//         'defaultQuery',
//         'get'
//       ],
//       onReset: getInitialState
//     }
//   ],
//
//   // page and pageSize are just strings in the URL. Parse these values, because the downstream
//   // code is expecting numbers.
//   getParsedUrlValues: urlValues => ({
//     page: urlValues.page != null ? parseInt(urlValues.page, 10) : null,
//     pageSize: urlValues.pageSize != null ? parseInt(urlValues.pageSize, 10) : null
//   }),
//
//   // function to set the new page/order/query
//   reducerName: 'onChange'
//
//   // function to be used to apply changes and to get the result as an URL observable
//   reduceAndGetAsUrlName: 'getChangeAsUrl',
//
//  // whether or not the history should be replaced or not, i.e. whether new history entries
//  // should be created for any call to the reducer.
//  replaceHistory: true
// })

export default ({
  getPathSegment,
  getInitialState,
  getMatrixPrefix,
  boundKeys = emptyArray,
  resets = emptyArray,
  reducerName,
  reduceAndGetAsUrlName,
  reducer = defaultingReducer,
  getParsedUrlValues = identity,
  getSerializedUrlValues = identity,
  replaceHistory = true
}) => BaseComponent => {
  const pickBoundKeys = boundKeys.length > 0 ? curryRight(pick, 2)(boundKeys) : identity;

  if (!reduceAndGetAsUrlName) {
    reduceAndGetAsUrlName = `${reducerName}AndGetAsUrlObservable`;
  }

  return class WithUrlDependingState extends Component {
    static displayName = getDisplayName(BaseComponent, 'withUrlDependingState');

    constructor(props) {
      super(props);
      // Initialize initial state so that the initial state already depends on the URL.
      // Otherwise we risk WithUrlDependingState resets kicking in as well as unnecessary
      // data retrieval.
      let urlDependingState = getInitialState(props);
      urlDependingState =
        this.calculateUrlDependingState(history.location, props, urlDependingState) || urlDependingState;
      this.state = {
        urlDependingState
      };
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
      const newState = this.calculateUrlDependingState(location, this.props, this.state);
      if (newState) {
        this.setState({
          urlDependingState: newState
        });
      }
    };

    calculateUrlDependingState(location, props, state) {
      let urlValues = emptyObject;
      const forPathSegment = getPathSegment(props);
      const matrixPrefix = getMatrixPrefix(props);
      if (location.matrix[forPathSegment] != null) {
        urlValues = boundKeys.reduce((agg, k) => {
          agg[k] = location.matrix[forPathSegment][`${matrixPrefix}${k}`];
          return agg;
        }, {});

        let parsedUrlValues = getParsedUrlValues(urlValues);
        // filter null/undefined values that are considered to be existing properties by defaults
        parsedUrlValues = Object.keys(parsedUrlValues).reduce((agg, k) => {
          if (urlValues[k] != null) {
            agg[k] = parsedUrlValues[k];
          }
          return agg;
        }, {});

        urlValues = defaults({}, parsedUrlValues, urlValues);
      }

      const defaultValues = pickBoundKeys(getInitialState(props));
      const newState = defaults({}, urlValues, defaultValues);
      if (isEqual(newState, state.urlDependingState)) {
        return null;
      }
      return newState;
    }

    componentDidUpdate(prevProps) {
      const nextProps = this.props;
      let resetExecuted = false;
      const resultingState = resets.reduce((newState, { getResettingProps, onReset }) => {
        const pickResettingProps = curryRight(pick, 2)(getResettingProps(nextProps));
        if (isEqual(pickResettingProps(prevProps), pickResettingProps(nextProps))) {
          return newState;
        }

        resetExecuted = true;
        return defaults({}, onReset(nextProps), newState);
      }, defaults({}, this.state.urlDependingState));

      if (resetExecuted && !isEqual(pickBoundKeys(resultingState), this.state.urlDependingState)) {
        this.setValuesInMatrixParameters(pickBoundKeys(resultingState), true);
      }
    }

    reducer = change => this.setValuesInMatrixParameters(this.applyReducer(change));

    applyReducer(change) {
      return pickBoundKeys(reducer(this.state.urlDependingState, change, this.props));
    }

    setValuesInMatrixParameters(values, forceHistoryReplacement = false) {
      mutateUrl(params => this.modifyParams(values, params), Boolean(replaceHistory) || forceHistoryReplacement);
    }

    modifyParams(values, params) {
      const serializedValues = defaults({}, getSerializedUrlValues(values), values);
      const forPathSegment = getPathSegment(this.props);
      const matrixPrefix = getMatrixPrefix(this.props);
      const matrixValues = (params.matrix[forPathSegment] = params.matrix[forPathSegment] || {});
      Object.keys(serializedValues).forEach(k => (matrixValues[`${matrixPrefix}${k}`] = serializedValues[k]));
    }

    getModifiedUrl = change => {
      const values = this.applyReducer(change);
      return getModifiedUrlStream(params => this.modifyParams(values, params));
    };

    render() {
      const props = {
        ...this.props,
        ...this.state.urlDependingState,
        [reducerName]: this.reducer,
        [reduceAndGetAsUrlName]: this.getModifiedUrl
      };
      return <BaseComponent {...props} />;
    }
  };
};

function defaultingReducer(prevState, change) {
  return defaults({}, change, prevState);
}
