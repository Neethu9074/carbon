/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs//DBConnectionProvider';
import HttpMetricsStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/HttpMetricsStats';
import TransportRequest from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TransportRequest';
import DatabaseHitList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs//DatabaseHitList';
import SpoolMetricStat from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SpoolMetricStat';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { productAreas } from 'in-services/tracking/productAreas';
import { number, millis } from 'in-services/formatters/number';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-sdk/components/dashboard/DashboardSection/DashboardSection.mless';

export default function SecurityEssentials({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_transactional_statistics
        }}
      />
      <div className={locals.dashboardSection}>
        <Card title={t('in-sap:dashboards.spoolStats')}>
          <Columize>
            <DashboardSection>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['spoolStats.count', 'spoolStats.processed', 'spoolStats.pJPages'],
                  labels: [
                    t('in-sap:dashboards.spoolCount'),
                    t('in-sap:dashboards.processed'),
                    t('in-sap:dashboards.pJPages')
                  ],
                  type: 'line',
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>

            <DashboardSection>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['spoolStats.responseTime', 'spoolStats.processTime', 'spoolStats.cpuTime'],
                  labels: [
                    t('in-sap:dashboards.responseTime'),
                    t('in-sap:dashboards.processTime'),
                    t('in-sap:dashboards.cpuTime')
                  ],
                  type: 'line',
                  formatter: millis.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </Card>
      </div>
      <SpoolMetricStat snapshotId={snapshotId} timeConfig={timeConfig} />
      <DBConnectionProvider snapshotId={snapshotId} timeConfig={timeConfig} />
      <DatabaseHitList snapshotId={snapshotId} timeConfig={timeConfig} />
      <HttpMetricsStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <TransportRequest snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
