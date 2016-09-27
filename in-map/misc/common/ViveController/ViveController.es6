import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {loadViveController} from 'in-map/services/webVR';
import {loadObject} from 'in-map/services/objectLoader';
import {loadImage} from 'in-map/services/imageLoader';

import controllerObjectPath from 'in-map/misc/common/ViveController/vr_controller_vive_1_5.obj';

import controllerDiffuseMapPath from 'in-map/misc/common/ViveController/onepointfive_texture.png';
import controllerSpecularMapPath from 'in-map/misc/common/ViveController/onepointfive_spec.png';


export default function createViveController(controls, id) {

  const ViveController = loadViveController();
  const rightHandController =  new ViveController(id);
  rightHandController.standingMatrix = controls.getStandingMatrix();

  addSceneObject(rightHandController);

  loadObject(controllerObjectPath, object => {
    if (!object) {
      return;
    }

    const controller = object.children[0];

    controller.material.map = loadImage(
      controllerDiffuseMapPath,
      loadedTexture => loadedTexture.needsUpdate = true);
    controller.material.specularMap = loadImage(
      controllerSpecularMapPath,
      loadedTexture => loadedTexture.needsUpdate = true);

    rightHandController.add(object.clone());
  });

  function update() {
    rightHandController.update();
  }

  return {
    update,
    dispose
  };

  function dispose() {
    removeSceneObject(rightHandController);
  }
}
