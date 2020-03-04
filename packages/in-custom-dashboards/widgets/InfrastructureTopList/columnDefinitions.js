import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import KeyValue, { themes } from 'in-new-components/lists/KeyValue';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { formatDateTime } from 'in-services/formatters/date';
import { percentage } from 'in-services/formatters/number';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getMetric } from 'in-stores/metric';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';

const healthColumn = {
  column: 1,
  getContent({ snapshot }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={snapshot.get('id')}
        render={healthInfo => <HealthDot severity={healthInfo && healthInfo.maxSeverity} iconSize={10} />}
      />
    );
  }
};

const iconColumn = {
  column: 2,
  getContent({ snapshot }) {
    return <PluginIcon snapshot={snapshot} size="s" />;
  }
};

export default {
  host: [
    healthColumn,
    iconColumn,
    {
      column: '3 / span 3',
      getContent({ snapshot }) {
        return (
          <TwoSnapshotLabels primarySnapshot={snapshot} getSecondarySnapshotId={() => getZone(snapshot.get('id'))} />
        );
      }
    },
    {
      column: 6,
      getContent({ snapshot }) {
        const data = snapshot.get('data');
        return (
          <KeyValue
            label="OS"
            value={`${data.get('os.name', '')} ${data.get('os.version', '')} (${data.get('os.arch', '')})`}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      column: 7,
      getContent({ snapshot }) {
        return (
          <KeyValue
            label="# of CPUs"
            value={snapshot.getIn(['data', 'cpu.count'], '')}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      column: 8,
      getContent({ snapshot }) {
        return (
          <SparkChartWithMetricValue
            snapshotId={snapshot.get('id')}
            formatter={percentage}
            metric="cpu.used"
            label="CPU Usage"
            aggregation="mean"
          />
        );
      }
    }
  ],
  docker: [
    healthColumn,
    iconColumn,
    {
      column: '3 / span 3',
      getContent({ snapshot }) {
        return (
          <TwoSnapshotLabels primarySnapshot={snapshot} getSecondarySnapshotId={() => getHostSnapshotId(snapshot)} />
        );
      }
    },
    {
      column: 6,
      getContent({ snapshot }) {
        return (
          <KeyValue
            label="Created"
            value={formatDateTime(snapshot.getIn(['data', 'Created'], ''))}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      column: 7,
      getContent({ snapshot }) {
        return (
          <KeyValue
            label="Started"
            value={formatDateTime(snapshot.getIn(['data', 'Started'], ''))}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      column: 8,
      getContent({ snapshot }) {
        return (
          <SparkChartWithMetricValue
            snapshotId={snapshot.get('id')}
            formatter={percentage}
            metric="cpu.total_usage"
            label="CPU Usage"
            aggregation="mean"
          />
        );
      }
    }
  ],
  process: [
    healthColumn,
    iconColumn,
    {
      column: '3 / span 4',
      getContent({ snapshot }) {
        return (
          <TwoSnapshotLabels primarySnapshot={snapshot} getSecondarySnapshotId={() => getHostSnapshotId(snapshot)} />
        );
      }
    },
    {
      column: 8,
      getContent({ snapshot }) {
        return (
          <SparkChartWithMetricValue
            snapshotId={snapshot.get('id')}
            formatter={percentage}
            metric="cpu.user"
            label="CPU Usage"
            aggregation="mean"
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
