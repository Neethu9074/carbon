/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum',
      'Ingestor.KafkaConsumer.MessageDelay.count',
      'Ingestor.KafkaConsumer.Error.sum',
      'Ingestor.KafkaConsumer.SpillOver.sum',
      'Ingestor.KafkaConsumer.NumOfMetrics.sum',
      'Ingestor.KafkaConsumer.NumOfDataPoints.sum',
      'Ingestor.KafkaConsumer.MessageDelay.max',
      'Ingestor.Configuration.MaxQueueSize.max',
      'Ingestor.KafkaConsumer.TaskQueueSize.max',
      'Ingestor.Configuration.WorkerPoolSize.max',
      'Ingestor.AggregatorFlushByTimeAndPartition.Duration.max',
      'Ingestor.AggregatorFlushByTimeAndPartition.Duration.count',
      'Ingestor.HttpSender.SucceededBytes.sum',
      'Ingestor.HttpSender.FailedBytes.sum',
      'Ingestor.HttpSender.SucceededBytes.count',
      'Ingestor.HttpSender.FailedBytes.count'
    ],
    labels: [
      t('in-forge:plugins.beeInstana.dashboard.labelMetrics'),
      t('in-forge:plugins.beeInstana.dashboard.labelMessages'),
      t('in-forge:plugins.beeInstana.dashboard.labelErrors'),
      t('in-forge:plugins.beeInstana.dashboard.labelSpillOver'),
      t('in-forge:plugins.beeInstana.dashboard.labelMetricCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelDatapointCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelMessageDelay'),
      t('in-forge:plugins.beeInstana.dashboard.labelMaxQueueSize'),
      t('in-forge:plugins.beeInstana.dashboard.labelTaskQueueSize'),
      t('in-forge:plugins.beeInstana.dashboard.labelWorkerPoolSize'),
      t('in-forge:plugins.beeInstana.dashboard.labelDuration'),
      t('in-forge:plugins.beeInstana.dashboard.labelCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelsSucceededBytes'),
      t('in-forge:plugins.beeInstana.dashboard.labelFailedBytes'),
      t('in-forge:plugins.beeInstana.dashboard.labelSucceededCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelFailedCount')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'Aggregator.AggregateBinary.DataSize.max',
      'Aggregator.AggregatorStats.NumMetricsWithData.max',
      'Aggregator.AggregateBinary.SpillOver.sum',
      'Aggregator.AggregatorStats.TaskQueueSize.max',
      'Aggregator.GetMetrics.Timing.max',
      'Aggregator.GetMetrics.Timing.min',
      'Aggregator.GetMetrics.Timing.count',
      'Aggregator.GetMetricData.Timing.max',
      'Aggregator.GetMetricData.Timing.min',
      'Aggregator.GetMetricData.Timing.count',
      'Aggregator.AggregatorPrune.period10.Duration.max',
      'Aggregator.AggregatorPrune.period60.Duration.max',
      'Aggregator.AggregatorPrune.period300.Duration.max',
      'Aggregator.AggregatorPrune.period3600.Duration.max',
      'Aggregator.AggregatorPrune.period10.NumPrunedObservations.max',
      'Aggregator.AggregatorPrune.period60.NumPrunedObservations.max',
      'Aggregator.AggregatorPrune.period300.NumPrunedObservations.max',
      'Aggregator.AggregatorPrune.period3600.NumPrunedObservations.max',
      'Aggregator.AggregatorPrune.period10.NumOpenedMetricDbs.max',
      'Aggregator.AggregatorPrune.period60.NumOpenedMetricDbs.max',
      'Aggregator.AggregatorPrune.period300.NumOpenedMetricDbs.max',
      'Aggregator.AggregatorPrune.period3600.NumOpenedMetricDbs.max',
      'Aggregator.AggregatorHouseKeeping.EmergencyFlush.sum',
      'Aggregator.QueryConnectionPool.NumRequestErrors.sum'
    ],
    labels: [
      t('in-forge:plugins.beeInstana.dashboard.labelAggregateDatasize'),
      t('in-forge:plugins.beeInstana.dashboard.labelCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelSpillOver'),
      t('in-forge:plugins.beeInstana.dashboard.labelTaskQueueSize'),
      t('in-forge:plugins.beeInstana.dashboard.labelGetMetricsMaxLatency'),
      t('in-forge:plugins.beeInstana.dashboard.labelGetMetricsMinLatency'),
      t('in-forge:plugins.beeInstana.dashboard.labelGetMetricsRequestCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelGetMetricDataMaxLatency'),
      t('in-forge:plugins.beeInstana.dashboard.labelGetMetricDataMinLatency'),
      t('in-forge:plugins.beeInstana.dashboard.labelGetMetricDataRequestCount'),
      t('in-forge:plugins.beeInstana.dashboard.labelPruneDuration10s'),
      t('in-forge:plugins.beeInstana.dashboard.labelPruneDuration1m'),
      t('in-forge:plugins.beeInstana.dashboard.labelPruneDuration5m'),
      t('in-forge:plugins.beeInstana.dashboard.labelPruneDuration1h'),
      t('in-forge:plugins.beeInstana.dashboard.labelPrunedObservations10s'),
      t('in-forge:plugins.beeInstana.dashboard.labelPrunedObservations1m'),
      t('in-forge:plugins.beeInstana.dashboard.labelPrunedObservations5m'),
      t('in-forge:plugins.beeInstana.dashboard.labelPrunedObservations1h'),
      t('in-forge:plugins.beeInstana.dashboard.labelOpenedDbs10s'),
      t('in-forge:plugins.beeInstana.dashboard.labelOpenedDbs1m'),
      t('in-forge:plugins.beeInstana.dashboard.labelOpenedDbs5m'),
      t('in-forge:plugins.beeInstana.dashboard.labelOpenedDbs1h'),
      t('in-forge:plugins.beeInstana.dashboard.labelEmergencyFlush'),
      t('in-forge:plugins.beeInstana.dashboard.labelNumOfErrorRequests')
    ],
    min: 0,
    formatter: number
  }
];
