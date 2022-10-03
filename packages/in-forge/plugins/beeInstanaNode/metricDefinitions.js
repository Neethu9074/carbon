/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, nanos } from 'in-services/formatters/number';
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
      t('in-forge:plugins.beeInstana.labelMetrics'),
      t('in-forge:plugins.beeInstana.labelMessages'),
      t('in-forge:plugins.beeInstana.labelErrors'),
      t('in-forge:plugins.beeInstana.labelSpillOver'),
      t('in-forge:plugins.beeInstana.labelMetricCount'),
      t('in-forge:plugins.beeInstana.labelDatapointCount'),
      t('in-forge:plugins.beeInstana.labelMessageDelay'),
      t('in-forge:plugins.beeInstana.labelMaxQueueSize'),
      t('in-forge:plugins.beeInstana.labelTaskQueueSize'),
      t('in-forge:plugins.beeInstana.labelWorkerPoolSize'),
      t('in-forge:plugins.beeInstana.labelDuration'),
      t('in-forge:plugins.beeInstana.labelCount'),
      t('in-forge:plugins.beeInstana.labelsSucceededBytes'),
      t('in-forge:plugins.beeInstana.labelFailedBytes'),
      t('in-forge:plugins.beeInstana.labelSucceededCount'),
      t('in-forge:plugins.beeInstana.labelFailedCount')
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
      'Aggregator.AggregatorHouseKeeping.EmergencyFlush.sum'
    ],
    labels: [
      t('in-forge:plugins.beeInstana.labelAggregateDatasize'),
      t('in-forge:plugins.beeInstana.labelCount'),
      t('in-forge:plugins.beeInstana.labelSpillOver'),
      t('in-forge:plugins.beeInstana.labelTaskQueueSize'),
      t('in-forge:plugins.beeInstana.labelMaxLatency'),
      t('in-forge:plugins.beeInstana.labelMinLatency'),
      t('in-forge:plugins.beeInstana.labelRequestCount'),
      t('in-forge:plugins.beeInstana.labelMaxLatency'),
      t('in-forge:plugins.beeInstana.labelMinLatency'),
      t('in-forge:plugins.beeInstana.labelRequestCount'),
      t('in-forge:plugins.beeInstana.label10s'),
      t('in-forge:plugins.beeInstana.label1m'),
      t('in-forge:plugins.beeInstana.label5m'),
      t('in-forge:plugins.beeInstana.label1h'),
      t('in-forge:plugins.beeInstana.label10s'),
      t('in-forge:plugins.beeInstana.label1m'),
      t('in-forge:plugins.beeInstana.label5m'),
      t('in-forge:plugins.beeInstana.label1h'),
      t('in-forge:plugins.beeInstana.label10s'),
      t('in-forge:plugins.beeInstana.label1m'),
      t('in-forge:plugins.beeInstana.label5m'),
      t('in-forge:plugins.beeInstana.label1h'),
      t('in-forge:plugins.beeInstana.labelEmergencyFlush')
    ],
    min: 0,
    formatter: number
  }
];
