/*eslint-env mocha*/
/*eslint-disable no-unused-vars, new-cap */

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';
import {create} from 'reactive-observables';
import {
  getIdString,
  extractId,
  isIdEqual,
  extractConnections,
  calculateIpMap,
  only} from './snapshots';

describe('util.snapshots', () => {

  describe('extractId', () => {
    it('should extract IDs', () => {
      const id = extractId(newSnapshot(1));
      expect(id.get('pluginId')).to.equal('p1');
      expect(id.get('steadyId')).to.equal('s1');
      expect(id.get('hostId')).to.equal('h1');
    });
  });

  describe('isIdEqual', () => {
    it('should return false when IDs do not match', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(1))).to.equal(false);
    });

    it('should return true when ID matches', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(0))).to.equal(true);
    });
  });

  describe('getIdString', () => {
    it('should turn an immutable snapshot into an ID string', () => {
      expect(getIdString(newSnapshot(42)))
        .to.equal('h42#p42#s42');
    });

    it('should extract undefined', () => {
      const id = getIdString(Immutable.fromJS({
        pluginId: '1',
        steadyId: '2'
      }));
      expect(id).to.equal(undefined);
    });
  });

  describe('only', () => {
    let observable;
    let subscriber;

    beforeEach(() => {
      subscriber = sinon.stub();
      observable = create();
      only(observable, newSnapshot(2)).subscribe(subscriber);
    });

    it('should restrict to the desired snapshots', () => {
      expect(subscriber.callCount).to.equal(0);

      observable.emit(Immutable.List([newSnapshot(1)]));
      expect(subscriber.callCount).to.equal(0);

      observable.emit(Immutable.List([newSnapshot(1), newSnapshot(2)]));
      expect(subscriber.callCount).to.equal(1);
      expect(subscriber.getCall(0).args[0].get('hostId')).to.equal('h2');
    });

    it('should not emit when the snapshots is missing', () => {
      observable.emit(Immutable.List([newSnapshot(1)]));
      observable.emit(Immutable.List([newSnapshot(2)]));
      observable.emit(Immutable.List());
      expect(subscriber.callCount).to.equal(1);
    });
  });

  function newSnapshot(n) {
    return Immutable.fromJS({
      pluginId: 'p' + n,
      steadyId: 's' + n,
      hostId: 'h' + n
    });
  }
});
