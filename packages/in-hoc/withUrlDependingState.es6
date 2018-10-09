import { pick, curryRight, defaults, isEqual } from 'lodash';
import { createFactory, Component } from 'react';

import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { identity } from 'in-services/util/function';

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
//     // reset the page to 1 when one of the properties changes which are used in get
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
  reducer = defaultingReducer,
  getParsedUrlValues = identity,
  getSerializedUrlValues = identity,
  replaceHistory = true
}) => BaseComponent => {
  const pickBoundKeys = boundKeys.length > 0 ? curryRight(pick, 2)(boundKeys) : identity;

  const factory = createFactory(BaseComponent);
  return class WithUrlDependingState extends Component {
    static displayName = getDisplayName(BaseComponent, 'withUrlDependingState');

    constructor(props) {
      super(props);
      this.state = {
        urlDependingState: getInitialState(props)
      };
    }

    componentWillMount() {
      this.locationSubscription = navigationParameters$.subscribe(this.onLocationChange);
    }

    componentWillUnmount() {
      if (this.locationSubscription) {
        this.locationSubscription.dispose();
      }
    }

    onLocationChange = params => {
      this.params = params;
      this.calculateUrlDependingState(this.props);
    };

    calculateUrlDependingState(props) {
      let urlValues = emptyObject;
      const forPathSegment = getPathSegment(props);
      const matrixPrefix = getMatrixPrefix(props);
      if (this.params.matrix[forPathSegment] != null) {
        urlValues = boundKeys.reduce((agg, k) => {
          agg[k] = this.params.matrix[forPathSegment][`${matrixPrefix}${k}`];
          return agg;
        }, {});

        let parsedUrlValues = getParsedUrlValues(urlValues);
        // filter null/undefined values which are considered to be existing properties by defaults
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
      if (!isEqual(newState, this.state.urlDependingState)) {
        this.setState({
          urlDependingState: newState
        });
      }
    }

    componentWillReceiveProps(nextProps) {
      let resetExecuted = false;
      const resultingState = resets.reduce((newState, { getResettingProps, onReset }) => {
        const pickResettingProps = curryRight(pick, 2)(getResettingProps(nextProps));
        if (isEqual(pickResettingProps(this.props), pickResettingProps(nextProps))) {
          return newState;
        }

        resetExecuted = true;
        return defaults({}, onReset(nextProps), newState);
      }, defaults({}, this.state.urlDependingState));

      if (resetExecuted && !isEqual(pickBoundKeys(resultingState), this.state.urlDependingState)) {
        this.setValuesInMatrixParameters(pickBoundKeys(resultingState), true);
      }
    }

    setValuesInMatrixParameters(values, forceHistoryReplacement = false) {
      const serializedValues = defaults({}, getSerializedUrlValues(values), values);
      const forPathSegment = getPathSegment(this.props);
      const matrixPrefix = getMatrixPrefix(this.props);
      mutateUrl(params => {
        const matrixValues = (params.matrix[forPathSegment] = params.matrix[forPathSegment] || {});
        Object.keys(serializedValues).forEach(k => (matrixValues[`${matrixPrefix}${k}`] = serializedValues[k]));
      }, Boolean(replaceHistory) || forceHistoryReplacement);
    }

    reducer = change => {
      this.setValuesInMatrixParameters(pickBoundKeys(reducer(this.state.urlDependingState, change, this.props)));
    };

    render() {
      return factory({
        ...this.props,
        ...this.state.urlDependingState,
        [reducerName]: this.reducer
      });
    }
  };
};

function defaultingReducer(prevState, change) {
  return defaults({}, change, prevState);
}
