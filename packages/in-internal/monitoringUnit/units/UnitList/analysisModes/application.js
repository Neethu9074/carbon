/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import theme from 'in-themes';

export default {
  name: 'Application',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'Appdata-processor Instances',
      title: 'Appdata-processor Instances',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.instances';
        },
        getContent: number.compact,
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
      id: 'processedSpans',
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
      id: 'droppedSpansDueToConfiguration',
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
    },
    {
      id: 'droppedSpansDueToBackpressure',
      title: 'Dropped Spans Due To Backpressure',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.droppedSpansDueToBackpressure';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'droppedSpansDueToHardBackpressure',
      title: 'Dropped Spans Due To Backpressure (lag hard drop)',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.droppedSpansDueToHardBackpressure';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'droppedSpansDueToConsistentDropping',
      title: 'Dropped Spans Due To Consistent Dropping',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.droppedSpansDueToConsistentDropping';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'spanLatencyMean',
      title: 'Span Latency (Mean)',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.spanLatency.mean';
        },
        getContent: millis.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'spanLatency99th',
      title: 'Span Latency (99th)',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.spanLatency.99th';
        },
        getContent: millis.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'acceptorDroppedSpanMessagesRateLimited',
      title: 'Acceptor Dropped Span Messages (Rate Limit)',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'acceptor.droppedSpanMessagesRateLimited';
        },
        getContent: number.compact,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    },
    {
      id: 'serverlessAcceptorDroppedSpanMessagesRateLimited',
      title: 'Serverless-Acceptor Dropped Span Messages (Rate Limit)',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'serverless-acceptor.droppedSpanMessagesRateLimited';
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
        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [`appdata-processor.spanDropping`],
              labels: ['Dropping rate'],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `appdata-processor.processedSpans`,
                `appdata-processor.droppedSpansDueToConfiguration`,
                `appdata-processor.droppedSpansDueToConsistentDropping`,
                `appdata-processor.droppedSpansDueToBackpressure`,
                `appdata-processor.droppedSpansDueToHardBackpressure`,
                `appdata-processor.droppedSpansDueToPerTraceConfiguration`
              ],
              labels: [
                'Processed',
                'Dropped due to global throttler',
                'Dropped due to consistent dropping',
                'Dropped due to backpressure',
                'Dropped hard due to backpressure (random dropping)',
                'Dropped due to trace throttler'
              ],
              colors: [
                theme.lib.colors.success,
                theme.lib.colors.red800,
                theme.lib.colors.orange800,
                theme.lib.colors.yellow800,
                theme.lib.colors.pink800,
                theme.lib.colors.purple800
              ],
              type: 'stackedArea'
            }}
          />
        </Columize>
        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: millis.compact,
              metrics: [
                `appdata-processor.spanLatency.mean`,
                `appdata-processor.spanLatency.50th`,
                `appdata-processor.spanLatency.99th`
              ],
              labels: ['Span Latency (mean)', 'Span Latency (50th)', 'Span Latency (99th)'],
              type: 'lines'
            }}
          />
        </Columize>
        <Columize>
          <Chart
            snapshotId={id}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `acceptor.droppedSpanMessagesRateLimited`,
                `serverless-acceptor.droppedSpanMessagesRateLimited`
              ],
              labels: [
                'Acceptor Dropped Span Messages (Rate Limit)',
                'Serverless-Acceptor Dropped Span Messages (Rate Limit)'
              ],
              colors: [theme.lib.colors.red800, theme.lib.colors.orange800],
              type: 'stackedArea'
            }}
          />
        </Columize>
      </Fragment>
    );
  }
};
