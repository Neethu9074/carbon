/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, seconds, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    hubforce: getDropwizardWithContext('entity.kubernetes.deployment.name:"hubforce"')
  },
  function Overview({ hubforce, timeConfig }) {
    return (
      <div>
        <h2>{t('in-internal:monitoringUnit.hubforce.hubforceInternal')}</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.numOfTasks')}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['metrics.gauges.com.instana.hubforce.accessor.postgres.tasks.Tasks.Waiting Tasks'],
                labels: [t('in-internal:monitoringUnit.hubforce.numOfTasks')],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.internalTimerMean')}>
            <Chart
              snapshotIds={hubforce.length === 0 ? [] : Array(3).fill(hubforce[0].dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: seconds.fixedCompact,
                metrics: [
                  'metrics.timers.com.instana.hubforce.api.companies.CompaniesService.Company List Load Time.mean',
                  'metrics.timers.com.instana.hubforce.io.butler.ButlerIo.Butler Data Reload time.mean',
                  'metrics.timers.com.instana.hubforce.jobs.migration.MigrationJob.Migration.mean'
                ],
                labels: [
                  t('in-internal:monitoringUnit.hubforce.companyListLoadTime'),
                  t('in-internal:monitoringUnit.hubforce.butlerDataReloadTime'),
                  t('in-internal:monitoringUnit.hubforce.migrationTime')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.4Xx5XxResp')}>
            <Chart
              snapshotIds={hubforce.length === 0 ? [] : Array(2).fill(hubforce[0].dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: [
                  'metrics.meters.io.dropwizard.jetty.MutableServletContextHandler.4xx-responses',
                  'metrics.meters.io.dropwizard.jetty.MutableServletContextHandler.5xx-responses'
                ],
                labels: [
                  t('in-internal:monitoringUnit.hubforce.numOf4xx'),
                  t('in-internal:monitoringUnit.hubforce.numOf5xx')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.logErrors')}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: ['metrics.meters.log.error'],
                labels: [t('in-internal:monitoringUnit.hubforce.numOfLogErrors')],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>Instana</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.downloadKeyValidate')}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['metrics.counters.Internal Download Key Validator'],
                labels: [t('in-internal:monitoringUnit.hubforce.numOfValidations')],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.sqsMsg')}>
            <Chart
              snapshotIds={hubforce.length === 0 ? [] : Array(2).fill(hubforce[0].dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: [
                  'metrics.counters.Internal SQS Message Receiver Counter',
                  'metrics.counters.Marketplace SQS Message Receiver Counter'
                ],
                labels: [
                  t('in-internal:monitoringUnit.hubforce.numOfInternalSqsMsg'),
                  t('in-internal:monitoringUnit.hubforce.numOfMarketplaceSqsMsg')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>{t('in-internal:monitoringUnit.hubforce.salesforce')}</h2>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.salesforceApiCallDurationMean')}>
            <Chart
              snapshotIds={hubforce.length === 0 ? [] : Array(2).fill(hubforce[0].dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: millis.detailed,
                metrics: [
                  'metrics.timers.salesforce-fetch-with-soql.mean',
                  'metrics.timers.salesforce-single-update.mean'
                ],
                labels: [
                  t('in-internal:monitoringUnit.hubforce.soqlFetchDuration'),
                  t('in-internal:monitoringUnit.hubforce.singlePopretyUpdateDuration')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.salesforceApiMultiplePropCallDurationMean')}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: millis.detailed,
                metrics: ['metrics.timers.salesforce-multiple-update.mean'],
                labels: [t('in-internal:monitoringUnit.hubforce.duration')],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.hubforce.salesforceApiErrorCall')}>
            <Chart
              snapshotIds={hubforce.length === 0 ? [] : Array(2).fill(hubforce[0].dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: ['metrics.meters.salesforce-rest-errors', 'metrics.meters.salesforce-soql-errors'],
                labels: [
                  t('in-internal:monitoringUnit.hubforce.numOfRestApiErrors'),
                  t('in-internal:monitoringUnit.hubforce.numOfSoqlApiErrors')
                ],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);
