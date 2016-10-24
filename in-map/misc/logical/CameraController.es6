import TouchControlsDecorator from 'in-map/misc/common/cameraController/decorator/TouchControlsDecorator';
import MouseControlsDecorator from 'in-map/misc/common/cameraController/decorator/MouseControlsDecorator';
import DragAndDropDecorator from 'in-map/misc/common/cameraController/decorator/DragAndDropDecorator';
import RayCasterDecorator from 'in-map/misc/common/cameraController/decorator/RayCasterDecorator';
import BasicCameraController from 'in-map/misc/common/cameraController/BasicCameraController';
import cameraZoomLevelStore from 'in-map/stores/logical/cameraZoomLevelStore';
import cameraPositionStore from 'in-map/stores/logical/cameraPositionStore';


export default function createCameraController(canvas, map) {
  return new DragAndDropDecorator(
           new TouchControlsDecorator(
             new RayCasterDecorator(
               new MouseControlsDecorator(
                 new BasicCameraController('nodes', cameraPositionStore),
                 canvas,
                 cameraZoomLevelStore),
               map),
             canvas),
           canvas);
}
