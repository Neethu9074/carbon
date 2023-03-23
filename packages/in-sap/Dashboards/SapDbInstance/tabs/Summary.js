/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
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
          title={t('in-sap:dashboards.availability')}
          snapshotId={snapshotId}
          metric="metrics.Availability.DATABASE_AVAILABILITY.value"
          formatter={number.compact}
        />
        <InfraMetricKpiCard
          title={t('in-sap:dashboards.performance')}
          snapshotId={snapshotId}
          metric="metrics.Performance.DATABASE_PERFORMANCE.value"
          formatter={number.compact}
        />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.dbAvailability')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Availability.DATABASE_AVAILABILITY.value',
                  'metrics.Availability.RECEIVING_STATUS_FROM_DBTENANT.value'
                ],
                labels: [t('in-sap:dashboards.availability'), t('in-sap:dashboards.receivingStatus')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.dbPerformance')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.DATABASE_PERFORMANCE.value',
                  'metrics.Performance.RECEIVING_STATUS_FROM_DBTENANT.value'
                ],
                labels: [t('in-sap:dashboards.performance'), t('in-sap:dashboards.receivingStatus')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
