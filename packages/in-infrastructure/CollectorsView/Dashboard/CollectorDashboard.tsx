/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Snapshot as BaseSnapshotItem } from '@instana/types';
import { Spacer, Collapsible } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Column, Row } from '@instana/carbon';

import {
  bytes,
  timeBySecondsTwoDecimalPlaces,
  number,
  withSiMultiplyPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';
//@ts-expect-error TS migration
import { getSnapshotVersionsByTime } from 'in-infrastructure/Dashboard/components/DashboardContent';
//@ts-expect-error TS migration
import NotFoundDialog from 'in-infrastructure/Dashboard/components/NotFoundDialog';
import CollectorDashboardHeader from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboardHeader';
import PipelineThroughputGraph from 'in-infrastructure/CollectorsView/Dashboard/PipelineThroughputGraph';
import ActionsButtonSection from 'in-infrastructure/CollectorsView/Dashboard/ActionsButtonSection';
//@ts-expect-error TS migration
import { selectedSnapshot$ } from 'in-stores/snapshot';
import CollectorInfoSidebar from 'in-infrastructure/CollectorsView/Dashboard/Sidebar';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import useMetricIds from 'in-infrastructure/hooks/useMetricIds';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky/Sticky';
import { t } from 'in-i18n';

import locals from './CollectorDashboard.mless';

export interface SnapshotItem extends Omit<BaseSnapshotItem, 'id'> {
  get: (id: string) => string;
  id: string;
}

export function getMetricByRegex(regexp: RegExp, metrics: string[] | undefined): string[] {
  const metricsArray = metrics || [];
  const foundmetric = metricsArray.filter(metric => metric.match(regexp));
  return foundmetric;
}

export default function CollectorDashboard() {
  const snapshot = useObservable(selectedSnapshot$, []) as SnapshotItem;
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot?.get('id');
  const metricsResult = useMetricIds({ snapshotId, timeConfig }).data;

  const versionsForLive = useObservable(() => getSnapshotVersionsByTime(timeConfig), [timeConfig]);
  const versionsForFocusedMoment = useObservable(() => getSnapshotVersionsByTime(), []);

  if (snapshot === undefined) {
    return (
      <div className={locals.loadingIndicatorWrapper}>
        <LoadingIndicator />
      </div>
    );
  }

  if (!snapshot) {
    return (
      <NotFoundDialog
        snapshotId={snapshotId}
        versionsForFocusedMoment={versionsForFocusedMoment}
        versionsForLive={versionsForLive}
      />
    );
  }

  return (
    <div className={locals.mainContent}>
      <Sticky header={<CollectorDashboardHeader snapshot={snapshot} />} />
      <div className={locals.wrapper}>
        <div className={locals.sidebar}>
          <CollectorInfoSidebar snapshot={snapshot} />
        </div>
        <div className={locals.content}>
          <div className={locals.right}>
            <ActionsButtonSection snapshot={snapshot} />
          </div>
          <Collapsible initiallyOpen>
            <Collapsible.Header>{t('in-infrastructure:collectorView.widgets.processUptimeHealth')}</Collapsible.Header>
            <Collapsible.Content>
              <Row>
                <Column>
                  <KpiCard title={t('in-infrastructure:collectorView.widgets.collectorUptime')}>
                    <MetricValue
                      snapshotId={snapshotId}
                      metric={getMetricByRegex(new RegExp(/.*otelcol_process_uptime.*/), metricsResult)[0]}
                      formatter={timeBySecondsTwoDecimalPlaces}
                      timeWindowAggregation="mean"
                    />
                  </KpiCard>
                </Column>
                <Column>
                  <KpiCard title={t('in-infrastructure:collectorView.widgets.cpuTime')}>
                    <MetricValue
                      snapshotId={snapshotId}
                      metric={getMetricByRegex(new RegExp(/.*otelcol_process_cpu_seconds.*/), metricsResult)[0]}
                      formatter={timeBySecondsTwoDecimalPlaces}
                      timeWindowAggregation="mean"
                    />
                  </KpiCard>
                </Column>
              </Row>
              <Spacer vertical="normal" />
              <Row>
                <Column span="100%">
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.memoryUsage')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      minRollup={10000}
                      y1={{
                        formatter: bytes.detailed,
                        metrics: [getMetricByRegex(new RegExp(/.*otelcol_process_memory_rss.*/), metricsResult)[0]],
                        labels: [t('in-infrastructure:collectorView.widgets.used')],
                        type: 'stackedArea'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
              <Row>
                <Column span="100%">
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.heapUsage')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      minRollup={10000}
                      y1={{
                        formatter: bytes.detailed,
                        metrics: [
                          getMetricByRegex(new RegExp(/.*otelcol_process_runtime_heap_alloc_bytes.*/), metricsResult)[0]
                        ],
                        labels: [t('in-infrastructure:collectorView.widgets.used')],
                        type: 'stackedArea'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
            </Collapsible.Content>
          </Collapsible>
          <Collapsible initiallyOpen>
            <Collapsible.Header>
              {t('in-infrastructure:collectorView.widgets.pipelineThroughputReliability')}
            </Collapsible.Header>
            <Collapsible.Content>
              <Row>
                <Column span="100%">
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.logsOverTime')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: withSiMultiplyPrefixThreeDecimalPlaces,
                        metrics: [
                          getMetricByRegex(new RegExp(/.*otelcol_receiver_accepted_log_records.*/), metricsResult)[0],
                          getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_log_records.*/), metricsResult)[0]
                        ],
                        labels: [
                          t('in-infrastructure:collectorView.widgets.logsReceived'),
                          t('in-infrastructure:collectorView.widgets.logsExported')
                        ],
                        type: 'line'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
              <Spacer vertical="normal" />
              <Row>
                <Column span="100%">
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.metricsOverTime')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: withSiMultiplyPrefixThreeDecimalPlaces,
                        metrics: [
                          getMetricByRegex(new RegExp(/.*otelcol_receiver_accepted_metric_points.*/), metricsResult)[0],
                          getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_metric_points.*/), metricsResult)[0]
                        ],
                        labels: [
                          t('in-infrastructure:collectorView.widgets.metricsReceived'),
                          t('in-infrastructure:collectorView.widgets.metricsExported')
                        ],
                        type: 'line'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
              <Row className={locals.pipelineThroughputGraphContainer}>
                <div className={locals.pipelineThroughputGraphContainer}>
                  <Column>
                    <PipelineThroughputGraph
                      pipeline={t('in-infrastructure:collectorView.widgets.spans')}
                      snapshotId={snapshotId}
                      acceptedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_receiver_accepted_spans.*/), metricsResult)[0]
                      }
                      refusedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_receiver_refused_spans.*/), metricsResult)[0]
                      }
                      sentMetricName={getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_spans.*/), metricsResult)[0]}
                      failedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_exporter_send_failed_spans.*/), metricsResult)[0]
                      }
                    />
                  </Column>
                  <Spacer horizontal="small" />
                  <Column>
                    <PipelineThroughputGraph
                      pipeline={t('in-infrastructure:collectorView.widgets.metrics')}
                      snapshotId={snapshotId}
                      acceptedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_receiver_accepted_metric_points.*/), metricsResult)[0]
                      }
                      refusedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_receiver_refused_metric_points.*/), metricsResult)[0]
                      }
                      sentMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_metric_points.*/), metricsResult)[0]
                      }
                      failedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_exporter_send_failed_metric_points.*/), metricsResult)[0]
                      }
                    />
                  </Column>
                  <Column>
                    <PipelineThroughputGraph
                      pipeline={t('in-infrastructure:collectorView.widgets.logs')}
                      snapshotId={snapshotId}
                      acceptedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_receiver_accepted_log_records.*/), metricsResult)[0]
                      }
                      refusedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_receiver_refused_log_records.*/), metricsResult)[0]
                      }
                      sentMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_log_records.*/), metricsResult)[0]
                      }
                      failedMetricName={
                        getMetricByRegex(new RegExp(/.*otelcol_exporter_send_failed_log_records.*/), metricsResult)[0]
                      }
                    />
                  </Column>
                </div>
              </Row>
              <Spacer vertical="normal" />
              <Row>
                <Column>
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.receiverDropped')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: number.compact,
                        metrics: [
                          getMetricByRegex(new RegExp(/.*otelcol_receiver_refused_spans.*/), metricsResult)[0],
                          getMetricByRegex(new RegExp(/.*otelcol_receiver_refused_log_records.*/), metricsResult)[0],
                          getMetricByRegex(new RegExp(/.*otelcol_receiver_refused_metric_points.*/), metricsResult)[0]
                        ],
                        labels: [
                          t('in-infrastructure:collectorView.widgets.spansDropped'),
                          t('in-infrastructure:collectorView.widgets.logsDropped'),
                          t('in-infrastructure:collectorView.widgets.metricsDropped')
                        ],
                        type: 'line'
                      }}
                    />
                  </DashboardSection>
                </Column>
                <Spacer horizontal="small" />
                <Column>
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.exporterDropped')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: number.compact,
                        metrics: [
                          getMetricByRegex(new RegExp(/.*otelcol_exporter_send_failed_spans.*/), metricsResult)[0],
                          getMetricByRegex(
                            new RegExp(/.*otelcol_exporter_send_failed_log_records.*/),
                            metricsResult
                          )[0],
                          getMetricByRegex(
                            new RegExp(/.*otelcol_exporter_send_failed_metric_points.*/),
                            metricsResult
                          )[0]
                        ],
                        labels: [
                          t('in-infrastructure:collectorView.widgets.spansDropped'),
                          t('in-infrastructure:collectorView.widgets.logsDropped'),
                          t('in-infrastructure:collectorView.widgets.metricsDropped')
                        ],
                        type: 'line'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
            </Collapsible.Content>
          </Collapsible>
          <Collapsible initiallyOpen>
            <Collapsible.Header>
              {t('in-infrastructure:collectorView.widgets.pipelineComponentStats')}
            </Collapsible.Header>
            <Collapsible.Content>
              <Row>
                <Column>
                  <KpiCard title={t('in-infrastructure:collectorView.widgets.spansFailedToQueue')}>
                    <MetricValue
                      snapshotId={snapshotId}
                      metric={
                        getMetricByRegex(new RegExp(/.*otelcol_exporter_enqueue_failed_spans.*/), metricsResult)[0]
                      }
                      formatter={number.compact}
                      timeWindowAggregation="mean"
                    />
                  </KpiCard>
                </Column>
                <Column>
                  <KpiCard title={t('in-infrastructure:collectorView.widgets.metricsFailedToQueue')}>
                    <MetricValue
                      snapshotId={snapshotId}
                      metric={
                        getMetricByRegex(
                          new RegExp(/.*otelcol_exporter_enqueue_failed_metric_points.*/),
                          metricsResult
                        )[0]
                      }
                      formatter={number.compact}
                      timeWindowAggregation="mean"
                    />
                  </KpiCard>
                </Column>
                <Column>
                  <KpiCard title={t('in-infrastructure:collectorView.widgets.logsFailedToQueue')}>
                    <MetricValue
                      snapshotId={snapshotId}
                      metric={
                        getMetricByRegex(
                          new RegExp(/.*otelcol_exporter_enqueue_failed_log_records.*/),
                          metricsResult
                        )[0]
                      }
                      formatter={number.compact}
                      timeWindowAggregation="mean"
                    />
                  </KpiCard>
                </Column>
              </Row>
              <Spacer vertical="normal" />
              <Row>
                <Column span="100%">
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.exporterQueue')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: number.compact,
                        metrics: getMetricByRegex(new RegExp(/.*otelcol_exporter_queue_size.*/), metricsResult),
                        labels: [
                          t('in-infrastructure:collectorView.widgets.logsDataBatches'),
                          t('in-infrastructure:collectorView.widgets.tracesDataBatches'),
                          t('in-infrastructure:collectorView.widgets.metricsDataBatches')
                        ],
                        type: 'stackedBar'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
              <Spacer vertical="normal" />
              <Row>
                <Column span="100%">
                  <DashboardSection title={t('in-infrastructure:collectorView.widgets.exporterQueueCapacity')}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: number.compact,
                        metrics: getMetricByRegex(new RegExp(/.*otelcol_exporter_queue_capacity.*/), metricsResult),
                        labels: [
                          t('in-infrastructure:collectorView.widgets.logsDataBatches'),
                          t('in-infrastructure:collectorView.widgets.tracesDataBatches'),
                          t('in-infrastructure:collectorView.widgets.metricsDataBatches')
                        ],
                        type: 'line'
                      }}
                    />
                  </DashboardSection>
                </Column>
              </Row>
            </Collapsible.Content>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
