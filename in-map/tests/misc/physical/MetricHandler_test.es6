/* eslint-env mocha, node */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { fromJS } from 'immutable';
import RoEmitter from 'roemitter';
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

      const createMetricHandler = proxyquire('in-map/misc/physical/MetricHandler', {
        'in-stores/metric': {
          activeMetric$,
          getMetricForFocusedMoment: () => create().startWith({ '1': 1 })
        },
        'in-sdk/metrics': {
          getMaxValue
        }
      }).default;

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

    it('should set the normalized metric values', () => {
      expect(setMetricValues).to.have.callCount(0);

      eventEmitter.emit('snapshotChanged', fromJS({ id: 'hasseNichJesehen' }));

      expect(setMetricValues).to.have.callCount(1);
      expect(setMetricValues.getCall(0).args[0]).to.deep.equal([1 / 10]);
    });
  });
});
