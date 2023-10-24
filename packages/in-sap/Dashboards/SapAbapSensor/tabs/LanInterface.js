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
    title: t('in-sap:dashboards.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.lanStats.get('type');
      }
    }
  },
  {
    title: t('in-sap:dashboards.subType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.lanStats.get('subType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.serialNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.lanStats.get('serialNumber');
      }
    }
  },
  {
    title: t('in-sap:dashboards.lanName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.lanStats.get('lanName');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'lanMetricStats')
    };
  },
  function LanInterface({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const lanStat = data.get('raw_payload', []);
    const rows = lanStat
      .keySeq()
      .toArray()
      .map(key => {
        const lanStats = lanStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          lanStats
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Columize>
            <DashboardSection title={t('in-sap:dashboards.lanMetricStats')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: [
                    'lanMetricStats.' + row.key + '.inPackets',
                    'lanMetricStats.' + row.key + '.outPackets',
                    'lanMetricStats.' + row.key + '.inErrors',
                    'lanMetricStats.' + row.key + '.outErrors',
                    'lanMetricStats.' + row.key + '.collisions'
                  ],
                  labels: [
                    t('in-sap:dashboards.inPackets'),
                    t('in-sap:dashboards.outPackets'),
                    t('in-sap:dashboards.inErrors'),
                    t('in-sap:dashboards.outErrors'),
                    t('in-sap:dashboards.collisions')
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
        cardTitle={t('in-sap:dashboards.lanInterface')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
