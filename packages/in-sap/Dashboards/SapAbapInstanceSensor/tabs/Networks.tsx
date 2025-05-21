/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import ICMThreadConnQueue from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ICMThreadConnQueue';
import ICMServicesList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ICMServicesList';
import ICMServiceList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ICMServiceList';
import ICMThreadList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ICMThreadList';
import LanInterface from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/LanInterface';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pageNames } from 'in-services/tracking/pageNames';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function Networks({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_networks
        }}
      />
      <LanInterface snapshotId={snapshotId} timeConfig={timeConfig} />
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.icmInfo')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['icminfodatastats.status', 'icminfodatastats.traceLvl'],
              labels: [t('in-sap:dashboards.status'), t('in-sap:dashboards.traceLvl')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <ICMThreadConnQueue snapshotId={snapshotId} timeConfig={timeConfig} />
      </Columize>
      <ICMThreadList snapshotId={snapshotId} timeConfig={timeConfig} />
      <ICMServiceList snapshotId={snapshotId} timeConfig={timeConfig} />
      <ICMServicesList snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
