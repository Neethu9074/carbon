/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AggregationType, KubernetesPersistentVolume, MetricSource, TimeConfig } from '@instana/types';

import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
// @ts-expect-error
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { andQuery, tagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { percentageTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { resourceQuotaBytes, resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { k8sChartColors } from 'in-kubernetes/components/K8sChartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { capitalizeValue } from 'in-components/Capitalize';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  timeConfig: TimeConfig;
  data: KubernetesPersistentVolume;
}

export default function Summary({ timeConfig, data: persistentVolume }: SummaryProps) {
  const timeShift = useTimeShiftConfig();
  const snapshotId = persistentVolume.id;

  const { total, used } = k8sChartColors;

  const persistentVolumeTagId = tagEquals('id.kubernetesPersistentVolume', snapshotId);
  const persistentVolumeQuery = andQuery(persistentVolumeTagId);
  const tagFilterExpression = toBackendQueryModel(persistentVolumeQuery);

  const type = plugins.kubernetesPersistentVolume;

  const defaultConfig = {
    source: 'INFRASTRUCTURE_METRICS' as MetricSource,
    type,
    aggregation: 'MEAN' as AggregationType,
    tagFilterExpression,
    timeConfig,
    timeShift
  };

  const defaultChartMetricConfig = {
    ...defaultConfig,
    granularity: getChartGranularity(timeConfig)
  };

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={persistentVolume.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageClassName')}
            value={persistentVolume.storageClassName || valueMissingPlaceholder}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageUsedCapacity')}
            value={persistentVolume.id}
            renderValue={persistentVolumeId => (
              <MetricValue
                snapshotId={persistentVolumeId}
                metric="currentMetrics.capacity.used"
                formatter={bytesTwoDecimalPlaces}
              />
            )}
            companionValue={
              <MetricValue
                snapshotId={snapshotId}
                metric="capacity.storage"
                formatter={(d: number) =>
                  t('in-kubernetes:dashboards.storageUsedTotalCapacity', { total: bytesTwoDecimalPlaces(d) })
                }
              />
            }
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageUtilization')}
            value={persistentVolume.id}
            renderValue={persistentVolumeId => (
              <MetricValue
                snapshotId={persistentVolumeId}
                metric="currentMetrics.capacity.usedPercent"
                formatter={percentageTwoDecimalPlaces}
              />
            )}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.phase')}
            value={persistentVolume.phase}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.reclaimPolicy')}
            value={persistentVolume.reclaimPolicy}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.accessMode')}
            value={persistentVolume.accessModes?.join(`, `)}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.volumeMode')}
            value={persistentVolume.volumeMode}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.creationTimestamp')}
            value={persistentVolume.creationTimestamp}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'capacity.storage',
                label: t('in-kubernetes:dashboards.total'),
                color: total,
                ...defaultChartMetricConfig
              },
              {
                metric: 'currentMetrics.capacity.used',
                label: t('in-kubernetes:dashboards.used'),
                color: used,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.capacityStorage')}
            colors={[total, used]}
            formatter="bytes.detailed"
            tooltipFormatter={resourceQuotaBytes}
            paramTab="capacityTab"
            paramMetric="capacityMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
        <Col lg={6}>
          <KubernetesTimeShiftChartPresenter
            metrics={[
              {
                metric: 'currentMetrics.capacity.usedPercent',
                label: t('in-kubernetes:dashboards.total'),
                color: total,
                ...defaultChartMetricConfig
              }
            ]}
            title={t('in-kubernetes:dashboards.storageUtilization')}
            colors={[total]}
            formatter="percentage.detailed"
            tooltipFormatter={resourceQuotaPercentage}
            paramTab="utilizationTab"
            paramMetric="utilizationMetric"
            path={summaryTab}
            hasActionlane
            snapshotId={snapshotId}
            hasButtonInActionslane={false}
          />
        </Col>
      </Row>
    </>
  );
}
