/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import RawTracesNavigator from 'in-analyze/components/RawTraces/RawTracesNavigator';
import RawTracesPresenter from 'in-analyze/components/RawTraces/RawTracesPresenter';
import { analyze, traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import getTraces from 'in-subscription/application/getTraces';
import TraceDetail from 'in-analyze/TraceDetail';
import useUrlState from 'in-hooks/useUrlState';

const defaultOrder = 'timestamp';

const urlStateConfig = {
  bind: [
    {
      path: analyze,
      name: `rawItems.orderBy`,
      as: 'orderBy',
      initialState: defaultOrder
    },
    {
      path: analyze,
      name: `rawItems.orderDirection`,
      as: 'orderDirection',
      initialState: 'DESC'
    }
  ]
};

export default function RawTracesStateWrapper(props) {
  const { tagFiltersForSubscription, filterByGroup, filters, previewEnabled } = props;

  const [{ orderBy, orderDirection }, onChangeOrder] = useUrlState(urlStateConfig);

  const tableProps = useCursorPagination(
    ({ cursor }) =>
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
              {
                name: filterByGroup.name,
                operator: 'EQUALS',
                stringValue: filterByGroup.value,
                entity: filterByGroup.entity
              }
            ])
          : tagFiltersForSubscription,
        queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL'
      }),
    [orderBy, orderDirection, filters.timeConfig, filterByGroup, previewEnabled, tagFiltersForSubscription]
  );

  return <RawTraces {...props} {...tableProps} onChangeOrder={onChangeOrder} />;
}

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
