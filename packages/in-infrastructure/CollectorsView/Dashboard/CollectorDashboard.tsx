/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Snapshot as BaseSnapshotItem } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Column, Row } from '@instana/carbon';
import { Spacer } from '@instana/components';

import {
  withSiMultiplyPrefixThreeDecimalPlaces,
  bytes,
  timeBySecondsTwoDecimalPlaces,
  seconds
} from 'in-services/formatters/number';
//@ts-expect-error TS migration
import { getSnapshotVersionsByTime } from 'in-infrastructure/Dashboard/components/DashboardContent';
//@ts-expect-error TS migration
import NotFoundDialog from 'in-infrastructure/Dashboard/components/NotFoundDialog';
import CollectorDashboardHeader from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboardHeader';
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

function getMetricByRegex(regexp: RegExp, metrics: string[] | undefined) {
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
          <Row>
            <Column>
              <KpiCard title={t('in-infrastructure:collectorView.cpuTime')}>
                <MetricValue
                  snapshotId={snapshotId}
                  metric={getMetricByRegex(new RegExp(/.*otelcol_process_cpu_seconds{.*}/), metricsResult)[0]}
                  formatter={seconds.fixedCompact}
                  timeWindowAggregation="mean"
                />
              </KpiCard>
            </Column>
            <Column>
              <KpiCard title={t('in-infrastructure:collectorView.collectorUptime')}>
                <MetricValue
                  snapshotId={snapshotId}
                  metric={getMetricByRegex(new RegExp(/.*otelcol_process_uptime{.*}/), metricsResult)[0]}
                  formatter={timeBySecondsTwoDecimalPlaces}
                  timeWindowAggregation="mean"
                />
              </KpiCard>
            </Column>
          </Row>
          <Spacer vertical="normal" />
          <Row>
            <Column span="100%">
              <DashboardSection title={t('in-infrastructure:collectorView.memoryUsage')}>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  minRollup={10000}
                  y1={{
                    formatter: bytes.detailed,
                    metrics: [getMetricByRegex(new RegExp(/.*otelcol_process_memory_rss{.*}/), metricsResult)[0]],
                    labels: ['Used'],
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Column>
          </Row>
          <Row>
            <Column>
              <DashboardSection title={t('in-infrastructure:collectorView.receiverMetrics')}>
                <Row>
                  <Column>
                    <KpiCard title={t('in-infrastructure:collectorView.metricPointsAccepted')}>
                      <MetricValue
                        snapshotId={snapshotId}
                        metric={
                          getMetricByRegex(
                            new RegExp(/.*otelcol_receiver_accepted_metric_points{.*}/),
                            metricsResult
                          )[0]
                        }
                        formatter={withSiMultiplyPrefixThreeDecimalPlaces}
                        timeWindowAggregation="mean"
                      />
                    </KpiCard>
                  </Column>
                  <Spacer vertical="xsmall" />
                  <Column>
                    <KpiCard title={t('in-infrastructure:collectorView.logRecordsAccepted')}>
                      <MetricValue
                        snapshotId={snapshotId}
                        metric={
                          getMetricByRegex(new RegExp(/.*otelcol_receiver_accepted_log_records{.*}/), metricsResult)[0]
                        }
                        formatter={withSiMultiplyPrefixThreeDecimalPlaces}
                        timeWindowAggregation="mean"
                      />
                    </KpiCard>
                  </Column>
                </Row>
              </DashboardSection>
            </Column>
            <Column>
              <DashboardSection title={t('in-infrastructure:collectorView.exporterMetrics')}>
                <Row>
                  <Column>
                    <KpiCard title={t('in-infrastructure:collectorView.metricPointsExported')}>
                      <MetricValue
                        snapshotId={snapshotId}
                        metric={
                          getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_metric_points{.*}/), metricsResult)[0]
                        }
                        formatter={withSiMultiplyPrefixThreeDecimalPlaces}
                        timeWindowAggregation="mean"
                      />
                    </KpiCard>
                  </Column>
                  <Spacer vertical="xsmall" />
                  <Column>
                    <KpiCard title={t('in-infrastructure:collectorView.logRecordsExported')}>
                      <MetricValue
                        snapshotId={snapshotId}
                        metric={
                          getMetricByRegex(new RegExp(/.*otelcol_exporter_sent_log_records{.*}/), metricsResult)[0]
                        }
                        formatter={withSiMultiplyPrefixThreeDecimalPlaces}
                        timeWindowAggregation="mean"
                      />
                    </KpiCard>
                  </Column>
                </Row>
              </DashboardSection>
            </Column>
          </Row>
        </div>
      </div>
    </div>
  );
}
