/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { millis, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import HttpAvailability from 'in-sap/Dashboards/tables/HttpAvailabilty';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import Columize from 'in-sdk/components/dashboard/Columize';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-sap:dashboards.overallRating')}
          value={getOverallStatus(sap.overallRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.overallRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.overallAvailability')}
          value={getOverallStatus(sap.availRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.availRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.overallPerformance')}
          value={getOverallStatus(sap.perfRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.perfRating)}
        />
      </KpiGridRow>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-sap:dashboards.overallException')}
          value={getOverallStatus(sap.excepRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.excepRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.overallConfiguration')}
          value={getOverallStatus(sap.configRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.configRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.selfMonitorRating')}
          value={getOverallStatus(sap.selfMonitorRating) || valueMissingPlaceholder}
          borderless
          color={colorFormatter(sap.selfMonitorRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.responseTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.DB_Average_Response_Time.J2EE_DB_RESPONSE_TIME_DB_Average_Response_Time.value',
                'metrics.Performance.Enqueue_Response_Time.J2EE_ENQUEUE_RESPONSE_TIME_Enqueue_Response_Time.value',
                'metrics.Performance.Web_Service_Response_Time.J2EE_WS_RESPONSE_TIME_Web_Service_Average_Response_Time.value'
              ],
              labels: [
                t('in-sap:dashboards.dbAvgResponseTime'),
                t('in-sap:dashboards.enqueueRespTime'),
                t('in-sap:dashboards.webRespTime')
              ],

              type: 'line',
              formatter: millis
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.garbageCollection')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'metrics.Performance.Garbage_Collection.J2EE_GC_OLD_SPACE_USAGE_Effective_Old_Space_Usage.value',
                'metrics.Performance.Garbage_Collection.J2EE_GC_PERM_SPACE_USAGE_Effective_Perm_Space_Usage.value'
              ],
              labels: [t('in-sap:dashboards.oldSpace'), t('in-sap:dashboards.permSpace')],
              type: 'line',
              formatter: percentagePlainZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </Fragment>
  );
}
