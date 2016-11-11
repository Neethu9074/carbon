import TouchControlsDecorator from 'in-map/misc/common/cameraController/decorator/TouchControlsDecorator';
import MouseControlsDecorator from 'in-map/misc/common/cameraController/decorator/MouseControlsDecorator';
import DragAndDropDecorator from 'in-map/misc/common/cameraController/decorator/DragAndDropDecorator';
import RayCasterDecorator from 'in-map/misc/common/cameraController/decorator/RayCasterDecorator';
import BasicCameraController from 'in-map/misc/common/cameraController/BasicCameraController';


export default function createCameraController(canvas, map) {
  return new DragAndDropDecorator(
           new TouchControlsDecorator(
             new RayCasterDecorator(
               new MouseControlsDecorator(
                 new BasicCameraController('nodes', 0),
                 canvas),
               map),
             canvas),
           canvas);
}
