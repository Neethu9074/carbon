/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import HttpAvailability from 'in-sap/Dashboards/tables/HttpAvailabilty';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
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
