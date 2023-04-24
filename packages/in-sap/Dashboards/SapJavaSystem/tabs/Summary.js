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
          title={t('in-sap:dashboards.deliveredMessages')}
          value={vm.j2eePerfRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.j2eePerfRating)}
        />
        <KpiCard
          title={t('in-sap:dashboards.hostAgentConnectionStatus')}
          value={vm.javaHostAgentRating || valueMissingPlaceholder}
          borderless
          color={colorFormatter(vm.javaHostAgentRating)}
        />
      </KpiGridRow>
      <Row>
        <Col lg={12}>
          <HttpAvailability snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.j2eeMessages')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: [
                  'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_CANCELED.value',
                  'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_DELIVERED.value'
                ],
                labels: [t('in-sap:dashboards.canceled'), t('in-sap:dashboards.delivered')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={12}>
          <Card title={t('in-sap:dashboards.messages_Issue')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number,
                metrics: ['metrics.Exceptions.J2EE_Messages_Issue.J2EE_SYS_J2EEMESSAGES_ERROR.value'],
                labels: [t('in-sap:dashboards.j2EE_SYS_J2EEMESSAGES_ERROR')],
                type: 'line'
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
