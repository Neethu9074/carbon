import { combineLatest } from 'reactive-observables';

import { SIGNALS } from 'in-new-components/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { Vector3, Raycaster } from 'in-map/3DLibProvider';

export default function createHoveredConncetionsService(
  eventBusServiceLocator,
  connectionsServiceLocator,
  sceneServiceLocator
) {
  let screenSpaceCursorPosition = { x: 0, y: 0 };
  let screenHitPosition = new Vector3();
  let raycaster = new Raycaster();
  let result = {};
  raycaster.linePrecision = 0.3;

  let hoveredConnection$ = combineLatest([
    eventBusServiceLocator.on(SIGNALS.MOUSE_MOVE),
    connectionsServiceLocator.getConnections$()
  ])
    .debounce(50)
    .map(([{ x, y }, connections]) => {
      const camera = sceneServiceLocator.getScene().camera;
      if (!camera) {
        return null;
      }

      // transform into screen space
      screenSpaceCursorPosition.x = x / camera.width * 2 - 1;
      screenSpaceCursorPosition.y = -(y / camera.height) * 2 + 1;

      // update raycaster
      raycaster.setFromCamera(screenSpaceCursorPosition, camera.getRenderableCamera());

      const connectionsIterator = connections.values();
      for (const connection of connectionsIterator) {
        const hit = connection.intersects(raycaster);
        if (hit) {
          result.connection = connection;
          result.pointOfIntersection = hit.point;
          screenHitPosition.x = hit.point.x;
          screenHitPosition.y = hit.point.y;
          screenHitPosition.z = hit.point.z;
          screenHitPosition.applyMatrix4(camera.getRenderableCamera().projection);

          // transform back into device space
          screenHitPosition.x = (screenHitPosition.x * 0.5 + 0.5) * camera.width;
          screenHitPosition.y = (-screenHitPosition.y * 0.5 + 0.5) * camera.height;

          result.screenHitPosition = screenHitPosition;
          return result;
        }
      }

      return null;
    });

  function getHoveredConnection$() {
    return hoveredConnection$;
  }

  function dispose() {
    hoveredConnection$ = null;
    raycaster = null;
    screenSpaceCursorPosition = null;
    screenHitPosition = null;
  }

  return {
    getHoveredConnection$,
    dispose
  };
}
