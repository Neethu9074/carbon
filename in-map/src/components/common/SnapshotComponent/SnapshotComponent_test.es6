/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';


describe('3D map', () => {
  let snapshotChanged;
  let subscription;
  let sceneObject;
  let getSnapshot;
  let component;

  beforeEach(() => {
    sceneObject = {
      eventEmitter: new RoEmitter()
    };

    getSnapshot = create();

    const SnapshotComponent = proxyquire('./SnapshotComponent', {
      'in-stores/snapshot': {
        getSnapshot: () => getSnapshot
      }
    }).default;

    component = new SnapshotComponent({sceneObject});
    snapshotChanged = sinon.stub();
    subscription = sceneObject.eventEmitter.on('snapshotChanged').subscribe(snapshotChanged);
  });

  afterEach(() => {
    subscription.dispose();
    subscription = null;

    component.dispose();
  });

  describe('SnapshotComponent', () => {
    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(component.snapshotToSet).to.equal(null);
    });

    it('can fire update events if snapshot was found', () => {
      expect(snapshotChanged).to.have.callCount(0);
      fireSnapshot();
      component.handleComponentTimeEvent();
      expect(snapshotChanged).to.have.callCount(1);
    });

    it('can suspent updated till it gets activated again', () => {
      expect(snapshotChanged).to.have.callCount(0);
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
      fireSnapshot();
      expect(snapshotChanged).to.have.callCount(0);
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
      component.handleComponentTimeEvent();
      expect(snapshotChanged).to.have.callCount(1);
    });
  });

  function fireSnapshot() {
    getSnapshot.emit(Immutable.fromJS({ id: 'foo' }));
  }
});
