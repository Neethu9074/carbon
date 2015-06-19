/*eslint-env mocha*/
/*eslint-disable no-unused-vars, new-cap */

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import {create} from 'reactive-observables';

import * as ro from 'reactive-observables';


describe('relatedSnapshots', () => {

  let wiredSnapshots;
  let getWiredSnapshots;
  let onNext;
  let selectedSnapshotStore;
  let wiredSnapshotsObservable;

  beforeEach(() => {
    onNext = sinon.stub();
    wiredSnapshotsObservable = ro.create({
      emitLatestOnSubscribe: true
    });
    getWiredSnapshots = sinon.stub();
    getWiredSnapshots.returns(wiredSnapshotsObservable);

    selectedSnapshotStore = {
      selectedSnapshot: ro.create()
    };

    wiredSnapshots = proxyquire('./wiredSnapshots', {
      './selectedSnapshot': selectedSnapshotStore,
      'instana-ui-sdk/snapshot': {getWiredSnapshots}
    }).wiredSnapshots;
  });

  it('should setup subscriptions', () => {
    expect(getWiredSnapshots.callCount).to.equal(0);

    const snapshotDummy = 'a dummy';
    selectedSnapshotStore.selectedSnapshot.emit(snapshotDummy);
    wiredSnapshots.subscribe(onNext);

    expect(getWiredSnapshots.callCount).to.equal(1);
    expect(getWiredSnapshots.getCall(0).args[0]).to.equal(snapshotDummy);
  });

  it('should forward wired snapshots to subscribers', () => {
    wiredSnapshots.subscribe(onNext);
    wiredSnapshotsObservable.emit('42');
    expect(onNext.callCount).to.equal(1);
    expect(onNext.getCall(0).args[0]).to.equal('42');
  });

  it('should resubscribe to wired snapshot on selected snapshot change', () => {
    selectedSnapshotStore.selectedSnapshot.emit(snapshot(1));
    wiredSnapshots.subscribe(onNext);

    selectedSnapshotStore.selectedSnapshot.emit(snapshot(2));
    expect(getWiredSnapshots.callCount).to.equal(2);
  });

  it('should clear wired snapshots when no selected snapshot exists', () => {
    wiredSnapshotsObservable.emit('wiredSnapshotsForASelectedSnapshot');

    const noSelectedInitialValue = '42.24';
    const noSelectedSnapshotObservable = ro.create({
      emitLatestOnSubscribe: true
    });
    noSelectedSnapshotObservable.emit(noSelectedInitialValue);

    getWiredSnapshots.onCall(0).returns(wiredSnapshotsObservable);
    getWiredSnapshots.onCall(1).returns(noSelectedSnapshotObservable);

    const snap = snapshot(1);
    selectedSnapshotStore.selectedSnapshot.emit(snap);
    wiredSnapshots.subscribe(onNext);
    expect(onNext.callCount).to.equal(1);

    selectedSnapshotStore.selectedSnapshot.emit(null);

    expect(getWiredSnapshots.callCount).to.equal(2);
    expect(getWiredSnapshots.getCall(0).args[0]).to.equal(snap);
    expect(getWiredSnapshots.getCall(1).args[0]).to.equal(null);
    expect(onNext.callCount).to.equal(2);
    expect(onNext.getCall(1).args[0]).to.equal(noSelectedInitialValue);
  });

  function snapshot(id) {
    return Immutable.Map({
      steadyId: 's' + id,
      pluginId: 'p' + id,
      hostId: 'h' + id
    });
  }
});
