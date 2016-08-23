/* eslint-env mocha, node */
import {expect} from 'chai';
import {OrthographicCamera, Vector3} from 'three';

import CameraController from 'in-map/misc/common/CameraController';


describe('in-map', () => {
  let scene;
  let map;
  let controller;

  beforeEach(() => {
    const camera = new OrthographicCamera(1, -1, 1, -1, 0.1, 2000);
    scene = {
      camera: {
        getRenderableCamera: () => camera,
        getPosition: () => new Vector3(),
        update: () => {}
      }
    };
    map = {
    };
    controller = new CameraController(scene, map);
    controller.init();
    controller.initEvents();
  });

  describe('misc/common/CameraController', () => {
    it('can be created', () => {
      expect(controller.scene).to.equal(scene);
    });

    it('should fly to position', () => {
      const pos = controller.camTransformObject.position;

      const position = new Vector3(0.1, 30, -2);
      controller.flyToPosition(position);

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
