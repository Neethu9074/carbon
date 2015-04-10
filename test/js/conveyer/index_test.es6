/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {create} from '../../../src/js/conveyer'

const conveyerPath = '../../../src/js/conveyer/InventoryConveyer';

describe('conveyer', () => {

  let http;
  let conveyer;
  let subscription;

  beforeEach(() => {
    http = {
      get: sinon.stub()
    };
  });

  afterEach(() => {
    subscription.dispose();
  });

  describe('InventoryConveyer', () => {

    beforeEach(() => {
      http.get.returns(Promise.resolve({
        status: 200,
        body: Immutable.fromJS([])
      }));

      const ConveyerType = proxyquire(conveyerPath, {
        '../http': http
      });

      conveyer = create(ConveyerType);
    });

    it('should emit the current inventory by default', done => {
      subscription = conveyer.subscribe(hosts => {
        expect(hosts.size).to.equal(0);
        done();
      });
    });

    // not using the arrow notation to access the unit test execution context
    // to change the timeout
    it('should not emit the same value twice', function(done) {
      this.timeout(3000);
      let callCount = 0;
      conveyer.subscribe(hosts => {
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

      conveyer.subscribe(hosts => {
        callCount++;

        if (callCount === 1) {
          expect(hosts.size).to.equal(0);
          http.get.returns(Promise.resolve({
            status: 200,
            body: Immutable.fromJS([{
              id: 'foobar'
            }])
          }));
        } else {
          expect(hosts.size).to.equal(1);
          done();
        }
      });
    });
  });

});
