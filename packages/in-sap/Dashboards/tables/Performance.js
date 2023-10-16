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
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/CronJob/CronJob.mless';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.eventNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.perfMainMetric.get('eventNames');
      }
    }
  },
  {
    title: t('in-sap:dashboards.rating'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.perfMainMetric.get('rating');
      },
      getContent: function Content(args, row) {
        const theme = useTheme();
        const statusToColour = {
          Yellow: theme.ids.color.option.yellow['500'],
          Grey: theme.ids.color.option.green['500'],
          Green: theme.ids.color.option.green['500'],
          Red: theme.ids.color.option.red['500'],
          Unknown: theme.ids.color.option.neutral['400']
        };
        return (
          <div className={locals.center}>
            <HealthDot
              type={'performance'}
              yellowToGreen={row.perfMainMetric.get('yellowToGreen')}
              greenToYellow={row.perfMainMetric.get('greenToYellow')}
              redToYellow={row.perfMainMetric.get('redToYellow')}
              yellowToRed={row.perfMainMetric.get('yellowToRed')}
              unit={row.perfMainMetric.get('unit')}
              explanation={theme.ids.color.option.green['500']}
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
        return row.perfMainMetric.get('value');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.unit'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (typeof row.perfMainMetric.get('unit') === 'undefined') {
          return 'Count';
        }
        return row.perfMainMetric.get('unit');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    const configurationName = props.configurationName;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'metrics.Performance.' + configurationName)
    };
  },
  function Performance({ data, configurationName }) {
    const theme = useTheme();
    const { snapshotId, timeConfig } = snapshotMap;
    if (snapshotMap.techEventName === 'MISSING_METRICS') {
      return <DashboardNotification type="info">{snapshotMap.eventNames}</DashboardNotification>;
    }
    if (!data) {
      return <DashboardNotification type="info">No data found: {configurationName}</DashboardNotification>;
    }
    const perfMainMetrics = data.get('raw_payload', []);
    const rows = perfMainMetrics
      .keySeq()
      .toArray()
      .filter(k1 => !(perfMainMetrics.get(k1).get('isEvent') === 'true'))
      .map(key => {
        const perfMainMetric = perfMainMetrics.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          perfMainMetric
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
                'metrics.Performance.' + configurationName + '.' + row.key + '.greenvalue',
                'metrics.Performance.' + configurationName + '.' + row.key + '.yellowvalue',
                'metrics.Performance.' + configurationName + '.' + row.key + '.redvalue'
              ],

              labels: [
                t('in-sap:dashboards.greenvalue'),
                t('in-sap:dashboards.yellowvalue'),
                t('in-sap:dashboards.redvalue')
              ],
              colors: [
                theme.ids.color.option.green['500'],
                theme.ids.color.option.yellow['500'],
                theme.ids.color.option.red['500']
              ],
              type: 'line',
              formatter: getSAPUnitFormatter(row.perfMainMetric.get('unit'))
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
        initialSortColumn={1}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
