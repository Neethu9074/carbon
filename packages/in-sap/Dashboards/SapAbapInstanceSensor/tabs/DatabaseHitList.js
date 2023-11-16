/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.account'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dataStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dataStats.get('client');
      }
    }
  },
  {
    title: t('in-sap:dashboards.report'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dataStats.get('report');
      }
    }
  },
  {
    title: t('in-sap:dashboards.endDate'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dataStats.get('endDate');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'databaseStats')
    };
  },
  function DatabaseHitList({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const dataStat = data.get('raw_payload', []);
    const rows = dataStat
      .keySeq()
      .toArray()
      .map(key => {
        const dataStats = dataStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          dataStats
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Columize>
            <DashboardSection title={t('in-sap:dashboards.databaseStats')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: [
                    'databaseStats.' + row.key + '.dbRequestTime',
                    'databaseStats.' + row.key + '.totalDbRequests',
                    'databaseStats.' + row.key + '.totalDbCalls'
                  ],
                  labels: [
                    t('in-sap:dashboards.dbRequestTime'),
                    t('in-sap:dashboards.totalDbRequests'),
                    t('in-sap:dashboards.totalDbCalls')
                  ],
                  type: 'line',
                  formatter: number
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </div>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.databaseHitList')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
