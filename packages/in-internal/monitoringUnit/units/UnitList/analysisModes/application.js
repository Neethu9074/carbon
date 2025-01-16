/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { percentage, number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default {
  name: 'Application',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'Appdata-processor Instances',
      title: t('in-internal:monitoringUnit.units.application.appdataProcessorInstance'),
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
      title: t('in-internal:monitoringUnit.units.application.backendDropSpans'),
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
      id: 'spanDroppingTotal',
      title: t('in-internal:monitoringUnit.units.application.backendTotalDropSpans'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'appdata-processor.spanDroppingTotal';
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
      title: t('in-internal:monitoringUnit.units.application.processSpan'),
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
      title: t('in-internal:monitoringUnit.units.application.dropSpansConfig'),
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
      title: t('in-internal:monitoringUnit.units.application.dropSpansBackpressure'),
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
      title: t('in-internal:monitoringUnit.units.application.dropSpansBackpressureLagHardDrop'),
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
      title: t('in-internal:monitoringUnit.units.application.dropSpansDConsistentDrop'),
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
      title: t('in-internal:monitoringUnit.units.application.spanLatencyMean'),
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
      title: t('in-internal:monitoringUnit.units.application.spanLatency99'),
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
      title: t('in-internal:monitoringUnit.units.application.acceptorDropSpanMsgRateLimit'),
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
      title: t('in-internal:monitoringUnit.units.application.srvlessAcceptorDropSpanMsgRateLimit'),
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
    },
    {
      id: 'otlpAcceptorDroppedSpanMessagesRateLimited',
      title: t('in-internal:monitoringUnit.units.application.otlpAcceptorDropSpanMsgRateLimit'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'otlp-acceptor.droppedSpanMessagesRateLimited';
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
              metrics: [`appdata-processor.spanDropping`, `appdata-processor.spanDroppingTotal`],
              labels: [
                t('in-internal:monitoringUnit.units.application.dropRate'),
                t('in-internal:monitoringUnit.units.application.totalDropRate')
              ],
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
                t('in-internal:monitoringUnit.units.application.processed'),
                t('in-internal:monitoringUnit.units.application.dropGlobalThrottler'),
                t('in-internal:monitoringUnit.units.application.dropConsistentDrop'),
                t('in-internal:monitoringUnit.units.application.dropBackpressure'),
                t('in-internal:monitoringUnit.units.application.droppedHardBackpressureRandomDrop'),
                t('in-internal:monitoringUnit.units.application.dropTraceThrottler')
              ],
              colors: [
                themes.default.ids.color.option.green['500'],
                themes.default.ids.color.option.red['500'],
                themes.default.ids.color.option.orange['500'],
                themes.default.ids.color.option.yellow['500'],
                themes.default.ids.color.option.pink['500'],
                themes.default.ids.color.option.purple['500']
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
              labels: [
                t('in-internal:monitoringUnit.units.application.spanLatencyMean'),
                t('in-internal:monitoringUnit.units.application.spanLatency50t'),
                t('in-internal:monitoringUnit.units.application.spanLatency99')
              ],
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
                `serverless-acceptor.droppedSpanMessagesRateLimited`,
                `otlp-acceptor.droppedSpanMessagesRateLimited`
              ],
              labels: [
                t('in-internal:monitoringUnit.units.application.acceptorDropSpanMsgsRateLimit'),
                t('in-internal:monitoringUnit.units.application.serverlessAcceptorDropSpanMsgRateLimit'),
                t('in-internal:monitoringUnit.units.application.otlpAcceptorDropSpanMsgRateLimit')
              ],
              colors: [themes.default.ids.color.option.red['500'], themes.default.ids.color.option.orange['500']],
              type: 'stackedArea'
            }}
          />
        </Columize>
      </Fragment>
    );
  }
};
