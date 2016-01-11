/* eslint-env mocha */
/* eslint-disable no-unused-vars, new-cap, max-len */
import {expect} from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import * as ro from 'reactive-observables';

import {allStates} from 'in-stores/store';

import {extractCoordinates, isIdEqual} from '../snapshots';


describe('stores.abstractSelectableSnapshotStore', () => {

  let snapshotConveyer;
  let store;

  let onNext;

  beforeEach(() => {
    onNext = sinon.stub();
    snapshotConveyer = ro.create();

    store = proxyquire('./abstractSelectableSnapshotStore', {
      '../snapshots': {
        getFullSnapshot: () => snapshotConveyer,
        isIdEqual
      }
    })();
  });

  afterEach(() => {
    Object.keys(allStates).forEach(name => delete allStates[name]);
  });

  it('should be null by default', () => {
    store.coordinates.subscribe(onNext);
    expect(onNext).to.have.callCount(1);
    expect(onNext).to.have.been.calledWith(null);
  });

  it('should immediately select coordinates', () => {
    const coords = snapshot(1);
    store.select(coords);
    store.coordinates.subscribe(onNext);
    expect(onNext).to.have.callCount(1);
    expect(onNext).to.have.been.calledWith(coords);
  });

  it('should retrieve the full snapshot when interested parties exist', () => {
    const coords = snapshot(1);
    store.select(coords);

    store.fullSnapshot.subscribe(onNext);
    expect(onNext).to.have.callCount(0);

    const fakeFullSnapshot = snapshot(2);
    snapshotConveyer.emit(fakeFullSnapshot);
    expect(onNext).to.have.callCount(1);
    expect(onNext).to.have.been.calledWith(fakeFullSnapshot);
  });

  it('should allow clearing of the store', () => {
    store.coordinates.subscribe(onNext);
    const coords = snapshot(1);
    store.select(coords);
    store.clear();
    expect(onNext).to.have.callCount(3);
    expect(onNext.getCall(0).args[0]).to.equal(null);
    expect(onNext.getCall(1).args[0]).to.equal(coords);
    expect(onNext.getCall(2).args[0]).to.equal(null);
  });

  function snapshot(id) {
    return extractCoordinates({
      steadyId: 's' + id,
      pluginId: 'p' + id,
      hostId: 'h' + id
    });
  }
});
