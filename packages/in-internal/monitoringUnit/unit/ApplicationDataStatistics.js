/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import { percentage, number, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ tenant, unit }) => ({
    appdata_processor_instances: getDropwizardWithContext(
      'entity.label:"*' + tenant + '-' + unit + '-appdata-processor*"'
    )
  }),
  function ApplicationDataStatistics({ timeConfig, tenantUnitId, appdata_processor_instances }) {
    const appdata_processor_labels = appdata_processor_instances.map(instance => instance.host.get('label'));

    return (
      <Fragment>
        <DashboardSection title={t('in-internal:monitoringUnit.unit.appDataStatistic.appDataProcessorInstance')}>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [`appdata-processor.instances`],
              labels: [t('in-internal:monitoringUnit.unit.appDataStatistic.appDataProcessorInst')],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropSumAInstance')}>
          <ChartExplanation>
            <div>
              {t('in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_1')}
              <ul>
                <li>
                  <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_2" components={{ italic: <i />, bold: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_3" components={{ italic: <i />, bold: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_4" components={{ italic: <i />, bold: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_5" components={{ italic: <i />, bold: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_6" components={{ italic: <i />, bold: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.spanDropSumChartExplanation_7" components={{ italic: <i />, bold: <strong /> }} />{' '}
                </li>
              </ul>
            </div>
          </ChartExplanation>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [`appdata-processor.spanDropping`],
              labels: [t('in-internal:monitoringUnit.unit.appDataStatistic.droppingRate')],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `appdata-processor.processedSpans`,
                `appdata-processor.droppedSpansDueToConfiguration`,
                `appdata-processor.droppedSpansDueToConsistentDropping`,
                `appdata-processor.droppedSpansDueToBackpressure`,
                `appdata-processor.droppedSpansDueToHardBackpressure`,
                `appdata-processor.droppedSpansDueToPerTraceConfiguration`
              ],
              labels: [
                t('in-internal:monitoringUnit.unit.appDataStatistic.processed'),
                t('in-internal:monitoringUnit.unit.appDataStatistic.dropGlobalThrottler'),
                t('in-internal:monitoringUnit.unit.appDataStatistic.dropConsistent'),
                t('in-internal:monitoringUnit.unit.appDataStatistic.dropBackpressure'),
                t('in-internal:monitoringUnit.unit.appDataStatistic.dropHardBackpressureRandom'),
                t('in-internal:monitoringUnit.unit.appDataStatistic.dropTraceThrottler')
              ],
              colors: [
                theme.lib.colors.success,
                theme.lib.colors.red800,
                theme.lib.colors.orange800,
                theme.lib.colors.yellow800,
                theme.lib.colors.pink800,
                theme.lib.colors.purple800
              ],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        {appdata_processor_instances.length > 1 && (
          <DashboardSection title={t('in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropPerInstance')}>
            <ChartExplanation>
            <div>
                {t('in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropInstChartExplanation_1')}
                <ul>
                  <li>{t('in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropInstChartExplanation_2')}</li>
                  <li>
                    {t('in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropInstChartExplanation_3')}
                    <ul>
                      <li>
                        <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropInstChartExplanation_4" components={{ italic: <i />, bold: <strong /> }} />
                      </li>
                      <li>
                        {t('in-internal:monitoringUnit.unit.appDataStatistic.backendSpanDropInstChartExplanation_5')}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </ChartExplanation>
            <Chart
              snapshotIds={appdata_processor_instances.map(instance => instance.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                max: 1,
                formatter: percentage.detailed,
                metrics: appdata_processor_instances.map(() => 'metrics.gauges.KPI.incoming.span_messages.error_rate'),
                labels: appdata_processor_labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        )}

        <DashboardSection title={t('in-internal:monitoringUnit.unit.appDataStatistic.spanLatencyMeanInstance')}>
          <ChartExplanation>
            <div>
              {t('in-internal:monitoringUnit.unit.appDataStatistic.spanLatencyMeanInstChartExplanation')}
            </div>
          </ChartExplanation>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: millis.compact,
              metrics: [
                `appdata-processor.spanLatency.mean`,
                `appdata-processor.spanLatency.50th`,
                `appdata-processor.spanLatency.99th`
              ],
              labels: ['Mean', '50th', '99th'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.unit.appDataStatistic.acceptorRateLimitSpanMsg')}>
          <ChartExplanation>
            <div>
            <Trans i18nKey="in-internal:monitoringUnit.unit.appDataStatistic.acceptorRateLimitSpanhartExplan" components={{ italic: <i />, bold: <strong /> }} />
            </div>
          </ChartExplanation>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [`acceptor.droppedSpanMessagesRateLimited`],
              labels: [t('in-internal:monitoringUnit.unit.appDataStatistic.acceptorDropSpanMsg')],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.unit.appDataStatistic.srvlessAcceptorRateLimitSpanMsg')}>
          <ChartExplanation>
            <div>
            {t('in-internal:monitoringUnit.unit.appDataStatistic.acceptorRateLimitSpanhartExplan')}
            </div>
          </ChartExplanation>
          <Chart
            snapshotId={tenantUnitId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [`serverless-acceptor.droppedSpanMessagesRateLimited`],
              labels: [t('in-internal:monitoringUnit.unit.appDataStatistic.srvlessAcceptorDropSpanMsg')],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
