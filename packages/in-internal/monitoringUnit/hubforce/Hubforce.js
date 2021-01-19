/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { number, seconds, millis } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    hubforce: getDropwizardWithContext('entity.kubernetes.deployment.name:"hubforce"')
  },
  function Overview({ hubforce, timeConfig }) {
    return (
      <div>
        <h2>Hubforce internal</h2>
        <Columize>
          <DashboardSection title={'Number of tasks'}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['metrics.gauges.com.instana.hubforce.accessor.postgres.tasks.Tasks.Waiting Tasks'],
                labels: ['# tasks'],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={'Internal timers (mean)'}>
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
                labels: ['company list load time', 'butler data reload time', 'migration time'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={'4xx & 5xx responses'}>
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
                labels: ['# 4xx', '# 5xx'],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={'Log errors'}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: ['metrics.meters.log.error'],
                labels: ['# log errors'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>Instana</h2>
        <Columize>
          <DashboardSection title={'Download key validations'}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['metrics.counters.Internal Download Key Validator'],
                labels: ['# validations'],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={'SQS messages'}>
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
                labels: ['# internal SQS messages', '# marketplace SQS messages'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>Salesforce</h2>
        <Columize>
          <DashboardSection title={'Salesforce API calls duration (mean)'}>
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
                labels: ['SOQL fetch duration', 'single poprety update duration'],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={'Salesforce API update multiple properties call duration (mean)'}>
            <Chart
              snapshotIds={hubforce.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: millis.detailed,
                metrics: ['metrics.timers.salesforce-multiple-update.mean'],
                labels: ['duration'],
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={'Salesforce API error calls'}>
            <Chart
              snapshotIds={hubforce.length === 0 ? [] : Array(2).fill(hubforce[0].dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: ['metrics.meters.salesforce-rest-errors', 'metrics.meters.salesforce-soql-errors'],
                labels: ['# REST API errors', '# SOQL API errors'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);
