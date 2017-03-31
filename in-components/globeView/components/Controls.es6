import Hammer from 'hammerjs';

import { onWheel } from 'in-services/reactiveMouseEvents';
import { getDeltaTime } from 'in-map/misc/time';

const RAD_2_DEG = Math.PI / 180;

export default function createControls(
  canvas,
  camera,
  {
    poi,
    cameraMoveSpeed = 4,
    startingZoomDistance = 1.5,
    maxZoomIn = 1.1,
    maxZoomOut = 2,
    zoomSpeed = 3,
    zoomSteps = 0.025
  }
) {
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let targetZoomDistance = startingZoomDistance;

  camera.translateZ(startingZoomDistance);

  const mouseWheelSubscription = onWheel(canvas, onMouseWheel);

  const eventHandler = new Hammer(canvas);

  // holds the mouse/touch position in pixel coordinates
  const cursor = { x: 0, y: 0 };
  eventHandler.get('pan').set({
    direction: Hammer.DIRECTION_ALL,
    threshold: 15
  });
  eventHandler.on('panstart', e => setCursorToEvent(e));
  eventHandler.on('pan', onPan);

  eventHandler.get('pinch').set({ enable: true });
  eventHandler.on('pinchin', e => onPinch(e.distance));
  eventHandler.on('pinchout', e => onPinch(-1 * e.distance));

  let pinchDistance = 0;
  function onPinch(newDistance) {
    const oldDistance = pinchDistance;
    const delta = newDistance - oldDistance;
    pinchDistance = newDistance;

    onZoom(delta);
  }

  function onPan(event) {
    const pointer = event.pointers[0];
    const dx = 0.2 * (pointer.clientX - cursor.x);
    const dy = 0.2 * (pointer.clientY - cursor.y);
    setCursorToEvent(event);

    targetRotationX -= dy * RAD_2_DEG;
    targetRotationY -= dx * RAD_2_DEG;
  }

  function setCursorToEvent(event) {
    const pointer = event.pointers[0];
    cursor.x = pointer.clientX;
    cursor.y = pointer.clientY;
  }

  function onMouseWheel(event) {
    onZoom(event.scrollSpeed * event.scrollDirection);
  }

  function onZoom(delta) {
    targetZoomDistance += delta * zoomSteps;
    targetZoomDistance = Math.min(maxZoomOut, Math.max(maxZoomIn, targetZoomDistance));
  }

  function update() {
    const dt = getDeltaTime();

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
    const newZPosition = camera.position.z + deltaZoomDistance * dt * zoomSpeed;
    camera.position.z = Math.min(maxZoomOut, Math.max(maxZoomIn, newZPosition));
  }

  return {
    dispose,
    update
  };

  function dispose() {
    mouseWheelSubscription.dispose();
  }
}
