/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';
import Immutable from 'immutable';
import sinon from 'sinon';

describe('health', () => {

  const snapshotId = Immutable.fromJS({
    steadyId: 's1',
    hostId: 'h1',
    pluginId: 'p1'
  });

  let observable;
  let health;
  let subscriber;

  beforeEach(() => {
    observable = ro.create();

    health = proxyquire('./index', {
      '../issueTracker': {
        getProblemsForSnapshot: () => observable
      }
    });

    subscriber = sinon.stub();
    health.getHealth(snapshotId).subscribe(subscriber);
  });

  describe('getHealth', () => {
    it('should generate a health stream', () => {
      observable.emit(Immutable.fromJS([{
        severity: 5
      }]));
      expect(subscriber.callCount).to.equal(1);
      expect(subscriber.getCall(0).args[0]).to.equal(health.health.warning);
    });

    it('should not emit when health does not change', () => {
      observable.emit(Immutable.fromJS([{
        severity: 5
      }]));
      observable.emit(Immutable.fromJS([{
        severity: 6
      }]));
      expect(subscriber.callCount).to.equal(1);
      expect(subscriber.getCall(0).args[0]).to.equal(health.health.warning);
    });

    it('should emit when health changes', () => {
      observable.emit(Immutable.fromJS([{
        severity: 5
      }]));
      observable.emit(Immutable.fromJS([{
        severity: 10
      }]));
      expect(subscriber.callCount).to.equal(2);
      expect(subscriber.getCall(1).args[0]).to.equal(health.health.danger);
    });

    it('should use the maximum severity', () => {
      observable.emit(Immutable.fromJS([{
        severity: 4
      }, {
        severity: 9
      }, {
        severity: 6
      }]));
      expect(subscriber.callCount).to.equal(1);
      expect(subscriber.getCall(0).args[0]).to.equal(health.health.danger);
    });
  });
});
