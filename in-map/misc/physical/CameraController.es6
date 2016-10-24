import TouchControlsDecorator from 'in-map/misc/common/cameraController/decorator/TouchControlsDecorator';
import MouseControlsDecorator from 'in-map/misc/common/cameraController/decorator/MouseControlsDecorator';
import RayCasterDecorator from 'in-map/misc/common/cameraController/decorator/RayCasterDecorator';
import BasicCameraController from 'in-map/misc/common/cameraController/BasicCameraController';
import cameraZoomLevelStore from 'in-map/stores/physical/cameraZoomLevelStore';
import cameraPositionStore from 'in-map/stores/physical/cameraPositionStore';


export default function createCameraController(canvas, map) {
  return new TouchControlsDecorator(
           new RayCasterDecorator(
             new MouseControlsDecorator(
               new BasicCameraController('lines', cameraPositionStore),
               canvas,
               cameraZoomLevelStore),
             map),
            canvas);
}
