/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';

export default {
  name: 'Profile',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'acceptorAcceptedProfiles',
      title: 'Acceptor Accepted Profiles',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'acceptor.acceptedProfiles';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    }
  ],
  getRowDetails({ timeConfig, id }) {
    return (
      <Fragment>
        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`acceptor.acceptedProfiles`],
              labels: ['Acceptor Accepted Profiles'],
              type: 'stackedArea'
            }}
          />
        </Columize>
      </Fragment>
    );
  }
};
