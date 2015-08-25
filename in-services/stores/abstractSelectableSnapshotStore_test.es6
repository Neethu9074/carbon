/*eslint-env mocha*/
/*eslint-disable no-unused-vars, new-cap, max-len */
import {expect} from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';

import {extractCoordinates, isIdEqual} from '../snapshots';


describe('stores.abstractSelectableSnapshotStore', () => {

  let snapshotConveyer;
  let getWiredSnapshots;
  let wiredSnapshotsObservable;
  let store;

  beforeEach(() => {
    snapshotConveyer = ro.create({
      emitLatestOnSubscribe: true
    });

    wiredSnapshotsObservable = ro.create({
      emitLatestOnSubscribe: true
    });
    getWiredSnapshots = sinon.stub();
    getWiredSnapshots.returns(wiredSnapshotsObservable);

    store = proxyquire('./abstractSelectableSnapshotStore', {
      '../snapshots': {
        getFullSnapshot: () => snapshotConveyer,
        isIdEqual
      },
      'in-sdk/snapshot': {
        getWiredSnapshots
      }
    })();
  });

  describe('wiredSnapshots', () => {

    it('should setup subscriptions', () => {
      const onNext = sinon.stub();
      expect(getWiredSnapshots.callCount).to.equal(0);

      const selectedSnapshot = snapshot(1);
      store.select(selectedSnapshot);
      snapshotConveyer.emit(selectedSnapshot);
      store.wiredSnapshots.subscribe(onNext);

      expect(getWiredSnapshots.callCount).to.equal(1);
      expect(getWiredSnapshots.getCall(0).args[0]).to.equal(selectedSnapshot);
    });

    it('should forward wired snapshots to subscribers', () => {
      const selectedSnapshot = snapshot(1);
      store.select(selectedSnapshot);

      const onNext = sinon.stub();
      store.wiredSnapshots.subscribe(onNext);

      wiredSnapshotsObservable.emit('42');
      expect(onNext.callCount).to.equal(1);
      expect(onNext.getCall(0).args[0]).to.equal('42');
    });

    it('should resubscribe to wired snapshot on selected snapshot change', () => {
      const s1 = snapshot(1);
      const s2 = snapshot(2);
      store.select(s1);
      snapshotConveyer.emit(s1);
      const onNext = sinon.stub();
      store.wiredSnapshots.subscribe(onNext);

      store.select(s2);
      snapshotConveyer.emit(s2);
      expect(getWiredSnapshots.callCount).to.equal(2);
      expect(getWiredSnapshots.getCall(0).args[0]).to.equal(s1);
      expect(getWiredSnapshots.getCall(1).args[0]).to.equal(s2);
    });

    it('should clear wired snapshots when no selected snapshot exists', () => {
      const snap = snapshot(1);
      wiredSnapshotsObservable.emit('wiredSnapshotsForASelectedSnapshot');

      const noSelectedInitialValue = '42.24';
      const noSelectedSnapshotObservable = ro.create({
        emitLatestOnSubscribe: true
      });
      noSelectedSnapshotObservable.emit(noSelectedInitialValue);

      getWiredSnapshots.onCall(0).returns(wiredSnapshotsObservable);
      getWiredSnapshots.onCall(1).returns(noSelectedSnapshotObservable);

      const onNext = sinon.stub();
      store.select(snap);
      snapshotConveyer.emit(snap);
      store.wiredSnapshots.subscribe(onNext);
      expect(onNext.callCount).to.equal(2);

      store.clear();

      expect(getWiredSnapshots.callCount).to.equal(2);
      expect(getWiredSnapshots.getCall(0).args[0]).to.equal(snap);
      expect(getWiredSnapshots.getCall(1).args[0]).to.equal(null);
      expect(onNext.callCount).to.equal(3);
      expect(onNext.getCall(2).args[0]).to.equal(noSelectedInitialValue);
    });

    it('should not call clear twice', () => {
      const onNext = sinon.stub();
      store.selectedSnapshot.subscribe(onNext);
      store.clear();
      store.clear();
      store.clear();

      expect(onNext.callCount).to.equal(1);
    });

    it('should emit immediately emit when there is a selected snapshot before ' +
        'a subscription is established', () => {
      const expected = 'wiredSnapshotsForASelectedSnapshot';
      wiredSnapshotsObservable.emit(expected);

      const snap = snapshot(1);
      store.select(snap);
      snapshotConveyer.emit(snap);

      const onNext = sinon.stub();
      store.wiredSnapshots.subscribe(onNext);

      expect(onNext.callCount).to.equal(2);
      expect(onNext.getCall(1).args[0]).to.equal(expected);
      expect(getWiredSnapshots.getCall(0).args[0]).to.equal(snap);
    });
  });

  function snapshot(id) {
    return extractCoordinates({
      steadyId: 's' + id,
      pluginId: 'p' + id,
      hostId: 'h' + id
    });
  }
});
