/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { onWheel, onMove, onDown, onUp, onLeave } from 'in-services/util/reactiveMouseEvents';
import { Vector3, Object3D } from 'in-map/3DLibProvider';
import { getDeltaTime } from 'in-map/misc/time';

const RAD_2_DEG = Math.PI / 180;

export default function createControls(
  canvas,
  camera,
  {
    maxZoomIn = 0,
    maxZoomOut = 10000,
    startingWorldDistance = 300,
    startingZoomDistance = 30,
    cameraMoveSpeed = 10,
    zoomSteps = 1,
    zoomSpeed = 1
  }
) {
  const targetPosition = new Vector3(0, 0, 0);
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let targetZoomDistance = startingZoomDistance;

  const poi = new Object3D();
  poi.position.set(0, 0, startingWorldDistance);
  poi.add(camera);
  camera.translateZ(startingZoomDistance);

  let isPanning = false;

  const mouseLeaveSubscription = onLeave(canvas, onMouseLeave);
  const mouseWheelSubscription = onWheel(canvas, onMouseWheel);
  const mouseMoveSubscription = onMove(canvas, onMouseMove);
  const mouseDownSubscription = onDown(canvas, onMouseDown);
  const mouseUpSubscription = onUp(canvas, onMouseUp);

  function onMouseDown() {
    isPanning = true;
  }

  function onMouseUp() {
    isPanning = false;
  }

  function onMouseLeave() {
    isPanning = false;
  }

  function onMouseMove(event) {
    if (isPanning) {
      targetRotationX = currentRotationX;
      targetRotationY = currentRotationY;
      targetRotationX -= event.movementY * RAD_2_DEG;
      targetRotationY -= event.movementX * RAD_2_DEG;
    }
  }

  function onMouseWheel(event) {
    targetZoomDistance = camera.position.z;
    targetZoomDistance += event.scrollSpeed * event.scrollDirection * zoomSteps;
    targetZoomDistance = Math.min(maxZoomOut, Math.max(maxZoomIn, targetZoomDistance));
  }

  function update() {
    const dt = getDeltaTime();

    const direction = targetPosition.sub(poi.position);
    poi.position.add(direction.multiplyScalar(dt * cameraMoveSpeed));

    const deltaX = (targetRotationX - currentRotationX) * dt * cameraMoveSpeed;
    const deltaY = (targetRotationY - currentRotationY) * dt * cameraMoveSpeed;
    const rotatedX = deltaX;
    const rotatedY = deltaY;

    poi.rotateX(rotatedX);
    poi.rotateY(rotatedY);

    currentRotationX += rotatedX;
    currentRotationY += rotatedY;

    poi.updateMatrixWorld();

    const deltaZoomDistance = targetZoomDistance - camera.position.z;
    camera.translateZ(deltaZoomDistance * dt * zoomSpeed);
  }

  return {
    dispose,
    update,

    // export for testing purpose
    poi
  };

  function dispose() {
    mouseLeaveSubscription.dispose();
    mouseWheelSubscription.dispose();
    mouseDownSubscription.dispose();
    mouseMoveSubscription.dispose();
    mouseUpSubscription.dispose();
  }
}
