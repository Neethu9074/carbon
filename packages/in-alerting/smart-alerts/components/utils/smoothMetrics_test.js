/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable comma-style */
/* eslint-env jest */

import { assert } from 'chai';

import { smoothMetrics } from 'in-alerting/smart-alerts/components/utils/chartUtil';

const granularity = 10 * 60 * 1000;
const weights = [0.1, 0.2, 0.4, 0.2, 0.1];

describe('smooth metrics', () => {
  it('with close values', () => {
    const metrics = [
      ['a', 1],
      ['b', 2],
      ['c', 4],
      ['d', 2],
      ['c', 1]
    ];
    const smoothedMetrics = smoothMetrics(metrics, granularity, weights);
    assert.equal(smoothedMetrics.length, 5, `Metric length equals ${metrics.length}`);
    assert.equal(smoothedMetrics[0][1].toFixed(2), 1.71);
    assert.equal(smoothedMetrics[1][1].toFixed(2), 2.22);
    assert.equal(smoothedMetrics[2][1].toFixed(2), 2.6);
    assert.equal(smoothedMetrics[3][1].toFixed(2), 2.22);
    assert.equal(smoothedMetrics[4][1].toFixed(2), 1.71);
  });

  it('preserves outlier', () => {
    const metrics = [
      ['a', 1],
      ['b', 2],
      ['c', 4],
      ['d', 20],
      ['c', 1]
    ];
    const smoothedMetrics = smoothMetrics(metrics, 10, weights);
    assert.equal(smoothedMetrics[0][1].toFixed(2), 1.71);
    assert.equal(smoothedMetrics[1][1].toFixed(2), 2.25);
    assert.equal(smoothedMetrics[2][1].toFixed(2), 3);
    assert.equal(smoothedMetrics[3][1].toFixed(2), 20);
    assert.equal(smoothedMetrics[4][1].toFixed(2), 1);
  });
});
