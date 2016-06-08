/* eslint-env mocha, node */
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import THREE from 'three';
import sinon from 'sinon';

import CollisionObjectComponent from './CollisionObjectComponent';


describe('3D map', () => {
  let component;
  let sceneObject;
  let collisionObject;

  beforeEach(() => {
    sceneObject = {
      eventEmitter: new RoEmitter(),
      positionChanged: sinon.stub(),
      scene: {
        octrees: [
          {rebuild: sinon.stub()},
          {rebuild: sinon.stub()},
          {rebuild: sinon.stub()}
        ]
      },
      removeCollisionObject: sinon.stub(),
      addCollisionObject: sinon.stub(),
      renderScene: sinon.stub()
    };
    collisionObject = new THREE.Mesh(new THREE.BoxGeometry());
    component = new CollisionObjectComponent({
      sceneObject,
      collisionObject,
      layer: 1
    });
  });

  describe('CollisionObjectComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(sceneObject.addCollisionObject.callCount).to.equal(1);
    });

    it('dont call external method until time event was handled', () => {
      component.positionChanged({x: 1, y: 2, z: 3});
      component.sizeChanged({x: 4, y: 5, z: 6});
      expect(collisionObject.position.x).to.equal(0);
      expect(collisionObject.position.y).to.equal(0);
      expect(collisionObject.position.z).to.equal(0);

      component.handleComponentTimeEvent();
      expect(collisionObject.position.x).to.equal((1 - 0.5) + 4 / 2);
      expect(collisionObject.position.y).to.equal(2);
      expect(collisionObject.position.z).to.equal((3 + 0.5) - 6 / 2);
      expect(collisionObject.scale.x).to.equal(4);
      expect(collisionObject.scale.y).to.equal(5);
      expect(collisionObject.scale.z).to.equal(6);
    });

    it('should keep the old state on multiple updates of different properties', () => {
      component.positionChanged({x: 1, y: 2, z: 3});
      expect(collisionObject.position.x).to.equal(0);
      expect(collisionObject.position.y).to.equal(0);
      expect(collisionObject.position.z).to.equal(0);

      component.handleComponentTimeEvent();
      expect(collisionObject.position.x).to.equal(1);
      expect(collisionObject.position.y).to.equal(2);
      expect(collisionObject.position.z).to.equal(3);
      expect(collisionObject.scale.x).to.equal(1);
      expect(collisionObject.scale.y).to.equal(1);
      expect(collisionObject.scale.z).to.equal(1);

      component.sizeChanged({x: 4, y: 5, z: 6});
      component.handleComponentTimeEvent();
      expect(collisionObject.position.x).to.equal(1 - 0.5 + 4 / 2);
      expect(collisionObject.position.y).to.equal(2);
      expect(collisionObject.position.z).to.equal(3 + 0.5 - 6 / 2);
      expect(collisionObject.scale.x).to.equal(4);
      expect(collisionObject.scale.y).to.equal(5);
      expect(collisionObject.scale.z).to.equal(6);
    });

  });
});
