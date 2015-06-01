/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three';
import {expect, assert} from 'chai';
import CubeFactory from './CubeFactory';


describe('3D map', () => {
  let scene;
  let factory;

  beforeEach(() => {
    scene = {
      addSceneObject() {},
      removeSceneObject() {},
      renderScene() {},
      on() {}
    };
    factory = new CubeFactory({scene});
  });

  describe('mesh factory', () => {
    it('can be created', () => {
      expect(factory.vertexPos.length).to.equal(18); //one point
      expect(factory.vertexPos[0].length).to.equal(3); //three parts x,y,z
    });
    it('should add a new fragment', () => {
      factory.addFragment({
        id: Math.random(),
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 18); //one cube

      factory.addFragment({
        id: Math.random(),
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(2 * 3 * 18); //two cubes
    });
    it('should remove a new fragment', () => {
      const id = Math.random();
      factory.addFragment({
        id,
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 18); //one point

      factory.removeFragment(id);
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 0);
    });
  });
});
