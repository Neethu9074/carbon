/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three';
import {expect} from 'chai';
import CameraController from './cameraController';

describe('3D map', () => {
  let scene;
  let controller;

  beforeEach(() => {
    scene = {
      addSceneObject() {},
      onZoom() {},
      setCameraFromSize() {},
      renderScene() {},
      camera: {
        position: new THREE.Vector3(-1, 1, 1),
        updateMatrix() {}
      }
    };
    controller = new CameraController({scene});
  });

  describe('camera controller', () => {
    it('can be created', () => {
      expect(controller.scene).to.equal(scene);
    });

    it('should point to camera', () => {
      const inversePosition =
        scene.camera.position.multiplyScalar(1).normalize();

      expect(controller.directionToCam.x).to.equal(inversePosition.x);
      expect(controller.directionToCam.y).to.equal(inversePosition.y);
      expect(controller.directionToCam.z).to.equal(inversePosition.z);
    });

    it('should fly to object', () => {
      const object = new THREE.Object3D();
      const pos = controller.camTransformObject.position;

      object.position.copy(new THREE.Vector3(0.1, 30, -2));
      controller.flyToObject(object);

      expect(roundFloat(pos.x)).to.equal(0.1);
      expect(pos.y).to.equal(0);
      expect(pos.z).to.equal(-2);
    });

    it('should set zoomLevel correctly', () => {
      const min = controller.maxZoomOut;
      const max = controller.maxZoomIn;

      controller.setZoomLevel(-200);
      expect(controller.targetZoomLevel).to.equal(max);

      controller.setZoomLevel(100000);
      expect(controller.targetZoomLevel).to.equal(min);

      controller.setZoomLevel(100);
      expect(controller.targetZoomLevel).to.equal(100);
    });
  });

  function roundFloat(f) {
    return ((f * 1000) | 0) / 1000;
  }
});
