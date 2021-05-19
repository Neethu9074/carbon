/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { formatDateTime } from 'in-services/formatters/date';
import { percentage } from 'in-services/formatters/number';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getMetric } from 'in-stores/metric';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const healthColumn = {
  width: '2rem',
  getContent({ item }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={item.snapshot.get('id')}
        render={healthInfo => <HealthDot severity={healthInfo && healthInfo.maxSeverity} iconSize={10} />}
      />
    );
  }
};

const iconColumn = {
  width: '3rem',
  getContent({ item }) {
    return <PluginIcon snapshot={item.snapshot} />;
  }
};

export default {
  host: [
    healthColumn,
    iconColumn,
    {
      ellipsis: true,
      getContent({ item }) {
        return (
          <TwoSnapshotLabels
            primarySnapshot={item.snapshot}
            getSecondarySnapshotId={() => getZone(item.snapshot.get('id'))}
          />
        );
      }
    },
    {
      width: '20rem',
      getContent({ item }) {
        const data = item.snapshot.get('data');
        return (
          <KeyValue
            label={t('in-cockpit:widgets.columnDefinitions.os')}
            value={`${data.get('os.name', '')} ${data.get('os.version', '')}`}
            accentuated
          />
        );
      }
    },
    {
      width: '5rem',
      getContent({ item }) {
        return (
          <KeyValue
            label={t('in-cockpit:widgets.columnDefinitions.numCpU')}
            value={item.snapshot.getIn(['data', 'cpu.count'], '')}
            accentuated
          />
        );
      }
    },
    {
      width: '12rem',
      getContent({ item }) {
        return (
          <SparkChartWithMetricValue
            snapshotId={item.snapshot.get('id')}
            formatter={percentage}
            metric="cpu.used"
            label={t('in-cockpit:widgets.columnDefinitions.cpuUsage')}
            aggregation={t('in-cockpit:widgets.columnDefinitions.mean')}
          />
        );
      }
    }
  ],
  docker: [
    healthColumn,
    iconColumn,
    {
      ellipsis: true,
      getContent({ item }) {
        return (
          <TwoSnapshotLabels
            primarySnapshot={item.snapshot}
            getSecondarySnapshotId={() => getHostSnapshotId(item.snapshot)}
          />
        );
      }
    },
    {
      width: '10rem',
      getContent({ item }) {
        return (
          <KeyValue
            label={t('in-cockpit:widgets.columnDefinitions.created')}
            value={formatDateTime(item.snapshot.getIn(['data', 'Created'], ''))}
            accentuated
          />
        );
      }
    },
    {
      width: '10rem',
      getContent({ item }) {
        return (
          <KeyValue
            label={t('in-cockpit:widgets.columnDefinitions.started')}
            value={formatDateTime(item.snapshot.getIn(['data', 'Started'], ''))}
            accentuated
          />
        );
      }
    },
    {
      width: '12rem',
      getContent({ item }) {
        return (
          <SparkChartWithMetricValue
            snapshotId={item.snapshot.get('id')}
            formatter={percentage}
            metric="cpu.total_usage"
            label={t('in-cockpit:widgets.columnDefinitions.cpuUsage')}
            aggregation={t('in-cockpit:widgets.columnDefinitions.mean')}
          />
        );
      }
    }
  ],
  process: [
    healthColumn,
    iconColumn,
    {
      ellipsis: true,
      getContent({ item }) {
        return (
          <TwoSnapshotLabels
            primarySnapshot={item.snapshot}
            getSecondarySnapshotId={() => getHostSnapshotId(item.snapshot)}
          />
        );
      }
    },
    {
      width: '12rem',
      getContent({ item }) {
        return (
          <SparkChartWithMetricValue
            snapshotId={item.snapshot.get('id')}
            formatter={percentage}
            metric="cpu.user"
            label={t('in-cockpit:widgets.columnDefinitions.cpuUsage')}
            aggregation={t('in-cockpit:widgets.columnDefinitions.mean')}
          />
        );
      }
    }
  ]
};

const TwoSnapshotLabels = connectTo(
  ({ getSecondarySnapshotId }) => ({
    secondarySnapshot: getSecondarySnapshotId().flatMap(getSnapshot)
  }),

  function TwoSnapshotLabels({ primarySnapshot, secondarySnapshot }) {
    return (
      <KeyValue
        label={secondarySnapshot ? getLabel(secondarySnapshot) : ''}
        value={getLabel(primarySnapshot)}
        inverted
        accentuated
      />
    );
  }
);

const SparkChartWithMetricValue = connectTo(
  ({ snapshotId, metric, aggregation }) => ({
    horizontalMetricValue: getMetric({
      snapshotId,
      metric,
      timeWindowAggregation: aggregation,
      forceTimeWindowAggregation: true
    })
  }),
  function SparkChartWithMetricValue(props) {
    return <HistoricMetricSparkChart {...props} width={72} />;
  }
);
