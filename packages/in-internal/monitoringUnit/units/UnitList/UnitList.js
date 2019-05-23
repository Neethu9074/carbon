import { compose } from 'recompose';
import React, { Fragment } from 'react';

import { analysisTypes } from 'in-internal/monitoringUnit/units/UnitList/analysisModes';
import UnitsBreadcrumb from 'in-internal/monitoringUnit/units/UnitsBreadcrumb';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import Select from 'in-components/form/Select';
import withUrlState from 'in-hoc/withUrlState';
import search from 'in-subscription/search';
import connect from 'in-hoc/connectTo';

import locals from './UnitList.mless';

export default compose(
  connect(() => ({
    timeConfig: timeConfig$,
    units: timeConfig$.flatMap(timeConfig =>
      search({
        query: 'entity.selfType:entityStatistics',
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'entityStatistics'
      })
        .flatMap(getSnapshots)
        .map(snapshots =>
          snapshots.map(snapshot => ({
            tenant: snapshot.getIn(['data', 'tenant']),
            unit: snapshot.getIn(['data', 'unit'])
          }))
        )
    )
  })),
  withUrlState({
    bind: [
      {
        path: '/units',
        name: 'analysisType',
        initialState: ''
      },
      {
        path: '/units',
        name: 'metricAggregation',
        initialState: 'mean'
      }
    ],
    reducerName: 'setState',
    reducer: (prev, next) => ({ ...prev, ...next }),
    replaceHistory: true
  })
)(function UnitList({ units, analysisType, setState, timeConfig, metricAggregation }) {
  const { cols, initialSortColumn, initialSortDirection, getRowDetails } =
    analysisTypes[analysisType] || analysisTypes[''];

  return (
    <InternalViewWrapper>
      <Breadcrumbs items={[<UnitsBreadcrumb />]} />

      {!units && <LoadingIndicator type="dark" />}

      {units && (
        <Table
          key={`${analysisType}-${metricAggregation}`}
          cardTitle="Units"
          withoutPadding
          cols={cols}
          rows={units.map(({ tenant, unit }) => ({
            key: `${tenant}-${unit}`,
            tenant,
            unit,
            timeConfig,
            metricAggregation
          }))}
          maxItemsPerPage={50}
          initialSortColumn={initialSortColumn}
          initialSortDirection={initialSortDirection}
          getRowDetails={getRowDetails}
          rightHeader={
            <Fragment>
              Analyze
              <Select
                value={analysisType}
                onChange={e => setState({ analysisType: e.target.value })}
                className={locals.modeSwitch}
              >
                {Object.keys(analysisTypes)
                  .sort()
                  .map(key => (
                    <option key={key} value={key}>
                      {analysisTypes[key].name}
                    </option>
                  ))}
              </Select>
              Metric aggregation
              <Select
                value={metricAggregation}
                onChange={e => setState({ metricAggregation: e.target.value })}
                className={locals.aggregationSwitch}
              >
                <option value="mean">mean</option>
                <option value="max">max</option>
              </Select>
            </Fragment>
          }
        />
      )}
    </InternalViewWrapper>
  );
});
