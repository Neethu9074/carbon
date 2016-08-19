/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import THREE from 'three';

import {createSceneObject} from 'in-map/tests/sceneObjectComponents/helper';
import {collisionDetection} from 'in-map/misc/Physics';


describe('in-map', () => {
  describe('misc/time', () => {
    let component;
    let sceneObject;
    let addCollisionObject;
    let removeCollisionObject;

    beforeEach(() => {
      removeCollisionObject = sinon.stub();
      addCollisionObject = sinon.stub();
      sceneObject = createSceneObject();

      const Component = proxyquire('in-map/sceneObjectComponents/CollisionComponent/CollisionComponent', {
        'in-map/misc/Physics': {
          collisionDetection: {
            removeCollisionObject,
            addCollisionObject
          }
        }
      }).default;

      component = new Component(sceneObject,
                                collisionDetection.predefinedCollisionObjects.Box,
                                collisionDetection.OCTREE_LAYER.NODES);
      component.initEvents();
    });

    afterEach(() => {
      component.dispose();
      sceneObject.dispose();
    });

    it('should not add the collision geometry to physics by default', () => {
      expect(addCollisionObject).to.have.callCount(0);
    });

    it('should add the collision geometry to physics when position and scale are available', () => {
      expect(addCollisionObject).to.have.callCount(0);

      sceneObject.eventEmitter.emit('positionChanged', {x: 1, y: 0, z: 2});
      sceneObject.eventEmitter.emit('scaleChanged', {x: 1, y: 2, z: 1});

      expect(addCollisionObject).to.have.callCount(1);
      const mesh = addCollisionObject.getCall(0).args[0];
      expect(mesh instanceof THREE.Mesh).to.equal(true);
      expect(addCollisionObject.getCall(0).args[1]).to.equal(collisionDetection.OCTREE_LAYER.NODES);

      expect(mesh.position.x).to.equal(1);
      expect(mesh.position.y).to.equal(1);
      expect(mesh.position.z).to.equal(2);

      expect(mesh.scale.x).to.equal(1);
      expect(mesh.scale.y).to.equal(2);
      expect(mesh.scale.z).to.equal(1);
    });

    it('should refresh the collision mesh each time position or scale changes', () => {
      expect(addCollisionObject).to.have.callCount(0);

      sceneObject.eventEmitter.emit('positionChanged', {x: 1, y: 0, z: 2});
      sceneObject.eventEmitter.emit('scaleChanged', {x: 1, y: 2, z: 1});

      expect(addCollisionObject).to.have.callCount(1);

      sceneObject.eventEmitter.emit('positionChanged', {x: 1, y: 0, z: 2});
      expect(addCollisionObject).to.have.callCount(2);

      sceneObject.eventEmitter.emit('scaleChanged', {x: 1, y: 2, z: 1});
      expect(addCollisionObject).to.have.callCount(3);
    });
  });
});
