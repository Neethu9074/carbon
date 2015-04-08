/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const conveyerPath = '../../../src/js/conveyer';

describe('conveyer', () => {

  let http;
  let conveyer;

  beforeEach(() => {
    http = {
      get: sinon.stub()
    };

    http.get.returns(Promise.resolve({
      status: 200,
      body: Immutable.fromJS([])
    }));

    conveyer = proxyquire(conveyerPath, {
      './http': http
    });
  });

  afterEach(() => {
    conveyer.dispose();
  });

  describe('inventoryConveyer', () => {

    it('should emit the current inventory by default', done => {
      conveyer.getInventory().subscribe(hosts => {
        expect(hosts.size).to.equal(0);
        done();
      });
    });

    // not using the arrow notation to access the unit test execution context
    // to change the timeout
    it('should not emit the same value twice', function(done) {
      this.timeout(3000);
      let callCount = 0;
      conveyer.getInventory().subscribe(hosts => {
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
      http.get.returns(Promise.resolve({
        status: 200,
        body: Immutable.fromJS([{
          id: 'foobar'
        }])
      }));

      conveyer.getInventory().subscribe(hosts => {
        callCount++;

        if (callCount === 1) {
          expect(hosts.size).to.equal(0);
        } else {
          expect(hosts.size).to.equal(1);
          done();
        }
      });
    });
  });

});
