// @flow

import { pendingResult } from 'in-services/fixedObjects';
import { timeout } from 'reactive-observables';
import { compose } from 'recompose';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { emptyArray } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default compose(
  withUrlDependingState({
    // the path segment under which the matrix parameters are registered
    getPathSegment: ({ pathSegment }) => pathSegment,

    // an optional prefix for the matrix parameter keys
    getMatrixPrefix: ({ matrixPrefix }) => matrixPrefix || '',

    // only these keys will be mapped / read from the URL
    boundKeys: ['orderBy', 'orderDirection', 'page', 'pageSize', 'query'],

    // given the props, define the initial state
    getInitialState,

    // define cases which should reset / change the URL state
    resets: [
      // reset the page to 1 when one of the properties changes which are used in get
      {
        getResettingProps: ({ paginationResettingProps }) => paginationResettingProps || emptyArray,
        onReset: () => ({ page: 1 })
      },

      // reset everything once one of the basic properties changes
      {
        getResettingProps: () => [
          'columnDefinitions',
          'defaultOrderBy',
          'defaultOrderDirection',
          'defaultPageSize',
          'defaultQuery',
          'get'
        ],
        onReset: getInitialState
      }
    ],

    // page and pageSize are just strings in the URL. Parse these values, because the downstream
    // code is expecting numbers.
    getParsedUrlValues: urlValues => ({
      page: urlValues.page != null ? parseInt(urlValues.page, 10) : null,
      pageSize: urlValues.pageSize != null ? parseInt(urlValues.pageSize, 10) : null
    }),

    // function to set the new page/order/query
    reducerName: 'onChange'
  }),
  connect((props, prevProps) => {
    if (props.query !== prevProps.query && props.query !== '') {
      // Query changes are frequent and we need to debounce these changes.
      // Also, while debouncing, we immediately want to turn the table state
      // into a loading state. This is better than having the state of an input
      // field and the state of the table differ (happens when debouncing within an input
      // field and the table is still showing data for a previous query).
      //
      // The combination of a connectTo() and a timeout().flatMap is effectively
      // a debounce implementation!
      //
      // Because we are debouncing only on query changes and because we are turning
      // the table immediately into a loading state, we can use larger waiting times
      // before retrieving data and thereby reduce backend pressure!
      return {
        result: timeout(800)
          .flatMap(() => props.get(props))
          .startWith(pendingResult)
      };
    }
    return {
      result: props.get(props)
    };
  })
)(ServerTablePresenter);

function getInitialState({ columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery }) {
  return {
    orderBy: defaultOrderBy || columnDefinitions[0].id,
    orderDirection: defaultOrderDirection || 'ASC',
    page: 1,
    pageSize: defaultPageSize || 20,
    query: defaultQuery || ''
  };
}
