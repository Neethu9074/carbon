/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AggregationType, KubernetesPersistentVolumeClaim, MetricSource, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import getKubernetesPersistentVolumeByPersistentVolumeClaim from 'in-kubernetes/subscriptions/getKubernetesPersistentVolumeByPersistentVolumeClaim';
// @ts-expect-error TS migration
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import KubernetesTimeShiftChartPresenter from 'in-kubernetes/Dashboards/commonComponents/KubernetesTimeShiftChartPresenter';
import { andQuery, tagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { percentageTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { resourceQuotaBytes, resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { usePersistentVolumeDashboard } from 'in-kubernetes/navigation/paths';
import PodsTable from 'in-kubernetes/Dashboards/commonComponents/PodsTable';
import { k8sChartColors } from 'in-kubernetes/components/K8sChartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { summaryTab } from 'in-kubernetes/navigation/paths';
import { capitalizeValue } from 'in-components/Capitalize';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

interface SummaryProps {
  timeConfig: TimeConfig;
  data: KubernetesPersistentVolumeClaim;
}

export default function Summary(props: SummaryProps) {
  const { timeConfig, data: persistentVolumeClaim } = props;

  const timeShift = useTimeShiftConfig();
  const snapshotId = persistentVolumeClaim.id;

  const { total, used } = k8sChartColors;

  const persistentVolumeClaimTagId = tagEquals('id.kubernetesPersistentVolumeClaim', snapshotId);
  const persistentVolumeClaimQuery = andQuery(persistentVolumeClaimTagId);
  const tagFilterExpression = toBackendQueryModel(persistentVolumeClaimQuery);

  const type = plugins.kubernetesPersistentVolumeClaim;

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
      <MissingK8sPermissions resourceSnapshotId={persistentVolumeClaim.id} timeConfig={timeConfig} />
      <Row>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageClassName')}
            value={persistentVolumeClaim.storageClassName || valueMissingPlaceholder}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageUsedCapacity')}
            value={persistentVolumeClaim.id}
            renderValue={persistentVolumeClaimId => (
              <MetricValue
                snapshotId={persistentVolumeClaimId}
                metric="currentMetrics.capacity.used"
                formatter={bytesTwoDecimalPlaces}
              />
            )}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageTotalCapacity')}
            value={persistentVolumeClaim.id}
            renderValue={persistentVolumeClaimId => (
              <MetricValue
                snapshotId={persistentVolumeClaimId}
                metric="status.capacity"
                formatter={bytesTwoDecimalPlaces}
              />
            )}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageUtilization')}
            value={persistentVolumeClaim.id}
            renderValue={persistentVolumeClaimId => (
              <MetricValue
                snapshotId={persistentVolumeClaimId}
                metric="currentMetrics.capacity.usedPercent"
                formatter={percentageTwoDecimalPlaces}
              />
            )}
            borderless
            raw
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.phase')}
            value={persistentVolumeClaim.phase}
            renderValue={capitalizeValue}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.persistentVolume')}
            value={persistentVolumeClaim.id}
            renderValue={persistentVolumeClaimId => (
              <PersistentVolumeLink id={persistentVolumeClaimId} timeConfig={timeConfig} />
            )}
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.storageLimits')}
            value={persistentVolumeClaim.id}
            renderValue={persistentVolumeId => (
              <MetricValue
                snapshotId={persistentVolumeId}
                metric="requests.storage"
                formatter={(d: number) =>
                  t('in-kubernetes:dashboards.storageLimitsRequested', { requested: bytesTwoDecimalPlaces(d) })
                }
              />
            )}
            companionValue={
              <MetricValue
                snapshotId={snapshotId}
                metric="limits.storage"
                formatter={(d: number) =>
                  t('in-kubernetes:dashboards.storageLimitsLimit', { limit: bytesTwoDecimalPlaces(d) })
                }
              />
            }
            borderless
            raw
          />
        </Col>
        <Col lg={3}>
          <KpiCard
            title={t('in-kubernetes:dashboards.volumeMode')}
            value={persistentVolumeClaim.volumeMode}
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
                metric: 'status.capacity',
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
      <Row>
        <Col lg={12}>
          <Card title={t('in-kubernetes:dashboards.associatedPods')}>
            <PodsTable optionalColumns={false} pathSegment="/summary" persistentVolumeClaimId={snapshotId} {...props} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

function PersistentVolumeLink({ id: persistentVolumeClaimId, timeConfig }: { id: string; timeConfig: TimeConfig }) {
  const persistentVolume = useObservable(
    getKubernetesPersistentVolumeByPersistentVolumeClaim({
      filter: {
        persistentVolumeClaimId,
        timeConfig
      }
    }),
    [persistentVolumeClaimId, timeConfig]
  );

  const href = usePersistentVolumeDashboard(persistentVolume?.data?.id);
  const name = persistentVolume?.data?.name;

  if (name) {
    return <EntityLink label={name} href={href} icon="lib_infra_kubernetesPersistentVolume" />;
  } else {
    return <>{valueMissingPlaceholder}</>;
  }
}
