/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, percentagePlainZeroDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['CICSTG_Region_Overview.cpu_utilization'],
    labels: [t('in-forge:plugins.zCtg.cpuUtilization')],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: [
      'CICSTG_Region_Overview.io_per_minute',
      'CICSTG_Region_Overview.health',
      'CICSTG_Region_Overview.requests_per_minute'
    ],
    labels: [
      t('in-forge:plugins.zCtg.ioPerMinute'),
      t('in-forge:plugins.zCtg.gatewayDaemonHealth'),
      t('in-forge:plugins.zCtg.totalRequestsPerMinute')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      'CICSTG_Connection_Manager_Threads.current_number_created',
      'CICSTG_Connection_Manager_Threads.current_number_allocated',
      'CICSTG_Connection_Manager_Threads.number_waiting'
    ],
    labels: [
      t('in-forge:plugins.zCtg.connectionManagerThreadsCreated'),
      t('in-forge:plugins.zCtg.connectionManagerThreadsAllocated'),
      t('in-forge:plugins.zCtg.numberWaiting')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['CICSTG_Connection_Manager_Threads.times_connecttimeout_limit_hit_per_minute'],
    labels: [t('in-forge:plugins.zCtg.timesConnecttimeoutLimitHitPerMinute')],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: ['CICSTG_Worker_Threads.current_number_created', 'CICSTG_Worker_Threads.current_number_allocated'],
    labels: [t('in-forge:plugins.zCtg.workerThreadsCreated'), t('in-forge:plugins.zCtg.workerThreadsAllocated')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'CICSTG_CICS_TS_Region_Details',
        'requests_executed_per_minute',
        t('in-forge:plugins.zCtg.cicsConnections.cicsServer')
      ),
      getDynamicMetricMatch(
        'CICSTG_CICS_TS_Region_Details',
        'connection_failures_per_minute',
        t('in-forge:plugins.zCtg.cicsConnections.cicsServer')
      ),
      getDynamicMetricMatch(
        'CICSTG_CICS_TS_Region_Details',
        'lost_connections_per_minute',
        t('in-forge:plugins.zCtg.cicsConnections.cicsServer')
      )
    ],
    labels: [
      t('in-forge:plugins.zCtg.cicsConnections.requestsExecutedPerMinute'),
      t('in-forge:plugins.zCtg.cicsConnections.connectionFailuresPerMinute'),
      t('in-forge:plugins.zCtg.cicsConnections.lostConnectionsPerMinute')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'CICSTG_CICS_TS_Region_Details',
        'average_response_time',
        t('in-forge:plugins.zCtg.cicsConnections.cicsServer')
      )
    ],
    labels: [t('in-forge:plugins.zCtg.cicsConnections.averageResponseTime')],
    min: 0,
    formatter: timeByMillisTwoDecimalPlaces
  }
];
