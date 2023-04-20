/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
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
      <KpiGridRow sizes={[4, 4, 4]}>
        <InfraMetricKpiCard
          title={t('in-sap:dashboards.icmStatus')}
          snapshotId={snapshotId}
          metric="metrics.Availability.Java_ICM_Status.JAVA_ICM_STATUS.value"
          formatter={number.compact}
        />
        <InfraMetricKpiCard
          title={t('in-sap:dashboards.nodeStatus')}
          snapshotId={snapshotId}
          metric="metrics.Availability.Java_Server_Node_Status.JAVA_SERVER_NODE_STATUS_Java_Server_Node_Status.value"
          formatter={number.compact}
        />
        <KpiCard
         title={t('in-sap:dashboards.httpAvailRating')}
         value={vm.httpAvailRating || valueMissingPlaceholder}
         borderless
         color={colorFormatter(vm.httpAvailRating)}
         />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.availability')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Availability.Java_Instance_Availability.HTTP_SERVICE_STATUS_(GRMG).value'
                ],
                labels: [t('in-sap:dashboards.instanceAvailability')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
