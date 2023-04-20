/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import KpiCard from 'in-components/KpiCard/KpiCard';
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
          title={t('in-sap:dashboards.enqueueServerStatus')}
          value={vm.enqueueStatusRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.enqueueStatusRating)}
        />
         <KpiCard
          title={t('in-sap:dashboards.messageServerStatus')}
          value={vm.serverStatusRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.enqueueStatusRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.enqueueStatus')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Availability.Java_Enqueue_Server_Status.JAVA_SCS_ENQUEUE_STATUS.value',
                  'metrics.Availability.Java_Enqueue_Server_Status.JAVA_SCS_MESSAGE_SERVER_STATUS.value'
                ],
                labels: [t('in-sap:dashboards.enqueueServerStatus'), t('in-sap:dashboards.messageServerStatus')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
