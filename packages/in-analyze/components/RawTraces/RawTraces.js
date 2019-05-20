import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import React from 'react';

import RawTracesNavigator from 'in-analyze/components/RawTraces/RawTracesNavigator';
import RawTracesPresenter from 'in-analyze/components/RawTraces/RawTracesPresenter';
import { analyze, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import getTraces from 'in-subscription/application/getTraces';
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
  cursorPaginated({
    getResettingProps: () => ['filters', 'orderBy', 'orderDirection'],
    get: ({ tagFiltersForSubscription, filterByGroup, cursor, filters, orderBy, orderDirection }) =>
      getTraces({
        pagination: {
          cursor,
          retrievalSize: 50
        },
        order: {
          by: orderBy || defaultOrder,
          direction: orderDirection
        },
        filter: {
          timeConfig: filters.timeConfig
        },
        tagFilters: filterByGroup
          ? tagFiltersForSubscription.concat([
              { name: filterByGroup.name, operator: 'EQUALS', stringValue: filterByGroup.value }
            ])
          : tagFiltersForSubscription
      })
  })
)(RawTraces);

function RawTraces(props) {
  return (
    <Switch>
      <Route
        path={traceDetailFullyQualified}
        render={() => <TraceDetail {...props} navigator={<RawTracesNavigator {...props} />} />}
      />
      <Route path="*" render={() => <RawTracesPresenter {...props} />} />
    </Switch>
  );
}
