/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */

import { fromJS } from 'immutable';
import { expect } from 'chai';

import { getMetricIds } from './JmxMetricsTable';

describe('getMetricIds', () => {
  it('should return ids', () => {
    const metricIds = getMetricIds(
      fromJS({
        data: {},
        metricIds: ['jmx.foo', 'jmx.bar']
      })
    );

    expect(metricIds.toJS()).to.include('foo', 'bar');
  });

  it('should return legacy ids', () => {
    const metricIds = getMetricIds(
      fromJS({
        data: {
          jmx: ['foo', 'bar']
        }
      })
    );

    expect(metricIds.toJS()).to.include('foo', 'bar');
  });
});
