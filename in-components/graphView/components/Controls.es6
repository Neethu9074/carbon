import THREE from 'three';

import {onWheel, onMove, onDown, onUp, onLeave} from 'in-services/reactiveMouseEvents';
import * as time from 'in-map/src/timeCalculations';


const RAD2DEG = Math.PI / 180;

export default function createControls(canvas, camera, {
  startingWorldDistance = 300,
  startingZoomDistance = 30,
  cameraMoveSpeed = 10,
  pixelToAngleRation = 1 * RAD2DEG // 10 pixels = 1 degree
}) {

  const targetPosition = new THREE.Vector3(0, 0, 0);
  let targetRotationX = 0;
  let targetRotationY = 0;
  let targetZoomDistance = startingZoomDistance;

  const poi = new THREE.Object3D();
  poi.position.set(0, 0, startingWorldDistance);
  poi.add(camera);
  camera.translateZ(30);

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
      targetRotationX = poi.rotation.y;
      targetRotationY = poi.rotation.y;
      targetRotationX -= event.movementX * pixelToAngleRation;
      targetRotationY -= event.movementY * pixelToAngleRation;
    }
  }

  function onMouseWheel(event) {
    targetZoomDistance = camera.position.z;
    targetZoomDistance += event.scrollSpeed * event.scrollDirection;
    targetZoomDistance = Math.max(0, targetZoomDistance);
  }

  function update() {
    const dt = time.getDeltaTime();

    const direction = targetPosition.sub(poi.position).normalize();
    poi.position.add(direction.clone().multiplyScalar(dt * cameraMoveSpeed));

    poi.rotation.y += (targetRotationX - poi.rotation.y) * dt * 10;
    poi.updateMatrixWorld();

    const deltaZoomDistance = targetZoomDistance - camera.position.z;
    camera.translateZ(deltaZoomDistance * dt * cameraMoveSpeed);
    camera.updateMatrixWorld();
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
