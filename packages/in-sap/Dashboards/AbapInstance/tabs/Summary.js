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
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-sap:dashboards.instanceAvailability')}
          value={vm.availInstanceRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.availInstanceRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.abapCentralInstanceAvailability')}
          value={vm.availCentralInstanceRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.availCentralInstanceRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.abapVmcInstanceAvailability')}
          value={vm.availVmcInstanceRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.availVmcInstanceRating)}
        />
      </KpiGridRow>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard
          title={t('in-sap:dashboards.abapInstanceAvailability')}
          value={vm.availAbapInstanceRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.availAbapInstanceRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.abapInstancePerformance')}
          value={vm.perfRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.perfRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.abapInstanceExceptions')}
          value={vm.excepRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.excepRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.icm')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.ICM_Resources.ABAP_INST_ICM_CONN_USAGE.value',
                  'metrics.Performance.ICM_Resources.ABAP_INST_ICM_REQUEST_USAGE.value',
                  'metrics.Performance.ICM_Resources.ABAP_INST_ICM_THREAD_USAGE.value'
                ],
                labels: [
                  t('in-sap:dashboards.connUsage'),
                  t('in-sap:dashboards.reqUsage'),
                  t('in-sap:dashboards.threadUsage')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.instanceUser')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.ABAP_User_Load.ABAP_INST_TOTAL_USERS.value',
                  'metrics.Performance.ABAP_User_Load.ABAP_INST_RFC_USERS.value'
                ],
                labels: [t('in-sap:dashboards.totalUser'), t('in-sap:dashboards.rfcUser')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.dialog')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.Dialog_Response_Time.DIALOG_DB_REQUEST_TIME.value',
                  'metrics.Performance.Dialog_Response_Time.DIALOG_RESPONSE_TIME.value'
                ],
                labels: [t('in-sap:dashboards.reqTime'), t('in-sap:dashboards.resTime')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
