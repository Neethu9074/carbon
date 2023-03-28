/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import HttpAvailability from 'in-sap/Dashboards/tables/HttpAvailabilty';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: vm }) {
  const snapshotId = vm.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[6, 6]}>
        <InfraMetricKpiCard
          title={t('in-sap:dashboards.DB2_Database_Status')}
          snapshotId={snapshotId}
          metric="metrics.Availability.DB2_Database_Status.DB6_DATABASE_STATUS.value"
          formatter={number.compact}
        />
        <InfraMetricKpiCard
          title={t('in-sap:dashboards.DB2_Instance_Status')}
          snapshotId={snapshotId}
          metric="metrics.Availability.DB2_Instance_Status.DB6_INSTANCE_STATUS.value"
          formatter={number.compact}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.dbAvailability')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Availability.DB2_Database_Status.DB6_DATABASE_STATUS.value',
                  'metrics.Availability.DB2_Instance_Status.DB6_INSTANCE_STATUS.value'
                ],
                labels: [t('in-sap:dashboards.DB2_Database_Status'), t('in-sap:dashboards.DB2_Instance_Status')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.dbExceptions')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Exceptions.Corrupt_page.DIA8400C.value',
                  'metrics.Exceptions.Disk_Error.SQL0980C.value'
                ],
                labels: [t('in-sap:dashboards.Corrupt_page'), t('in-sap:dashboards.Disk_Error')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
