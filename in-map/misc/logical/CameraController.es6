import BaseCameraController from 'in-map/misc/common/CameraController';

import MouseControlsModule from 'in-map/misc/common/MouseControlsModule';
import TouchControlsModule from 'in-map/misc/common/TouchControlsModule';
import DragAndDropModule from 'in-map/misc/common/DragAndDropModule';
import RaycasterModule from 'in-map/misc/common/RaycasterModule';


export default function createCameraController(scene, map) {
  const controller = new BaseCameraController(scene, map);
  controller.init(-0.6);
  controller.initEvents();

  controller.addInteractionModule('mouse', MouseControlsModule);
  controller.addInteractionModule('touch', TouchControlsModule);
  controller.addInteractionModule('raycaster', RaycasterModule);
  controller.addInteractionModule('drag', DragAndDropModule);

  return controller;
}
