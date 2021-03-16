/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { fromJS } from 'immutable';
import { expect } from 'chai';

import { isPerformanceDataAvailable } from './util';

describe('isPerformanceDataAvailable', () => {
  it('for valid mysql verson 8 should return true', () => {
    const snapshot = fromJS({
      data: {
        sensorPerformanceSchemaStatus: 'OK',
        'variables.VERSION': '8.0.21'
      }
    });

    expect(isPerformanceDataAvailable(snapshot)).to.equal(true);
  });

  it('for valid mysql verson 5 should return true', () => {
    const snapshot = fromJS({
      data: {
        sensorPerformanceSchemaStatus: 'OK',
        'variables.VERSION': '5.6.10'
      }
    });

    expect(isPerformanceDataAvailable(snapshot)).to.equal(true);
  });

  it('for invalid mysql verson should return false', () => {
    const snapshot = fromJS({
      data: {
        sensorPerformanceSchemaStatus: 'OK',
        'variables.VERSION': '5.5.10'
      }
    });

    expect(isPerformanceDataAvailable(snapshot)).to.equal(false);
  });
});
