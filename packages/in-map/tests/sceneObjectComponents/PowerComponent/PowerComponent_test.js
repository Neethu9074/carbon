/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/PowerComponent', () => {
    let powerChanged;
    let powerChanged2;
    let sceneObject;
    let sceneObject2;
    let component;
    let component2;

    beforeEach(() => {
      powerChanged = sinon.stub();
      sceneObject = createSceneObject('id1');
      sceneObject.eventEmitter.on('powerChanged').subscribe(powerChanged);

      powerChanged2 = sinon.stub();
      sceneObject2 = createSceneObject('id2');
      sceneObject2.eventEmitter.on('powerChanged').subscribe(powerChanged2);

      const powerStore = proxyquire('in-map/stores/physical/powerStore', {
        'in-map/misc/TimingConfig': {
          POWER_CHECKING: 0
        }
      });

      const Component = proxyquire('in-map/sceneObjectComponents/PowerComponent/PowerComponent', {
        'in-map/stores/physical/powerStore': powerStore,
        'in-sdk/snapshot': {
          getPower: snapshot => {
            if (snapshot.get('id') === 'id1') {
              return 1;
            }
            return 2;
          }
        }
      }).default;

      component = new Component(sceneObject);
      component.initEvents();

      component2 = new Component(sceneObject2);
      component2.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();

      component2.disposeEvents();
      component2.dispose();
      sceneObject2.dispose();
    });

    it('should only calculate power when snapshot and maxPower are there', () => {
      expect(powerChanged).to.have.callCount(0);

      sceneObject.eventEmitter.emit('snapshotChanged', fromJS({ id: 'id1' }));
      expect(powerChanged).to.have.callCount(1);
    });

    it('should have max height since it is the only server', () => {
      sceneObject.eventEmitter.emit('snapshotChanged', fromJS({ id: 'id1' }));
      expect(powerChanged).to.have.callCount(1);
      expect(powerChanged.getCall(0).args[0]).to.equal(3);
    });

    it('should adjust powers when more nodes can in', () => {
      sceneObject.eventEmitter.emit('snapshotChanged', fromJS({ id: 'id1' }));
      expect(powerChanged).to.have.callCount(1);
      expect(powerChanged.getCall(0).args[0]).to.equal(3);

      sceneObject2.eventEmitter.emit('snapshotChanged', fromJS({ id: 'id2' }));
      expect(powerChanged).to.have.callCount(2);
      expect(powerChanged.getCall(1).args[0]).to.equal(2);
      expect(powerChanged2).to.have.callCount(1);
      expect(powerChanged2.getCall(0).args[0]).to.equal(3);
    });

    it('should adjust powers when nodes leave', () => {
      sceneObject.eventEmitter.emit('snapshotChanged', fromJS({ id: 'id1' }));
      expect(powerChanged).to.have.callCount(1);
      expect(powerChanged.getCall(0).args[0]).to.equal(3);

      sceneObject2.eventEmitter.emit('snapshotChanged', fromJS({ id: 'id2' }));
      expect(powerChanged).to.have.callCount(2);
      expect(powerChanged.getCall(1).args[0]).to.equal(2);
      expect(powerChanged2).to.have.callCount(1);
      expect(powerChanged2.getCall(0).args[0]).to.equal(3);

      component2.disposeEvents();
      expect(powerChanged).to.have.callCount(3);
      expect(powerChanged.getCall(2).args[0]).to.equal(3);
      expect(powerChanged2).to.have.callCount(1);
    });
  });
});
