/* global require:false */
import { loadViveController } from 'in-map/services/webVR';
import { loadObject } from 'in-map/services/objectLoader';
import { MeshBasicMaterial } from 'in-map/3DLibProvider';
import { loadImage } from 'in-map/services/imageLoader';

export default function createViveController(wrapper, controls, id) {
  let forward = 0;
  let strife = 0;

  const ViveController = loadViveController();
  const rightHandController = new ViveController(id);
  rightHandController.standingMatrix = controls.getStandingMatrix();
  rightHandController.matrixAutoUpdate = true;
  wrapper.camTransformObject.add(rightHandController);

  rightHandController.addEventListener('menudown', wrapper.toggleMetrics);
  rightHandController.addEventListener('axischanged', onAxisChanged);

  // load huge files for vive controller async
  require([
    'in-map/misc/common/ViveController/vr_controller_vive_1_5.obj',
    'in-map/misc/common/ViveController/onepointfive_texture.png'
  ], (controllerObjectPath, controllerDiffuseMapPath) => {
    loadObject(controllerObjectPath, object => {
      if (!object) {
        return;
      }

      const controller = object.children[0];
      controller.material.dispose();
      controller.material = new MeshBasicMaterial({
        color: 0xffffff,
        map: loadImage(controllerDiffuseMapPath, tex => (tex.needsUpdate = true))
      });

      rightHandController.add(object.clone());
    });
  });

  function onAxisChanged(event) {
    if (rightHandController.getButtonState('thumbpad') === false) {
      forward = 0;
      strife = 0;
      return;
    }

    const x = event.axes[0];
    const y = event.axes[1];
    forward = y;
    strife = x;
  }

  function update() {
    rightHandController.update();
    wrapper.move(forward, strife);
  }

  return {
    update,
    dispose
  };

  function dispose() {
    rightHandController.removeEventListener('menudown');
    rightHandController.removeEventListener('axischanged');
  }
}
