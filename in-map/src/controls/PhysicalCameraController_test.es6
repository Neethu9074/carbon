/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import THREE from 'three';


describe.only('3D map', () => {
  let scene;
  let map;
  let controller;

  const CameraController = proxyquire(
    './PhysicalCameraController', {
      './MouseControlsModule': class {},
      './TouchControlsModule': class {}
    }
  );

  beforeEach(() => {
    scene = {
      addSceneObject() {},
      onZoom() {},
      setCameraFromSize() {},
      renderScene() {}
    };
    map = {
      camera: {
        camera: new THREE.OrthographicCamera(1, -1, 1, -1, 0.1, 2000),
        updateMatrix: sinon.stub(),
        update: sinon.stub(),
        getPosition() {
          return this.camera.position;
        }
      }
    };
    controller = new CameraController({ scene, map });
  });

  describe('camera controller', () => {
    it('can be created', () => {
      expect(controller.scene).to.equal(scene);
    });

    it('should point to camera', () => {
      const inversePosition = map.camera.getPosition().multiplyScalar(1).normalize();

      expect(controller.directionToCam.x).to.equal(inversePosition.x);
      expect(controller.directionToCam.y).to.equal(inversePosition.y);
      expect(controller.directionToCam.z).to.equal(inversePosition.z);
    });

    it('should fly to object', () => {
      const object = new THREE.Object3D();
      const pos = controller.camTransformObject.position;

      object.position.copy(new THREE.Vector3(0.1, 30, -2));
      object.getComponent = () => { return { getPosition: () => object.position }; };
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
