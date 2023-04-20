/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
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
        <KpiCard
          title={t('in-sap:dashboards.systemAvailability')}
          value={vm.availHanaRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.availHanaRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.performanceRating')}
          value={vm.perfHanaRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.perfHanaRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.performanceRating')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.System_Performance.SYSTEM_PERFORMANCE.value'
                ],
                labels: [t('in-sap:dashboards.performanceRating')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.systemAvailability')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: ['metrics.Availability.System_Availability.RECEIVING_STATUS_FROM_DATABASE.value'],
                labels: [t('in-sap:dashboards.systemAvailability')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
