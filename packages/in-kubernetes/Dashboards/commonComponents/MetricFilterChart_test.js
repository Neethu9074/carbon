/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */

import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import { create } from '@instana/observables';

import { getProps, NoopComponent } from 'in-test/enzymeTestUtils';
import MetricFilterChart from './MetricFilterChart';

describe('in-kubernetes/MetricFilterChart', () => {
  it('should disable metric series that do not match filters', () => {
    const metrics$ = create();

    const wrapper = shallowRenderMetricFilterChart(metrics$);
    metrics$.emit([1000, -1]);
    wrapper.update();

    expect(getProps(wrapper.dive().dive())).to.deep.equal({
      refSetter: null,
      snapshotId: 's',
      timeConfig,
      y1: {
        forceDisabledMetrics: ['a'],
        nonToggleableSeries: new Map([['a', "Alpha is below zero so it's invalid or some junk"]]),
        metrics: ['a', 'b'],
        labels: ['Alpha', 'Beta'],
        type: 'line'
      }
    });
  });

  it('should not disable metrics that match filters', () => {
    const metrics$ = create();

    const wrapper = shallowRenderMetricFilterChart(metrics$);
    metrics$.emit([1000, 1]);
    wrapper.update();

    expect(getProps(wrapper.dive().dive())).to.deep.equal({
      refSetter: null,
      snapshotId: 's',
      timeConfig,
      y1: {
        forceDisabledMetrics: [],
        nonToggleableSeries: new Map(),
        metrics: ['a', 'b'],
        labels: ['Alpha', 'Beta'],
        type: 'line'
      }
    });
  });
});

function shallowRenderMetricFilterChart(metrics$) {
  return shallow(
    <MetricFilterChart
      snapshotId="s"
      timeConfig={timeConfig}
      filterMetrics={['a']}
      filter={v => v > 0}
      filterReasons={["Alpha is below zero so it's invalid or some junk"]}
      chartComponent={NoopComponent}
      createObservable={() => metrics$}
      y1={{
        metrics: ['a', 'b'],
        labels: ['Alpha', 'Beta'],
        type: 'line'
      }}
    />
  );
}

const timeConfig = {
  windowSize: 360000,
  to: null,
  from: null,
  autoRefresh: true
};
