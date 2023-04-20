/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import HttpAvailability from 'in-sap/Dashboards/tables/HttpAvailabilty';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: vm }) {
  const snapshotId = vm.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[6, 6]}>
        <KpiCard
          title={t('in-sap:dashboards.hdbConnectionStatus')}
          value={vm.connectStatusRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.connectStatusRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.diskUsage')}
          value={vm.diskUsageRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.diskUsageRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-sap:dashboards.availability')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: ['metrics.Availability.Database_Availability.HDB_DBA_CONNECT_STATUS.value'],
                labels: [t('in-sap:dashboards.dBAConnectStatus')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-sap:dashboards.dbStatistics')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'metrics.Performance.Long-Running_Blocking_Situations.HDB_STATISTICS_ALERT_049_.value',
                  'metrics.Performance.Long_Running_Statement.HDB_STATISTICS_ALERT_039_.value'
                ],
                labels: [t('in-sap:dashboards.blockingSituations'), t('in-sap:dashboards.longRunningStatement')],
                type: 'line',
                formatter: number
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
