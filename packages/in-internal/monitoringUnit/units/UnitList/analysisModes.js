import React, { Fragment } from 'react';

import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { percentage, number } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const unitColumn = {
  id: 'unit',
  title: 'Unit',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return `${row.tenant}-${row.unit}`;
    },
    getContent(val, row) {
      return (
        <Link
          href$={getModifiedUrlStream(params => {
            params.pathname = '/internal/monitoringUnit/unit';
            setOrDeleteMatrixKey(params, '/unit', 'tenant', row.tenant);
            setOrDeleteMatrixKey(params, '/unit', 'unit', row.unit);
          })}
        >
          {val}
        </Link>
      );
    }
  }
};

export const analysisTypes = {
  '': {
    name: 'Nothing',
    cols: [unitColumn]
  },

  applicationData: {
    name: 'Application Data',
    initialSortColumn: 1,
    initialSortDirection: 'desc',
    cols: [
      unitColumn,
      getDropwizardMetricColumn({
        title: 'Backend Dropped Spans',
        component: 'appdata-processor',
        metric: 'metrics.gauges.KPI.incoming.span_messages.error_rate',
        formatter: percentage.detailed,
        forceTimeWindowAggregation: true
      }),
      getDropwizardMetricColumn({
        title: 'Processed Spans',
        component: 'appdata-processor',
        metric: 'metrics.meters.KPI.processing.spans.calls',
        formatter: number.compact,
        forceTimeWindowAggregation: true
      }),
      getDropwizardMetricColumn({
        title: 'Dropped Spans Due To Configuration',
        component: 'appdata-processor',
        metric:
          'metrics.meters.com.instana.spanprocessing.stream.source.RawSpansSource.dropped-due-to-span-rate-throttler',
        formatter: number.compact,
        forceTimeWindowAggregation: true
      })
    ],
    getRowDetails({ timeConfig, tenant, unit }) {
      return (
        <WithPhysicalStack tenant={tenant} unit={unit} component="appdata-processor" timeConfig={timeConfig}>
          {physicalStack => (
            <Fragment>
              <Chart
                snapshotId={physicalStack.dropwizardApplicationContainer.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: percentage.detailed,
                  metrics: [`metrics.gauges.KPI.incoming.span_messages.error_rate`],
                  labels: ['Backend Dropped Spans'],
                  type: 'stackedArea'
                }}
              />
              <Chart
                snapshotId={physicalStack.dropwizardApplicationContainer.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: [`metrics.meters.KPI.processing.spans.calls`],
                  labels: ['Processed Spans'],
                  type: 'stackedArea'
                }}
              />
              <Chart
                snapshotId={physicalStack.dropwizardApplicationContainer.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: [
                    `metrics.meters.com.instana.spanprocessing.stream.source.RawSpansSource.dropped-due-to-span-rate-throttler`
                  ],
                  labels: ['Dropped Spans due to Configuration'],
                  type: 'stackedArea'
                }}
              />
            </Fragment>
          )}
        </WithPhysicalStack>
      );
    }
  },

  infrastructureEntityProcessing: {
    name: 'Infrastructure Data',
    initialSortColumn: 1,
    initialSortDirection: 'desc',
    cols: [
      unitColumn,
      getDropwizardMetricColumn({
        title: 'Number of Entities',
        component: 'filler',
        metric: 'metrics.gauges.com.instana.filler.service.snapshot.OnlineSnapshotsLimit.online-snapshots-count',
        formatter: number.compact,
        forceTimeWindowAggregation: true
      }),
      getDropwizardMetricColumn({
        title: 'Processed Agent Messages',
        component: 'filler',
        metric: 'metrics.meters.com.instana.filler.raw-entity.processed',
        formatter: number.compact,
        forceTimeWindowAggregation: true
      }),
      getDropwizardMetricColumn({
        title: 'Dropped Agent Messages',
        component: 'filler',
        metric: 'metrics.meters.com.instana.filler.raw-entity.dropped',
        formatter: number.compact,
        forceTimeWindowAggregation: true
      })
    ],
    getRowDetails({ timeConfig, tenant, unit }) {
      return (
        <WithPhysicalStack tenant={tenant} unit={unit} component="filler" timeConfig={timeConfig}>
          {physicalStack => (
            <Fragment>
              <Chart
                snapshotId={physicalStack.dropwizardApplicationContainer.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: [
                    `metrics.gauges.com.instana.filler.service.snapshot.OnlineSnapshotsLimit.online-snapshots-count`
                  ],
                  labels: ['Number of Entities'],
                  type: 'stackedArea'
                }}
              />
              <Chart
                snapshotId={physicalStack.dropwizardApplicationContainer.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: [`metrics.meters.com.instana.filler.raw-entity.processed`],
                  labels: ['Processed Agent Messages'],
                  type: 'stackedArea'
                }}
              />
              <Chart
                snapshotId={physicalStack.dropwizardApplicationContainer.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: [`metrics.meters.com.instana.filler.raw-entity.dropped`],
                  labels: ['Dropped Agent Messages'],
                  type: 'stackedArea'
                }}
              />
            </Fragment>
          )}
        </WithPhysicalStack>
      );
    }
  }
};

function getDropwizardMetricColumn({ component, title, metric, formatter, forceTimeWindowAggregation }) {
  return {
    id: metric,
    title,
    type: 'metric',
    typeArgs: {
      getSnapshotId$(row) {
        return getPhysicalStack({
          searchQuery: `entity.selfType:docker AND entity.label:*-${component}`,
          timeConfig: row.timeConfig
        })
          .throttle(1000)
          .map(hierarchies => hierarchies.filter(h => h.docker.get('label').startsWith(`${row.tenant}-${row.unit}`)))
          .filter(hierarchies => hierarchies.length > 0)
          .map(hierarchies => hierarchies[0].dropwizardApplicationContainer.get('id'))
          .distinct();
      },
      getMetricName() {
        return metric;
      },
      getContent: formatter,
      getTimeWindowAggregation(row) {
        return row.metricAggregation;
      },
      forceTimeWindowAggregation
    }
  };
}

const WithPhysicalStack = connectTo(({ component, tenant, unit, timeConfig }) => ({
  physicalStack: getPhysicalStack({
    searchQuery: `entity.selfType:docker AND entity.label:*-${component}`,
    timeConfig
  })
    .throttle(1000)
    .map(hierarchies => hierarchies.filter(h => h.docker.get('label').startsWith(`${tenant}-${unit}`)))
    .filter(hierarchies => hierarchies.length > 0)
    .map(hierarchies => hierarchies[0])
}))(function WithResolvedComponent({ physicalStack, children }) {
  return children(physicalStack);
});
