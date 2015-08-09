/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */


import THREE from 'three';
import {expect} from 'chai';
import MeshFactory from './MeshFactory';


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
    factory = new MeshFactory({scene});
  });

  describe('mesh factory', () => {
    it('can be created', () => {
      expect(factory.vertexPos.length).to.equal(1); //one point
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
        .to.equal(3 * 1); //one point

      factory.addFragment({
        id: Math.random(),
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 2); //two points
    });

    it('should disable a fragment', () => {
      const id = Math.random();
      factory.addFragment({
        id,
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });

      factory.enableFragment(id, false);

      expect(factory.getFragment(id).enabled).to.equal(false);

      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 0); //one point
    });

    it('should enable a fragment', () => {
      const id = Math.random();
      factory.addFragment({
        id,
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });

      factory.enableFragment(id, false);

      expect(factory.getFragment(id).enabled).to.equal(false);

      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 0); //one point

      factory.enableFragment(id);

      expect(factory.getFragment(id).enabled).to.equal(true);

      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 1);
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
        .to.equal(3 * 1); //one point

      factory.removeFragment(id);
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 0);
    });

    it('should ignore disabled fragments', () => {
      const id = Math.random();
      factory.addFragment({
        id,
        pos: new THREE.Vector3(),
        dim: new THREE.Vector3()
      });
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 1); //one point

      factory.enableFragment(id, false);
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 0);

      factory.enableFragment(id);
      factory.rebuild();

      expect(factory.globalGeometry.attributes.position.array.length)
        .to.equal(3 * 1);
    });
  });
});
