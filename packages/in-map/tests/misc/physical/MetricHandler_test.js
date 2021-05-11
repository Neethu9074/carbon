/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { create } from '@instana/observables';
import RoEmitter from '@instana/roemitter';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import sinon from 'sinon';

describe('in-map', () => {
  describe('misc/physical/Layouter', () => {
    let setMetricValues;
    let activeMetric$;
    let metrichandler;
    let eventEmitter;
    let getMaxValue;
    let node;

    beforeEach(() => {
      jest.resetModules();
      activeMetric$ = create().startWith(
        fromJS({
          label: 'Load',
          metrics: [
            {
              label: 'Load',
              name: 'load.1min'
            }
          ]
        })
      );

      setMetricValues = sinon.stub();
      getMaxValue = sinon.stub().returns(10);
      eventEmitter = new RoEmitter();
      node = {
        setMetricValues,
        eventEmitter
      };

      jest.doMock('in-stores/metric', () => ({
        activeMetric$,
        getMetricForFocusedMoment: () => create().startWith({ '1': 1 })
      }));
      jest.doMock('in-sdk/metrics', () => ({ getMaxValue }));
      const createMetricHandler = require('in-map/misc/physical/MetricHandler').default;

      metrichandler = createMetricHandler(node, 'hasseNichJesehen');
    });

    afterEach(() => {
      metrichandler.dispose();
      eventEmitter.dispose();
    });

    it('should only call get max value when ready', () => {
      expect(getMaxValue).to.have.callCount(0);

      eventEmitter.emit('snapshotChanged', fromJS({ id: 'hasseNichJesehen' }));

      expect(getMaxValue).to.have.callCount(1);
      expect(getMaxValue.getCall(0).args[0]).to.equal('load.1min');
      expect(getMaxValue.getCall(0).args[1].get('id')).to.equal('hasseNichJesehen');
    });

    it('should set 0 as the initial value', () => {
      expect(setMetricValues).to.have.callCount(0);

      eventEmitter.emit('snapshotChanged', fromJS({ id: 'hasseNichJesehen' }));

      expect(setMetricValues).to.have.callCount(1);
      expect(setMetricValues.getCall(0).args[0]).to.deep.equal([0]);
    });
  });
});
