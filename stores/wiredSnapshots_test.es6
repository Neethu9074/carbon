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
    wiredSnapshotsObservable = ro.create();
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

  it('should', () => {
    const snapshotDummy = 'a dummy';
    selectedSnapshotStore.selectedSnapshot.emit(snapshotDummy);

    wiredSnapshots.subscribe(onNext);

    const anotherSnapshotDummy = 'another dummy';
    selectedSnapshotStore.selectedSnapshot.emit(anotherSnapshotDummy);

    expect(getWiredSnapshots.callCount).to.equal(2);
  });

});
