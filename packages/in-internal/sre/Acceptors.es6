import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Chart from 'in-components/Chart';
import connectTo from 'in-hoc/connectTo';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { timeConfig$ } from 'in-stores/time/config';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import { percentage, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';

const cols = [
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: 'User',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.user`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'System',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.sys`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Wait',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.wait`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Nice',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.nice`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Steal',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.steal`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$,
    acceptors: getDropwizardWithContext('entity.label:"acceptor"')
  },
  function Overview({ acceptors, timeConfig }) {
    if (acceptors.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    acceptors = sort(acceptors);
    const acceptorLabels = getLabels(acceptors, /^(acceptor-\d+).*$/i);

    return (
      <div>
        <Columize>
          <DashboardSection title={`Messages`}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.acceptor.messages.http2`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Dropped/denied messages`}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.acceptor.messages.http2.dropped`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`IP filtered messages (should be 0)`}>
            <Chart
              snapshotIds={acceptors.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: acceptors.map(() => `metrics.meters.acceptor.messages.ipfilter.dropped`),
                labels: acceptorLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={acceptors.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: acceptors.map(() => 'load.1min'),
                labels: acceptors.map(r => r.host.get('label')),
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Hosts (${acceptors.length})`}>
            <Table cols={cols} rows={acceptors} getRowDetails={getRowDetails} />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getLabels(rows, regexp) {
  return rows.map(r => r.host.get('label').replace(regexp, '$1'));
}

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
