import RoEmitter from '@instana/roemitter';

export const SIGNALS = {
  UPDATE: 'update',
  PARTICLES: 'particles',
  LAYOUT: 'layout',
  LAYOUTER: 'layouter',
  IS_LAYOUTING: 'isLayouting',
  SHOW_EXTERNAL_TRAFFIC: 'showExternalTraffic',
  RESIZE: 'resize',
  CONNECTIONS: 'connections',
  CAMERA_UPDATE: 'cameraUpdate',
  WORLD_UNITS: 'worldUnits',
  STATE_UPDATED: 'stateUpdated',
  SEARCH: 'search',
  MOUSE_MOVE: 'mouseMove',
  CLICKED: 'clicked',
  SIZING_METRIC: 'sizingMetric',
  POWER_FUNCTIONS: 'power',
  BOUNDARY_SCOPE: 'boundaryScope'
};

export default function createEventBusService(id) {
  let eventEmitter = new RoEmitter(`global_event_bus:${id}`);

  function emit(msg, payload) {
    return eventEmitter.emit(msg, payload);
  }

  function on(msg) {
    return eventEmitter.on(msg);
  }

  function dispose() {
    eventEmitter.dispose();
    eventEmitter = null;
  }

  return {
    emit,
    on,
    dispose
  };
}
