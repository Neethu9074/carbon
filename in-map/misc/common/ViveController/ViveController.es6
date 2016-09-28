import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {toggleParticles} from 'in-map/stores/logical/particlesStore';
import {loadViveController} from 'in-map/services/webVR';
import {loadObject} from 'in-map/services/objectLoader';
import {loadImage} from 'in-map/services/imageLoader';
import {getDeltaTime} from 'in-map/misc/time';

import controllerObjectPath from 'in-map/misc/common/ViveController/vr_controller_vive_1_5.obj';

import controllerDiffuseMapPath from 'in-map/misc/common/ViveController/onepointfive_texture.png';
import controllerSpecularMapPath from 'in-map/misc/common/ViveController/onepointfive_spec.png';


export default function createViveController(wrapper, controls, id) {
  const moveSpeed = 3;
  let forward = 0;

  const ViveController = loadViveController();
  const rightHandController =  new ViveController(id);
  rightHandController.standingMatrix = controls.getStandingMatrix();
  rightHandController.matrixAutoUpdate = true;

  addSceneObject(rightHandController);

  rightHandController.addEventListener('triggerdown', () => forward = 1);
  rightHandController.addEventListener('triggerup', () => forward = 0);
  rightHandController.addEventListener('thumbpaddown', () => forward = -1);
  rightHandController.addEventListener('thumbpadup', () => forward = 0);
  rightHandController.addEventListener('menudown', toggleParticles);


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

    console.log('add controller obj', rightHandController);
    rightHandController.add(object.clone());
  });

  function update() {
    const dt = getDeltaTime();

    rightHandController.update();

    wrapper.moveForward(forward * dt * moveSpeed);
  }

  return {
    update,
    dispose
  };

  function dispose() {
    rightHandController.removeEventListener('triggerdown');
    rightHandController.removeEventListener('triggerup');
    rightHandController.removeEventListener('thumbpaddown');
    rightHandController.removeEventListener('thumbpadup');
    rightHandController.removeEventListener('menudown');

    removeSceneObject(rightHandController);
  }
}
