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
import { getSAPUnitFormatter } from 'in-sap/Dashboards/tables/UnitFormatter.js';
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
  Red: theme.lib.colors.yellow800,
  Unknown: theme.lib.colors.N400
};

const cols = [
  {
    title: t('in-sap:dashboards.eventNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.availMainMetric.get('eventNames');
      }
    }
  },
  {
    title: t('in-sap:dashboards.rating'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.availMainMetric.get('rating');
      },
      getContent(args) {
        return (
          <div className={locals.center}>
            <HealthDot
              type={'availability'}
              yellowToGreen={'-'}
              greenToYellow={'-'}
              redToYellow={'-'}
              yellowToRed={'-'}
              explanation={theme.lib.colors.success}
              color={statusToColour[args || statusToColour.Unknown]}
              iconSize={SvgIconSizes.xxs}
            />
          </div>
        );
      }
    }
  },
  {
    title: t('in-sap:dashboards.value'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.availMainMetric.get('value');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'metrics.Availability.' + configurationName)
    };
  },
  function Availability({ data, configurationName }) {
    const { snapshotId, timeConfig } = snapshotMap;
    if (snapshotMap.techEventName === 'MISSING_METRICS') {
      return <DashboardNotification type="info">{snapshotMap.eventNames}</DashboardNotification>;
    }
    if (!data) {
      return <DashboardNotification type="info">No data found: {configurationName}</DashboardNotification>;
    }
    const availMainMetrics = data.get('raw_payload', []);
    const rows = availMainMetrics
      .keySeq()
      .toArray()
      .filter(k1 => !(availMainMetrics.get(k1).get('isEvent') === 'true'))
      .map(key => {
        const availMainMetric = availMainMetrics.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          availMainMetric
        };
      });

    if (rows.length === 0) {
      return <DashboardNotification type="info">No data found: {configurationName}</DashboardNotification>;
    }

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }

      return (
        <Card title={t('in-sap:dashboards.metrics')} useMaxAvailableHeight>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Availability.' + configurationName + '.' + row.key + '.greenvalue',
                'metrics.Availability.' + configurationName + '.' + row.key + '.yellowvalue',
                'metrics.Availability.' + configurationName + '.' + row.key + '.redvalue'
              ],

              labels: [
                t('in-sap:dashboards.greenvalue'),
                t('in-sap:dashboards.yellowvalue'),
                t('in-sap:dashboards.redvalue')
              ],
              colors: [theme.lib.colors.success, theme.lib.colors.yellow800, theme.lib.colors.failure],
              type: 'stackedBar',
              formatter: getSAPUnitFormatter(row.availMainMetric.get('unit'))
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
