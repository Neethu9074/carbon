import React, { Fragment } from 'react';

import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { percentage, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { getModifiedUrlStream } from 'in-stores/navigation';
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
      {
        id: 'spanDropping',
        title: 'Backend Dropped Spans',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'appdata-processor.spanDropping';
          },
          getContent: percentage.detailed,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      },
      {
        id: 'spanDropping',
        title: 'Backend Dropped Spans',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'appdata-processor.spanDropping';
          },
          getContent: percentage.detailed,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      },
      {
        id: 'Processed Spans',
        title: 'Processed Spans',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'appdata-processor.processedSpans';
          },
          getContent: number.compact,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      },
      {
        id: 'Dropped Spans Due To Configuration',
        title: 'Dropped Spans Due To Configuration',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'appdata-processor.droppedSpansDueToConfiguration';
          },
          getContent: number.compact,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      }
    ],
    getRowDetails({ timeConfig, id }) {
      return (
        <Fragment>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [`appdata-processor.spanDropping`],
              labels: ['Backend Dropped Spans'],
              type: 'stackedArea'
            }}
          />
          <Columize>
            <Chart
              snapshotId={id}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: [`appdata-processor.processedSpans`],
                labels: ['Processed Spans'],
                type: 'stackedArea'
              }}
            />
            <Chart
              snapshotId={id}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: [`appdata-processor.droppedSpansDueToConfiguration`],
                labels: ['Dropped Spans due to Configuration'],
                type: 'stackedArea'
              }}
            />
          </Columize>
        </Fragment>
      );
    }
  },

  infrastructureEntityProcessing: {
    name: 'Infrastructure Data',
    initialSortColumn: 1,
    initialSortDirection: 'desc',
    cols: [
      unitColumn,
      {
        id: 'Number of Entities',
        title: 'Number of Entities',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'filler.numberOfEntities';
          },
          getContent: number.compact,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      },
      {
        id: 'Entity Usage',
        title: 'Entity Usage',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'filler.entityUsage';
          },
          getContent: percentage.detailed,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      },
      {
        id: 'Entity Message Drop Rate',
        title: 'Entity Message Drop Rate',
        type: 'metric',
        typeArgs: {
          getSnapshotId(row) {
            return row.id;
          },
          getMetricName() {
            return 'filler.rawEntityDropRate';
          },
          getContent: percentage.detailed,
          getTimeWindowAggregation(row) {
            return row.metricAggregation;
          },
          forceTimeWindowAggregation: true
        }
      }
    ],
    getRowDetails({ timeConfig, id }) {
      return (
        <Fragment>
          <Columize>
            <Chart
              snapshotId={id}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: [`filler.numberOfEntities`],
                labels: ['Number of Entities'],
                type: 'stackedArea'
              }}
            />
            <Chart
              snapshotId={id}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: 1,
                formatter: percentage.detailed,
                metrics: [`filler.entityUsage`],
                labels: ['Entity Usage'],
                type: 'stackedArea'
              }}
            />
          </Columize>

          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.compact,
              metrics: [`filler.rawEntityDropRate`],
              labels: ['Entity Message Drop Rate'],
              type: 'stackedArea'
            }}
          />
        </Fragment>
      );
    }
  }
};
