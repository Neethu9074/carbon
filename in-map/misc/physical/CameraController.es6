import BaseCameraController from 'in-map/misc/common/CameraController';

import MouseControlsModule from 'in-map/misc/common/MouseControlsModule';
import TouchControlsModule from 'in-map/misc/common/TouchControlsModule';
import RaycasterModule from 'in-map/misc/common/RaycasterModule';


export default function createCameraController(scene, map) {
  const controller = new BaseCameraController(scene, map);
  controller.init(-0.8);
  controller.initEvents();

  controller.addInteractionModules([
    MouseControlsModule,
    TouchControlsModule,
    RaycasterModule
  ]);

  return controller;
}
