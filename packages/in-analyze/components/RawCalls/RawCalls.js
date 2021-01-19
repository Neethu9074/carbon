/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
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
    getParsedUrlValues: urlValues => ({
      orderBy: urlValues.orderBy,
      orderDirection: urlValues.orderDirection
    }),
    getSerializedUrlValues: props => ({
      orderBy: props.orderBy,
      orderDirection: props.orderDirection
    }),
    reducerName: 'onChangeOrder'
  }),
  cursorPaginated({
    getResettingProps: () => ['filters', 'orderBy', 'orderDirection', 'showGraph', 'metrics', 'previewEnabled'],
    get: ({ tagFiltersForSubscription, filterByGroup, cursor, filters, orderBy, orderDirection, previewEnabled }) =>
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
          timeConfig: filters.timeConfig
        },
        tagFilters: filterByGroup
          ? tagFiltersForSubscription.concat([
              {
                name: filterByGroup.name,
                operator: 'EQUALS',
                stringValue: filterByGroup.value,
                entity: filterByGroup.entity
              }
            ])
          : tagFiltersForSubscription,
        queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL'
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
