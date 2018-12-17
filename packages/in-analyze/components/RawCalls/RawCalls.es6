import { compose, withPropsOnChange } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import React from 'react';

import RawCallsNavigator from 'in-analyze/components/RawCalls/RawCallsNavigator';
import RawCallsPresenter from 'in-analyze/components/RawCalls/RawCallsPresenter';
import { analyze, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import getCalls from 'in-subscription/application/getCalls';
import cursorPaginated from 'in-hoc/cursorPaginated';
import TraceDetail from 'in-analyze/TraceDetail';

const defaultOrder = 'timestamp';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'rawItems.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: defaultOrder,
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  withPropsOnChange(['filters'], ({ filters }) => ({
    // filters is an immutable object which is always recreated. Turn it into JavaScript
    // so that the deep equal comparison of cursorPaginated works.
    filtersForCursorReset: filters.toJS()
  })),
  cursorPaginated({
    getResettingProps: () => ['filtersForCursorReset', 'orderBy', 'orderDirection'],
    get: ({ tagFiltersForSubscription, filterByGroup, cursor, filters, orderBy, orderDirection }) =>
      getCalls({
        pagination: {
          cursor,
          retrievalSize: 50
        },
        order: {
          by: orderBy || defaultOrder,
          direction: orderDirection
        },
        filter: {
          timeConfig: filters.get('timeConfig')
        },
        tagFilters: filterByGroup
          ? tagFiltersForSubscription.concat([
              { name: filterByGroup.name, operator: 'EQUALS', stringValue: filterByGroup.value }
            ])
          : tagFiltersForSubscription
      })
  })
)(RawCalls);

function RawCalls(props) {
  return (
    <Switch>
      <Route
        path={traceDetailFullyQualified}
        render={() => <TraceDetail {...props} navigator={<RawCallsNavigator {...props} />} />}
      />
      <Route path="*" render={() => <RawCallsPresenter {...props} />} />
    </Switch>
  );
}
