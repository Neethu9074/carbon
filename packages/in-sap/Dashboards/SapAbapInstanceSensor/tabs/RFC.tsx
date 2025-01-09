/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import OutboundTransactionalRfcInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/OutboundTransactionalRfcInfo';
import OutboundQueueRfcInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/OutboundQueueRfcInfo';
import InboundQueueRfcInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/InboundQueueRfcInfo';
import RfcErrorLogs from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RfcErrorLogs';
import RFCCallsMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFCCalls';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function RFC({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.rfcStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.totalRFCCalls'],
              labels: [t('in-sap:dashboards.totalRFCCalls')],
              type: 'bar',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.rfcLogins')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['versionstats.totalInternalRfc', 'versionstats.totalExternalRfc'],
              labels: [t('in-sap:dashboards.internal'), t('in-sap:dashboards.external')],
              type: 'stackedBar',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <RFCCallsMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <RfcErrorLogs snapshotId={snapshotId} timeConfig={timeConfig} />
      <OutboundTransactionalRfcInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <InboundQueueRfcInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <OutboundQueueRfcInfo snapshotId={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
