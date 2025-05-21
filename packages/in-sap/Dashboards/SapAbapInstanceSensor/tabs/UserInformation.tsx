/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CombinedMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/CombinedMetrics';
import VersionUse from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/VersionInformation';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInfo';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function UserInformation({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <>
      <DashboardSection>
        <Row>
          <Col lg>
            <Card title={t('in-sap:dashboards.loginTypes')}>
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
            </Card>
          </Col>

          <Col lg>
            <VersionUse snapshotId={snapshotId} timeConfig={timeConfig} />
          </Col>
        </Row>
      </DashboardSection>
      <UserInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <CombinedMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
