/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import MachinesTable from 'in-forge/plugins/tuxedoDomain/Dashboard/MachinesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TuxedoDomainDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoDomain.numOfSvrs')}>
          <MetricValue snapshotId={snapshotId} metric="numOfSvrs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoDomain.numOfSvcs')}>
          <MetricValue snapshotId={snapshotId} metric="numOfSvcs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoDomain.numOfReqQues')}>
          <MetricValue snapshotId={snapshotId} metric="numOfReqQues" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoDomain.numOfSrvGrps')}>
          <MetricValue snapshotId={snapshotId} metric="numOfSrvGrps" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoDomain.numOfIntfs')}>
          <MetricValue snapshotId={snapshotId} metric="numOfIntfs" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoDomain.totNumOfIPCMsgs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totalIPCQnum'],
            labels: [t('in-forge:plugins.tuxedoDomain.totNumOfIPCMsgs')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <MachinesTable snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.tuxedoDomain.numOfSvrs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numOfSvrs'],
            labels: [t('in-forge:plugins.tuxedoDomain.numOfSvrs')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoDomain.numOfSvcs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numOfSvcs'],
            labels: [t('in-forge:plugins.tuxedoDomain.numOfSvcs')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoDomain.numOfReqQues')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numOfReqQues'],
            labels: [t('in-forge:plugins.tuxedoDomain.numOfReqQues')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoDomain.numOfSrvGrps')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numOfSrvGrps'],
            labels: [t('in-forge:plugins.tuxedoDomain.numOfSrvGrps')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoDomain.numOfIntfs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numOfIntfs'],
            labels: [t('in-forge:plugins.tuxedoDomain.numOfIntfs')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
