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
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.service.name:"log-reader"')
  },
  function LogWriter({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
    const labels = rows.map(r =>
      r.host
        .get('label')
        .replace('.instana.io', '')
        .replace('ip-', '')
    );

    return (
      <div>
        <h1>{t('in-internal:monitoringUnit.log.reader.name')}</h1>

        <DashboardSection title={t('in-internal:monitoringUnit.log.reader.hostCpuLoad')}>
          <Chart
            snapshotIds={rows.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: rows.map(() => 'load.1min'),
              labels,
              type: 'line'
            }}
          />
        </DashboardSection>
      </div>
    );
  }
);
