import { combineLatest } from '@instana/observables';
import moment from 'moment';
import React from 'react';

import createLatestMetricsSubscription from 'in-subscription/latestMetrics';
import createMetricsSubscription from 'in-subscription/metrics';
import connectTo from 'in-hoc/connectTo';

export const DROPWIZARD_STATS = [
  {
    id: 'spanMessageReceived',
    label: 'Span Message Received',
    metric: 'KPI.incoming.span_messages.calls'
  },
  {
    id: 'spanMessageDropped',
    label: 'Span Message Dropped',
    metric: 'KPI.incoming.span_messages.errors'
  },
  {
    id: 'spanProcessed',
    label: 'Span Processed',
    metric: 'KPI.processing.spans.calls'
  },
  {
    id: 'spanStored',
    label: 'Span Stored',
    metric: 'KPI.outgoing.spans.calls'
  }
];

const METER_METRIC_PREFIX = 'metrics.meters.';
const ROLL_UP = 3600000; // 1h

export default connectTo(
  props => {
    return {
      dropwizardStats: getDropwizardStats(props),
      esIndexSize: getEsIndexSize(props),
      cassandraDiskSize: getCassandraDiskSize(props)
    };
  },
  function FillerStatsRow({ region, snapshotId, tuName, dropwizardStats, esIndexSize, cassandraDiskSize }) {
    let dropwizardStatsObj = {};
    if (dropwizardStats) {
      dropwizardStats.map(stat => (dropwizardStatsObj[stat.id] = stat.values));
    }

    const { spanMessageReceived, spanMessageDropped, spanProcessed, spanStored } = dropwizardStatsObj;

    return (
      <div>
        {region};{snapshotId};{tuName};{spanMessageReceived ? spanMessageReceived.average : ''};
        {spanMessageDropped ? spanMessageDropped.average : ''};{spanProcessed ? spanProcessed.average : ''};
        {spanStored ? spanStored.average : ''};{spanMessageReceived ? spanMessageReceived.top : ''};
        {spanMessageDropped ? spanMessageDropped.top : ''};{spanProcessed ? spanProcessed.top : ''};
        {spanStored ? spanStored.top : ''};{esIndexSize ? esIndexSize : ''};{cassandraDiskSize ? cassandraDiskSize : ''}
        ;
      </div>
    );
  }
);

function getDropwizardStats(props) {
  const { snapshotId, timeConfig } = props;

  return combineLatest(
    DROPWIZARD_STATS.map(stat =>
      createMetricsSubscription({
        snapshotId,
        metric: METER_METRIC_PREFIX + stat.metric,
        timeConfig,
        rollup: ROLL_UP
      }).map(response => {
        const values = response.map(values => values[1]);
        const average = calculateAverage(values, timeConfig.windowSize, ROLL_UP);
        const top = calculateTop(values);

        return {
          id: stat.id,
          values: {
            average,
            top
          }
        };
      })
    )
  );
}

function getEsIndexSize(props) {
  const { esSnapshotId, timeConfig, tuName } = props;

  return combineLatest(
    getDateStrings(timeConfig)
      .map(dateStr => getESIndexSizeMetric(tuName, dateStr))
      .map(metric =>
        createLatestMetricsSubscription({
          snapshotId: esSnapshotId,
          metric: metric,
          timeConfig,
          rollup: ROLL_UP
        })
      )
  ).map(responses => {
    return responses.map(response => response[1]).reduce((a, b) => a + b, 0);
  });
}

function getCassandraDiskSize(props) {
  const { cassandraSnapshotId, timeConfig, tuName } = props;

  return createMetricsSubscription({
    snapshotId: cassandraSnapshotId,
    metric: getCassandraDiskSizeMetric(tuName),
    timeConfig,
    rollup: ROLL_UP
  }).map(response => {
    return response.map(value => value[1]).reduce((a, b) => a + b, 0) / response.length;
  });
}

function calculateAverage(values, windowSize, rollup) {
  return (values.reduce((a, b) => a + b, 0) * rollup) / windowSize;
}

function calculateTop(values) {
  if (values.length == 0) return 0;
  return Math.max(...values);
}

function getDateStrings(timeConfig) {
  const fromDate = moment(timeConfig.to - timeConfig.windowSize);
  const toDate = moment(timeConfig.to);
  let dateStrings = [];
  let enumDate = fromDate;
  while (enumDate.isSameOrBefore(toDate, 'day')) {
    dateStrings.push(enumDate.format('YYYY-MM-DD'));
    enumDate.add(1, 'day');
  }
  return dateStrings;
}

function getESIndexSizeMetric(tuName, dateStr) {
  return `index.saas_${getTUNameInMetric(tuName)}_traces_${dateStr}.size`;
}

function getCassandraDiskSizeMetric(tuName) {
  return `keyspace.saas_${getTUNameInMetric(tuName)}.diskSize`;
}

function getTUNameInMetric(tuName) {
  return tuName.replace('-', '_');
}
