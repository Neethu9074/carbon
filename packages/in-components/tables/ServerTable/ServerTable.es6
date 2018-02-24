// @flow

import { pendingResult } from 'in-services/fixedObjects';
import { timeout } from 'reactive-observables';
import { compose } from 'recompose';
import { defaults } from 'lodash';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import connect from 'in-hoc/connectTo';

export default compose(
  withPropDependingState({
    resettingProps: [
      'columnDefinitions',
      'defaultOrderBy',
      'defaultOrderDirection',
      'defaultPageSize',
      'defaultQuery',
      'get',
      'paginationResettingProps'
    ],
    onReset: ({ columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery }) => ({
      orderBy: defaultOrderBy || columnDefinitions[0].id,
      orderDirection: defaultOrderDirection || 'ASC',
      page: 1,
      pageSize: defaultPageSize || 10,
      query: defaultQuery || ''
    }),
    reducerName: 'onChange',
    reducer: (prevState, change) => defaults({}, change, prevState)
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
