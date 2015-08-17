/// <reference path="../../typings/all.d.ts" />

import {Map} from 'immutable';
import {expect} from 'chai';

import MetricTimeSeries from './MetricTimeSeries';
import {Snapshot} from './types';

describe('tsdb.MetricTimeSeries', () => {

  let snapshot: Snapshot;
  let metric: string;

  beforeEach(() => {
    snapshot = Map({id: 'foobar'});
    metric = 'cpu.total.sys';
  });

  describe('getUniqueId', () => {
    it('should create a unique id based on the parameters', () => {
      let id = MetricTimeSeries.getUniqueId({
        snapshot,
        metric
      });
      expect(id).to.equal('foobar#cpu.total.sys');
    });
  });

  it('should expose an ID property with the unique id', () => {
    let timeSeries = new MetricTimeSeries({
      snapshot,
      metric
    });
    expect(timeSeries.id).to.equal('foobar#cpu.total.sys');
  });

});
