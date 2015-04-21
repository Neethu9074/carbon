/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import Immutable from 'immutable';
import {create} from './index';


describe('conveyer', () => {

  let http;
  let conveyer;
  let subscription;

  beforeEach(() => {
    http = sinon.stub();
  });

  afterEach(() => {
    subscription.dispose();
  });

  describe('InventoryConveyer', () => {
    let ConveyerType;

    beforeEach(() => {
      http.returns(Promise.resolve({
        status: 200,
        body: []
      }));

      const AbstractHttpConveyer = proxyquire('./AbstractHttpConveyer', {
        '../http': http
      });

      ConveyerType = proxyquire('./InventoryConveyer', {
        './AbstractHttpConveyer': AbstractHttpConveyer
      });

      conveyer = create(ConveyerType);
    });

    it('should emit the current inventory by default', done => {
      subscription = conveyer.subscribe(hosts => {
        expect(hosts.size).to.equal(0);
        done();
      });
    });

    // not using the arrow notation just so that we can access the unit test
    // execution context to change the timeout
    it('should not emit the same value twice', function(done) {
      this.timeout(3000);
      let callCount = 0;
      subscription = conveyer.subscribe(hosts => {
        expect(hosts.size).to.equal(0);
        callCount++;
      });

      setTimeout(() => {
        expect(callCount).to.equal(1);
        done();
      }, 2000);
    });

    it('should emit when values change', (done) => {
      let callCount = 0;

      subscription = conveyer.subscribe(hosts => {
        callCount++;

        if (callCount === 1) {
          expect(hosts.size).to.equal(0);
          http.returns(Promise.resolve({
            status: 200,
            body: [{
              id: 'foobar'
            }]
          }));
        } else {
          expect(hosts.size).to.equal(1);
          done();
        }
      });
    });

    it('should not create the same conveyer twice', () => {
      const conveyer2 = create(ConveyerType);
      expect(conveyer2).to.equal(conveyer);
    });
  });


  describe('MetricConveyer', () => {
    let ConveyerType;

    const config = {
      snapshot: Immutable.fromJS({
        hostId: 'ip-10-140-194-67.ec2.internal',
        steadyId: 'Linux.3.13.0-44-generic',
        pluginId: 'com.instana.forge.infrastructure.os.OS'
      }),
      metric: 'cpu.idle',
      min: 0,
      max: 1,
      frequency: 10,
      timeframe: 60
    };

    beforeEach(() => {
      http.returns(Promise.resolve({
        status: 200,
        body: [1, 2, 3, 4, 5, 6]
      }));

      const AbstractHttpConveyer = proxyquire('./AbstractHttpConveyer', {
        '../http': http
      });

      ConveyerType = proxyquire('./MetricConveyer', {
        './AbstractHttpConveyer': AbstractHttpConveyer,
        '../http': http
      });

      conveyer = create(ConveyerType, config);
    });

    it('should emit the metrics and value range', done => {
      subscription = conveyer.subscribe(e => {
        expect(e).to.be.defined;
        expect(e.get('min')).to.equal(config.min);
        expect(e.get('max')).to.equal(config.max);
        expect(e.get('frequency')).to.equal(config.frequency);
        expect(e.get('timeframe')).to.equal(config.timeframe);
        done();
      });
    });

    it('should emit a sufficient number of values', done => {
      subscription = conveyer.subscribe(e => {
        expect(e.get('values').size).to.equal(6);
        done();
      });
    });

    // not using the arrow notation just so that we can access the unit test
    // execution context to change the timeout
    it('should not emit the same value twice', done => {
      let callCount = 0;
      subscription = conveyer.subscribe(() => {
        callCount++;
      });

      setTimeout(() => {
        expect(callCount).to.equal(1);
        done();
      }, 100);
    });

    it('should not create the same conveyer twice', () => {
      const conveyer2 = create(ConveyerType, config);
      expect(conveyer2).to.equal(conveyer);
    });
  });

});
