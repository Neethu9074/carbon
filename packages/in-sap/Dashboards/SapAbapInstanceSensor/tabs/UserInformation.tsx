/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CombinedMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/CombinedMetrics';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInfo';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function UserInformation({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.loginTypes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['versionstats.totalRfc', 'versionstats.totalGui', 'versionstats.totalDemon'],
              labels: [t('in-sap:dashboards.rfc'), t('in-sap:dashboards.gui'), t('in-sap:dashboards.daemon')],
              type: 'stackedBar',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.versionInfo')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'versionstats.version750',
                'versionstats.version760',
                'versionstats.version770',
                'versionstats.version780',
                'versionstats.version800',
                'versionstats.versionOthers'
              ],
              labels: [
                t('in-sap:dashboards.noOfVersion750'),
                t('in-sap:dashboards.noOfVersion760'),
                t('in-sap:dashboards.noOfVersion770'),
                t('in-sap:dashboards.noOfVersion780'),
                t('in-sap:dashboards.noOfVersion800'),
                t('in-sap:dashboards.noOfVersionOthers')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <UserInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <CombinedMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
