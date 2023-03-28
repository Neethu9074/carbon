/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';
import { Card } from '@instana/components';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { HealthDot } from 'in-sap/Dashboards/tables/HealthDot.js';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/CronJob/CronJob.mless';

let snapshotMap = {};

const statusToColour = {
  Yellow: theme.lib.colors.yellow800,
  Grey: theme.lib.colors.success,
  Green: theme.lib.colors.success,
  Red: theme.lib.colors.failure,
  Unknown: theme.lib.colors.N400
};

const cols = [
  {
    title: t('in-sap:eventNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.selfMonitoringMetric.get('eventNames');
      }
    }
  },
  {
    title: t('in-sap:rating'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.selfMonitoringMetric.get('rating');
      },
      getContent(args) {
        return (
          <div className={locals.center}>
            <HealthDot color={statusToColour[args || statusToColour.Unknown]} iconSize={SvgIconSizes.xxs} />
          </div>
        );
      }
    }
  },
  {
    title: t('in-sap:status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.selfMonitoringMetric.get('status');
      }
    }
  },
  {
    title: t('in-sap:value'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.selfMonitoringMetric.get('value');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    const configurationName = props.configurationName;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'metrics.Self-Monitoring.' + configurationName)
    };
  },
  function SelfMonitoringMetrics({ data, configurationName }) {
    const { snapshotId, timeConfig } = snapshotMap;
    if (snapshotMap.techEventName === 'MISSING_METRICS') {
      return <DashboardNotification type="info">{snapshotMap.eventNames}</DashboardNotification>;
    }
    if (!data) {
      return <DashboardNotification type="info">No data found for {configurationName}</DashboardNotification>;
    }
    const selfMonitoringMetrics = data.get('raw_payload', []);
    const rows = selfMonitoringMetrics
      .keySeq()
      .toArray()
      .map(key => {
        const selfMonitoringMetric = selfMonitoringMetrics.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          selfMonitoringMetric
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <Card title={t('in-sap:dashboards.performanceMetrics')} useMaxAvailableHeight>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: [
                'metrics.Self-Monitoring.' + configurationName + '.' + row.key + '.greenToYellow',
                'metrics.Self-Monitoring.' + configurationName + '.' + row.key + '.redToYellow',
                'metrics.Self-Monitoring.' + configurationName + '.' + row.key + '.yellowToGreen',
                'metrics.Self-Monitoring.' + configurationName + '.' + row.key + '.yellowToRed',
                'metrics.Self-Monitoring.' + configurationName + '.' + row.key + '.value'
              ],
              labels: [t('in-sap:maxValue'), t('in-sap:minValue'), t('in-sap:value')],
              type: 'stackedBar'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Card>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={configurationName.replaceAll('_', ' ')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
