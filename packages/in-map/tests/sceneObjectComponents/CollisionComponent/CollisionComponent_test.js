/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { OCTREE_LAYER, PREDEFINED_COLLISION_OBJECTS } from 'in-map/misc/serviceLocator/physics/physicsConstants';
import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/CollisionComponent', () => {
    let component;
    let sceneObject;
    let addCollisionObject;
    let removeCollisionObject;
    let updateCollisionObject;

    beforeEach(() => {
      removeCollisionObject = sinon.stub();
      addCollisionObject = sinon.stub();
      updateCollisionObject = sinon.stub();
      sceneObject = createSceneObject();

      const Component = proxyquire('in-map/sceneObjectComponents/CollisionComponent/CollisionComponent', {
        'in-map/misc/serviceLocator/physics/PhysicsServiceLocator': {
          default: {
            removeCollisionObject,
            addCollisionObject,
            updateCollisionObject
          }
        }
      }).default;

      component = new Component(sceneObject, PREDEFINED_COLLISION_OBJECTS.BOX, OCTREE_LAYER.NODES);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should add the collision geometry to physics when position and scale are available', () => {
      expect(addCollisionObject).to.have.callCount(1);

      sceneObject.eventEmitter.emit('transformationChanged', {
        position: { x: 1, y: 0, z: 2 },
        scale: { x: 1, y: 2, z: 1 }
      });

      expect(updateCollisionObject).to.have.callCount(1);
      const mesh = updateCollisionObject.getCall(0).args[0];
      expect(updateCollisionObject.getCall(0).args[1]).to.equal(OCTREE_LAYER.NODES);

      expect(mesh.position.x).to.equal(1);
      expect(mesh.position.y).to.equal(1);
      expect(mesh.position.z).to.equal(2);

      expect(mesh.scale.x).to.equal(1);
      expect(mesh.scale.y).to.equal(2);
      expect(mesh.scale.z).to.equal(1);
    });

    it('should refresh the collision mesh each time position or scale changes', () => {
      expect(updateCollisionObject).to.have.callCount(0);

      sceneObject.eventEmitter.emit('transformationChanged', {
        position: { x: 1, y: 0, z: 2 },
        scale: { x: 1, y: 2, z: 1 }
      });
      expect(updateCollisionObject).to.have.callCount(1);

      sceneObject.eventEmitter.emit('transformationChanged', {
        position: { x: 1, y: 0, z: 2 },
        scale: { x: 1, y: 2, z: 1 }
      });
      expect(updateCollisionObject).to.have.callCount(2);
    });
  });
});
