/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */

import { fromJS } from 'immutable';
import { expect } from 'chai';

import { SPECS as PROMETHEUS_SPECS } from 'in-forge/plugins/prometheus/Dashboard/PrometheusCustomMetrics';
import { SPECS as MICROMETER_SPECS } from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MicrometerMetrics';
import { getDefaultRows } from './CustomMetricsV2';

describe('CustomMetricsV2', () => {
  describe('getDefaultRows', () => {
    it('should return rows from legacy snapshot', () => {
      const snapshot = fromJS({
        data: {
          'metrics.counters': ['one'],
          'metrics.gauges': ['two'],
          'metrics.histograms': ['three'],
          'metrics.meters': ['four'],
          'metrics.timers': ['five'],
          'metrics.summaries': ['six']
        }
      });
      const timeConfig = 'fake time config';

      const rows = getDefaultRows({ snapshot, timeConfig });

      expect(rows[0]).to.nested.include({
        key: 'metrics.counters.one',
        name: 'one',
        color: '#00CC66',
        type: 'counter',
        'metrics[0].name': 'metrics.counters.one',
        'metrics[0].label': 'Count'
      });
      expect(rows[1]).to.nested.include({
        key: 'metrics.gauges.two',
        name: 'two',
        color: '#D90368',
        type: 'gauge',
        'metrics[0].name': 'metrics.gauges.two',
        'metrics[0].label': 'Value'
      });
      expect(rows[2]).to.nested.include({
        key: 'metrics.histograms.three',
        name: 'three',
        color: '#F1C40F',
        type: 'histogram',
        'metrics[0].name': 'metrics.histograms.three.mean',
        'metrics[0].label': 'Mean',
        'metrics[1].name': 'metrics.histograms.three.50th',
        'metrics[1].label': '50th',
        'metrics[2].name': 'metrics.histograms.three.99th',
        'metrics[2].label': '99th'
      });
      expect(rows[3]).to.nested.include({
        key: 'metrics.meters.four',
        name: 'four',
        color: '#2274A5',
        type: 'meter',
        'metrics[0].name': 'metrics.meters.four',
        'metrics[0].label': 'Rate'
      });
      expect(rows[4]).to.nested.include({
        key: 'metrics.timers.five',
        name: 'five',
        color: '#F75C03',
        type: 'timer',
        tableMetric: 1,
        'metrics[0].name': 'metrics.timers.five.rate',
        'metrics[0].label': 'Rate',
        'metrics[1].name': 'metrics.timers.five.mean',
        'metrics[1].label': 'Mean',
        'metrics[2].name': 'metrics.timers.five.50th',
        'metrics[2].label': '50th',
        'metrics[3].name': 'metrics.timers.five.99th',
        'metrics[3].label': '99th'
      });
      expect(rows[5]).to.nested.include({
        key: 'metrics.summaries.six',
        name: 'six',
        color: '#f75c03',
        type: 'summary',
        'metrics[0].name': 'metrics.summaries.six',
        'metrics[0].label': 'Value'
      });
    });

    it('should return rows from legacy snapshot without expanded sub-metrics (for e.g. prometheus)', () => {
      const snapshot = fromJS({
        data: {
          'metrics.counters': ['one'],
          'metrics.gauges': ['two'],
          'metrics.histograms': ['three'],
          'metrics.summaries': ['four']
        }
      });
      const timeConfig = 'fake time config';

      const rows = getDefaultRows({
        snapshot,
        timeConfig,
        specs: PROMETHEUS_SPECS
      });

      expect(rows[0]).to.nested.include({
        key: 'metrics.counters.one',
        name: 'one',
        color: '#00CC66',
        type: 'counter',
        'metrics[0].name': 'metrics.counters.one',
        'metrics[0].label': 'Count'
      });
      expect(rows[1]).to.nested.include({
        key: 'metrics.gauges.two',
        name: 'two',
        color: '#D90368',
        type: 'gauge',
        'metrics[0].name': 'metrics.gauges.two',
        'metrics[0].label': 'Value'
      });
      expect(rows[2]).to.nested.include({
        key: 'metrics.histograms.three',
        name: 'three',
        color: '#F1C40F',
        type: 'histogram',
        'metrics[0].name': 'metrics.histograms.three',
        'metrics[0].label': 'Value'
      });
      expect(rows[3]).to.nested.include({
        key: 'metrics.summaries.four',
        name: 'four',
        color: '#f75c03',
        type: 'summary',
        'metrics[0].name': 'metrics.summaries.four',
        'metrics[0].label': 'Value'
      });
    });

    it('should return rows from metric ids', () => {
      const snapshot = fromJS({
        metricIds: [
          'metrics.counters.one',
          'metrics.gauges.two',
          'metrics.histograms.three.99th',
          'metrics.histograms.three.mean',
          'metrics.histograms.three.50th',
          'metrics.meters.four',
          'metrics.timers.five.50th',
          'metrics.timers.five.mean',
          'metrics.timers.five.rate',
          'metrics.timers.five.99th',
          'metrics.summaries.six'
        ]
      });
      const timeConfig = 'fake time config';

      const rows = getDefaultRows({ snapshot, timeConfig });

      expect(rows[0]).to.nested.include({
        key: 'metrics.counters.one',
        name: 'one',
        color: '#00CC66',
        type: 'counter',
        'metrics[0].name': 'metrics.counters.one',
        'metrics[0].label': 'Count'
      });
      expect(rows[1]).to.nested.include({
        key: 'metrics.gauges.two',
        name: 'two',
        color: '#D90368',
        type: 'gauge',
        'metrics[0].name': 'metrics.gauges.two',
        'metrics[0].label': 'Value'
      });
      expect(rows[2]).to.nested.include({
        key: 'metrics.histograms.three',
        name: 'three',
        color: '#F1C40F',
        type: 'histogram',
        'metrics[0].name': 'metrics.histograms.three.mean',
        'metrics[0].label': 'Mean',
        'metrics[1].name': 'metrics.histograms.three.50th',
        'metrics[1].label': '50th',
        'metrics[2].name': 'metrics.histograms.three.99th',
        'metrics[2].label': '99th'
      });
      expect(rows[3]).to.nested.include({
        key: 'metrics.meters.four',
        name: 'four',
        color: '#2274A5',
        type: 'meter',
        'metrics[0].name': 'metrics.meters.four',
        'metrics[0].label': 'Rate'
      });
      expect(rows[4]).to.nested.include({
        key: 'metrics.timers.five',
        name: 'five',
        color: '#F75C03',
        type: 'timer',
        tableMetric: 1,
        'metrics[0].name': 'metrics.timers.five.rate',
        'metrics[0].label': 'Rate',
        'metrics[1].name': 'metrics.timers.five.mean',
        'metrics[1].label': 'Mean',
        'metrics[2].name': 'metrics.timers.five.50th',
        'metrics[2].label': '50th',
        'metrics[3].name': 'metrics.timers.five.99th',
        'metrics[3].label': '99th'
      });
      expect(rows[5]).to.nested.include({
        key: 'metrics.summaries.six',
        name: 'six',
        color: '#f75c03',
        type: 'summary',
        'metrics[0].name': 'metrics.summaries.six',
        'metrics[0].label': 'Value'
      });
    });

    it('should return rows from metric ids without expanded sub-metrics', () => {
      const snapshot = fromJS({
        metricIds: ['metrics.counters.one', 'metrics.gauges.two', 'metrics.histograms.three', 'metrics.summaries.four']
      });
      const timeConfig = 'fake time config';

      const rows = getDefaultRows({ snapshot, timeConfig, specs: PROMETHEUS_SPECS });

      expect(rows[0]).to.nested.include({
        key: 'metrics.counters.one',
        name: 'one',
        color: '#00CC66',
        type: 'counter',
        'metrics[0].name': 'metrics.counters.one',
        'metrics[0].label': 'Count'
      });
      expect(rows[1]).to.nested.include({
        key: 'metrics.gauges.two',
        name: 'two',
        color: '#D90368',
        type: 'gauge',
        'metrics[0].name': 'metrics.gauges.two',
        'metrics[0].label': 'Value'
      });
      expect(rows[2]).to.nested.include({
        key: 'metrics.histograms.three',
        name: 'three',
        color: '#F1C40F',
        type: 'histogram',
        'metrics[0].name': 'metrics.histograms.three',
        'metrics[0].label': 'Value'
      });
      expect(rows[3]).to.nested.include({
        key: 'metrics.summaries.four',
        name: 'four',
        color: '#f75c03',
        type: 'summary',
        'metrics[0].name': 'metrics.summaries.four',
        'metrics[0].label': 'Value'
      });
    });

    it('should return rows for micrometer metrics', () => {
      const snapshot = fromJS({
        metricIds: [
          'micrometer.metrics.gauge.one',
          'micrometer.metrics.timeGauge.two',
          'micrometer.metrics.counter.three',
          'micrometer.metrics.functionCounter.four',
          'micrometer.metrics.timer.five',
          'micrometer.metrics.functionTimer.six',
          'micrometer.metrics.longTaskTimer.seven',
          'micrometer.metrics.distributionSummary.eight'
        ]
      });
      const timeConfig = 'fake time config';

      const rows = getDefaultRows({ snapshot, timeConfig, specs: MICROMETER_SPECS });

      expect(rows[0]).to.nested.include({
        key: 'micrometer.metrics.gauge.one',
        name: 'one',
        color: '#D90368',
        type: 'gauge',
        'metrics[0].name': 'micrometer.metrics.gauge.one',
        'metrics[0].label': 'Value'
      });
      expect(rows[1]).to.nested.include({
        key: 'micrometer.metrics.timeGauge.two',
        name: 'two',
        color: '#D90368',
        type: 'time gauge',
        'metrics[0].name': 'micrometer.metrics.timeGauge.two',
        'metrics[0].label': 'Value'
      });
      expect(rows[2]).to.nested.include({
        key: 'micrometer.metrics.counter.three',
        name: 'three',
        color: '#00CC66',
        type: 'counter',
        'metrics[0].name': 'micrometer.metrics.counter.three',
        'metrics[0].label': 'Count'
      });
      expect(rows[3]).to.nested.include({
        key: 'micrometer.metrics.functionCounter.four',
        name: 'four',
        color: '#00CC66',
        type: 'function counter',
        'metrics[0].name': 'micrometer.metrics.functionCounter.four',
        'metrics[0].label': 'Count'
      });
      expect(rows[4]).to.nested.include({
        key: 'micrometer.metrics.timer.five',
        name: 'five',
        color: '#F75C03',
        type: 'timer',
        'metrics[0].name': 'micrometer.metrics.timer.five',
        'metrics[0].label': 'Value'
      });
      expect(rows[5]).to.nested.include({
        key: 'micrometer.metrics.functionTimer.six',
        name: 'six',
        color: '#F75C03',
        type: 'function timer',
        'metrics[0].name': 'micrometer.metrics.functionTimer.six',
        'metrics[0].label': 'Value'
      });
      expect(rows[6]).to.nested.include({
        key: 'micrometer.metrics.longTaskTimer.seven',
        name: 'seven',
        color: '#F75C03',
        type: 'long task timer',
        'metrics[0].name': 'micrometer.metrics.longTaskTimer.seven',
        'metrics[0].label': 'Value'
      });
      expect(rows[7]).to.nested.include({
        key: 'micrometer.metrics.distributionSummary.eight',
        name: 'eight',
        color: '#f7b320',
        type: 'distribution',
        'metrics[0].name': 'micrometer.metrics.distributionSummary.eight',
        'metrics[0].label': 'Value'
      });
    });
  });
});
