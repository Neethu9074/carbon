/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import HttpMetricsStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/HttpMetricsStats';
import RFCCallsMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFCCalls';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInfo';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function SecurityEssentials({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <UserInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <DashboardSection title={t('in-sap:dashboards.versionInfo')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'versionstats.version750',
              'versionstats.version760',
              'versionstats.version780',
              'versionstats.versionOthers'
            ],
            labels: [
              t('in-sap:dashboards.noOfVersion750'),
              t('in-sap:dashboards.noOfVersion760'),
              t('in-sap:dashboards.noOfVersion780'),
              t('in-sap:dashboards.noOfVersionOthers')
            ],
            type: 'line',
            formatter: number
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <RFCCallsMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <HttpMetricsStats snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
