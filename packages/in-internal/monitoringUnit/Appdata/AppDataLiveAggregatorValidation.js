/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.jvm.app.name:"appdata-reader"')
})(function AppDataLiveAggregatorValidation({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
  const labels = getLabels(rows, /^.*(reader-\d+).*$/i);

  return (
    <Row>
      <Col xs={12}>
        <div>
          <h1>{t('in-internal:monitoringUnit.appdata.appDataLiveAggreValid.validation')}</h1>
          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataLiveAggreValid.validMetrics')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.AppDataLiveAggregatorValidation.validated-metrics`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataLiveAggreValid.criticalDeviations')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.AppDataLiveAggregatorValidation.critical-deviations`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>
        </div>
      </Col>
    </Row>
  );
});

function getLabels(rows, regexp) {
  return rows.map(r =>
    r.host
      .get('label')
      .replace(regexp, '$1')
      .replace('.instana.io', '')
      .replace('ip-', '')
  );
}
