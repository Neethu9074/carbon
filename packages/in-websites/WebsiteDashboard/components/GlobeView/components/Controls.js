/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Hammer from 'hammerjs';

import { onWheel } from 'in-services/util/reactiveMouseEvents';
import { getDeltaTime } from 'in-map/misc/time';
import { Vector3 } from 'in-map/3DLibProvider';

const RAD_2_DEG = Math.PI / 180;

export default function createControls(canvas, camera, props) {
  const {
    poi,
    cameraMoveSpeed = 4,
    startingZoomDistance = 1.5,
    maxZoomIn = 1,
    maxZoomOut = 2,
    zoomSpeed = 3,
    zoomSteps = 0.025
  } = props;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let targetZoomDistance = startingZoomDistance;

  let autoRotateEnabled = true;
  const autoRotatationSpeedPerSec = 10 * RAD_2_DEG;

  let pinchState = 0;
  const maxPinchInBothDirections = 6;
  const pinchPerClick = RAD_2_DEG * (120 / (maxPinchInBothDirections * 2));
  const rotatePerClick = RAD_2_DEG * 10;
  const up = new Vector3(0, 1, 0);
  const right = new Vector3(1, 0, 0);

  camera.translateZ(startingZoomDistance);

  const mouseWheelSubscription = onWheel(canvas, onMouseWheel);

  const eventHandler = new Hammer(canvas);

  // holds the mouse/touch position in pixel coordinates
  const cursor = { x: 0 };
  eventHandler.get('pan').set({
    direction: Hammer.DIRECTION_ALL,
    threshold: 5
  });
  eventHandler.on('panstart', e => {
    autoRotateEnabled = false;
    setCursorToEvent(e);
  });
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
    setCursorToEvent(event);

    targetRotationY -= dx * RAD_2_DEG;
  }

  function setCursorToEvent(event) {
    const pointer = event.pointers[0];
    cursor.x = pointer.clientX;
  }

  function onMouseWheel(event) {
    onZoom(event.scrollSpeed * event.scrollDirection);
  }

  function onZoom(delta) {
    targetZoomDistance += delta * zoomSteps;
    targetZoomDistance = Math.min(maxZoomOut, Math.max(maxZoomIn, targetZoomDistance));
  }

  function pinchUp() {
    if (pinchState <= -maxPinchInBothDirections) {
      return;
    }
    pinchState--;
    targetRotationX -= pinchPerClick;
  }

  function pinchDown() {
    if (pinchState >= maxPinchInBothDirections) {
      return;
    }
    pinchState++;
    targetRotationX += pinchPerClick;
  }

  function rotateLeft() {
    targetRotationY -= rotatePerClick;
  }

  function rotateRight() {
    targetRotationY += rotatePerClick;
  }

  function toggleAutoRotate() {
    autoRotateEnabled = !autoRotateEnabled;
  }

  function update() {
    const dt = getDeltaTime();

    if (autoRotateEnabled) {
      targetRotationY -= dt * autoRotatationSpeedPerSec;
    }

    const deltaX = (targetRotationX - currentRotationX) * dt * cameraMoveSpeed;
    const deltaY = (targetRotationY - currentRotationY) * dt * cameraMoveSpeed;
    const rotatedX = deltaX;
    const rotatedY = deltaY;

    poi.rotateOnWorldAxis(up, rotatedY);
    poi.rotateOnAxis(right, rotatedX);

    currentRotationX += rotatedX;
    currentRotationY += rotatedY;

    poi.updateMatrixWorld();

    const deltaZoomDistance = targetZoomDistance - camera.position.z;
    const newZPosition = camera.position.z + deltaZoomDistance * dt * zoomSpeed;
    camera.position.z = Math.min(maxZoomOut, Math.max(maxZoomIn, newZPosition));
  }

  // init pinch state
  pinchUp();
  pinchUp();
  pinchUp();

  return {
    dispose,
    update,
    pinchUp,
    pinchDown,
    rotateLeft,
    rotateRight,
    toggleAutoRotate
  };

  function dispose() {
    mouseWheelSubscription.dispose();
  }
}
