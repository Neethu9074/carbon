/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {create} from './index';

const conveyerPath = './InventoryConveyer';

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

      ConveyerType = proxyquire(conveyerPath, {
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

});
