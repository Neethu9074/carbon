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
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: vm }) {
  const snapshotId = vm.id;
  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard
          title={t('in-sap:dashboards.availabilityRating')}
          value={vm.availRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.availRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.performanceRating')}
          value={vm.perfRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.perfRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.configRating')}
          value={vm.configRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.configRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.batchJobs')}
          value={vm.excepRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.excepRating)}
        />
      </KpiGridRow>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.queue')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Exceptions.ABAP_SYSTEM_BGRFC_OLDEST_AGE.value',
                  'metrics.Exceptions.ABAP_SYSTEM_BGRFC_QUEUES_ERRORSTATE.value',
                  'metrics.Exceptions.ABAP_SYSTEM_BGRFC_QUEUES_OLDER_1DAY.value',
                  'metrics.Exceptions.ABAP_SYS_ENQUEUE_OLDER_1DAY.value'
                ],
                labels: [
                  t('in-sap:dashboards.age'),
                  t('in-sap:dashboards.errorState'),
                  t('in-sap:dashboards.Older1Day'),
                  t('in-sap:dashboards.enqueue')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.userStats')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.ABAP_SYST_DIALOG_USERS.value',
                  'metrics.Performance.ABAP_SYST_HTTP_USERS.value',
                  'metrics.Performance.ABAP_SYST_TOTAL_USERS.value',
                  'metrics.Performance.ABAP_SYS_CONCURRENT_USERS.value'
                ],
                labels: [
                  t('in-sap:dashboards.dialogUsers'),
                  t('in-sap:dashboards.httpUsers'),
                  t('in-sap:dashboards.totalUsers'),
                  t('in-sap:dashboards.concurrentUsers')
                ],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.globalChnage')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: ['metrics.Configuration.ABAP_SYS_GLOBAL_CHANGE_OPTION.value'],
                labels: [t('in-sap:dashboards.value')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
