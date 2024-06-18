/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card, Spacer, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import getEtcdHosts from 'in-kubernetes/subscriptions/getEtcdHosts';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard';
import { EtcdProps } from './types';

export default function Etcd({ clusterId, timeConfig }: EtcdProps) {
  const etcdHostInfo: any =
    useObservable(getEtcdHosts({ filter: { clusterId, timeConfig } }), Object.values({ clusterId, timeConfig })) ??
    pendingResult;

  const etcdHostData = etcdHostInfo?.data;
  const clusterVersion = etcdHostData && etcdHostData?.clusterVersion;
  const snapshotId = etcdHostData && etcdHostData?.etcdSnapshotIds[0];
  if (clusterVersion) {
    const { controlPlaneHostCount, controlPlaneHostWithEtcdCount } = etcdHostData;
    const availability = `${controlPlaneHostWithEtcdCount} of ${controlPlaneHostCount}`;

    return (
      <>
        <Typography variant="heading-400">{t('in-kubernetes:dashboards.etcd')}</Typography>
        <KpiGridRow sizes={[true, true]}>
          <KpiCard title={t('in-kubernetes:dashboards.cluster')} value={clusterVersion} />
          <KpiCard title={t('in-kubernetes:dashboards.availability')} value={availability} />
        </KpiGridRow>
        <Spacer vertical="large" />

        <Row verticallyStretchColumns>
          <Col lg>
            <Card title={t('in-kubernetes:dashboards.traffic')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: ['health.grpc_received_bytes_total', 'health.grpc_sent_bytes_total'],
                  labels: [t('in-forge:plugins.etcd.dashboard.received'), t('in-forge:plugins.etcd.dashboard.sent')],
                  formatter: bytesZeroDecimalPlaces,
                  type: 'line',
                  aggregation: 'sum'
                }}
                renderPostChartContent={K8DashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg>
            <Card title={t('in-kubernetes:dashboards.operations')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'health.create_v3',
                    'health.delete_v3',
                    'health.compare_and_swap_v3',
                    'health.compare_and_delete_v3'
                  ],
                  labels: [
                    t('in-kubernetes:dashboards.create'),
                    t('in-kubernetes:dashboards.delete'),
                    t('in-kubernetes:dashboards.cas'),
                    t('in-kubernetes:dashboards.cad')
                  ],
                  formatter: zeroDecimalPlaces,
                  type: 'line',
                  aggregation: 'sum'
                }}
                renderPostChartContent={K8DashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
      </>
    );
  }

  return <></>;
}
