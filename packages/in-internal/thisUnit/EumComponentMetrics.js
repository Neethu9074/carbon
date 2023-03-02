/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getInstanaComponentMetrics } from 'in-internal/monitoringUnit/dataRetrieval';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { bytes } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getInstanaComponentMetrics('js-stack-trace-translator')
  },
  function EumComponentMetrics({ rows, timeConfig }) {
    return (
      <InternalViewWrapper>
        {!rows && <LoadingIndicator />}
        {rows && (
          <div>
            <h1>{t('in-internal:monitoringUnit.eum.overview.jsStackTraceTrxDataPreProc')}</h1>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.thisUnit.eum.sourceMapUsedStorageSize')}>
                <Chart
                  snapshotIds={rows.map(r => r.get('id'))}
                  timeConfig={timeConfig}
                  minRollup={5000}
                  y1={{
                    min: 0,
                    formatter: bytes.compact,
                    metrics: rows.map(() => 'sourceMapUsedStorageSize'),
                    type: 'line',
                    labels: ['']
                  }}
                />
              </DashboardSection>

              <DashboardSection title={t('in-internal:monitoringUnit.thisUnit.eum.sourceMapUploadedFilesSize')}>
                <Chart
                  snapshotIds={rows.map(r => r.get('id'))}
                  timeConfig={timeConfig}
                  minRollup={5000}
                  y1={{
                    min: 0,
                    formatter: bytes.compact,
                    metrics: rows.map(() => 'sourceMapUploadedFilesSize'),
                    type: 'line',
                    labels: ['']
                  }}
                />
              </DashboardSection>
            </Columize>
          </div>
        )}
      </InternalViewWrapper>
    );
  }
);
