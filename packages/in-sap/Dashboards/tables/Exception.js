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
  Red: theme.lib.colors.failure,
  Unknown: theme.lib.colors.N400
};

const cols = [
  {
    title: t('in-sap:dashboards.eventNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.excepMainMetric.get('eventNames');
      }
    }
  },
  {
    title: t('in-sap:dashboards.rating'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.excepMainMetric.get('rating');
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
    title: t('in-sap:dashboards.value'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.excepMainMetric.get('value');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.unit'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (typeof row.excepMainMetric.get('unit') === 'undefined') {
          return 'Count';
        }
        return row.excepMainMetric.get('unit');
      }
    }
  },
  {
    title: t('in-sap:dashboards.greenToYellow'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (isNaN(row.excepMainMetric.get('greenToYellow'))) {
          return '-';
        }
        return row.excepMainMetric.get('greenToYellow').toString();
      }
    }
  },
  {
    title: t('in-sap:dashboards.yellowToGreen'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (isNaN(row.excepMainMetric.get('yellowToGreen'))) {
          return '-';
        }
        return row.excepMainMetric.get('yellowToGreen').toString();
      }
    }
  },
  {
    title: t('in-sap:dashboards.yellowToRed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (isNaN(row.excepMainMetric.get('yellowToRed'))) {
          return '-';
        }
        return row.excepMainMetric.get('yellowToRed').toString();
      }
    }
  },
  {
    title: t('in-sap:dashboards.redToYellow'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (isNaN(row.excepMainMetric.get('redToYellow'))) {
          return '-';
        }
        return row.excepMainMetric.get('redToYellow').toString();
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    const configurationName = props.configurationName;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'metrics.Exceptions.' + configurationName)
    };
  },
  function Exception({ data, configurationName }) {
    const { snapshotId, timeConfig } = snapshotMap;
    if (snapshotMap.techEventName === 'MISSING_METRICS') {
      return <DashboardNotification type="info">{snapshotMap.eventNames}</DashboardNotification>;
    }
    if (!data) {
      return <DashboardNotification type="info">No data found for {configurationName}</DashboardNotification>;
    }
    const excepMainMetrics = data.get('raw_payload', []);
    const rows = excepMainMetrics
      .keySeq()
      .toArray()
      .map(key => {
        const excepMainMetric = excepMainMetrics.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          excepMainMetric
        };
      });

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
                'metrics.Exceptions.' + configurationName + '.' + row.key + '.greenvalue',
                'metrics.Exceptions.' + configurationName + '.' + row.key + '.yellowvalue',
                'metrics.Exceptions.' + configurationName + '.' + row.key + '.redvalue'
              ],
              labels: [
                t('in-sap:dashboards.greenvalue'),
                t('in-sap:dashboards.yellowvalue'),
                t('in-sap:dashboards.redvalue')
              ],
              colors: [theme.lib.colors.success, theme.lib.colors.yellow800, theme.lib.colors.failure],
              type: 'stackedBar',
              formatter: getSAPUnitFormatter(row.excepMainMetric.get('unit'))
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
