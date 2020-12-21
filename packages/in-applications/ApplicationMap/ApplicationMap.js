import { on } from '@instana/observables';
import RoEmitter from '@instana/roemitter';
import { get } from 'lodash';

import {
  getServiceLocators,
  createNewServiceLocators,
  removeServiceLocators
} from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import createSceneService from 'in-applications/ApplicationMap/serviceLocator/SceneServiceLocator/SceneService';
import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import OverlayReactComponentMounter from 'in-applications/ApplicationMap/misc/OverlayReactComponentMounter';
import getPowerFunctions from 'in-applications/ApplicationMap/misc/layouting/powerFunctions';
import SceneGraph from 'in-applications/ApplicationMap/SceneGraph/SceneGraph';
import Scene from 'in-applications/ApplicationMap/sceneObjects/Scene';
import { generateUniqueShortId } from 'in-services/util/id';
import Subscriber from 'in-map/misc/Subscriber';

export default class ApplicationMap {
  constructor({ canvas, overlayReactComponent, props }) {
    this.canvas = canvas;
    this.overlayReactComponent = overlayReactComponent;
    this.serviceLocatorUid = generateUniqueShortId();
    this.applicationId = props.applicationId;
    this.events$ = new RoEmitter('ApplicationMap');
    this.cursorCoordinates = { x: 0, y: 0 };

    this.initSceneGraph();
    this.initOverlayReactComponentMounter(props);
    this.initServiceLocator();
    this.sceneGraph.initSubscriptions();
    this.initScene();
    this.initSubscriptions();

    this.scene.startRendering();
  }

  initServiceLocator() {
    createNewServiceLocators(this.serviceLocatorUid);
  }

  initScene() {
    if (!this.scene) {
      this.scene = new Scene(this.serviceLocatorUid, this.canvas, this.overlayReactComponent);

      getServiceLocators(this.serviceLocatorUid).sceneServiceLocator.provide(createSceneService(this.scene));

      this.scene.init();
    }
  }

  initSceneGraph() {
    this.sceneGraph = new SceneGraph(this.serviceLocatorUid);
  }

  initOverlayReactComponentMounter(props) {
    this.overlayReactComponentMounter = new OverlayReactComponentMounter(
      this.overlayReactComponent,
      this.serviceLocatorUid,
      props
    );
  }

  setSize(width, height) {
    if (this.canvas.style.width === width && this.canvas.style.height === height) {
      return;
    }

    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(SIGNALS.RESIZE, { width, height });
  }

  initSubscriptions() {
    this.subscriber = new Subscriber();
    const eventBusServiceLocator = getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator;

    this.subscriber.addSubscriptions([
      // the GPU is a shared resource and as such there are times when it might be taken away from the app.
      // examples: another page does something that takes the GPU too long and the browser
      // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
      on(this.canvas, 'webglcontextlost').subscribe(event => {
        event.preventDefault();
        this.disposeSceneGraph();
        this.disposeScene();
      }),

      on(this.canvas, 'webglcontextrestored').subscribe(() => {
        // at the point that this method is called the browser has reset all state
        // to the default WebGL state and all previously allocated resources are invalid.
        // so you need to re-create textures, buffers, framebuffers, renderbuffers, shaders, programs
        // and setup your state (clearColor, blendFunc, depthFunc, etc...)
        // to make it short... recreate the scene
        this.initScene();
        this.initSceneGraph();
      }),

      on(this.overlayReactComponent, 'mousemove').subscribe(e => {
        e.preventDefault();
        this.setCursorPosition(e.offsetX, e.offsetY, eventBusServiceLocator);
      })
    ]);
  }

  setCursorPosition(x, y, eventBusServiceLocator) {
    this.cursorCoordinates.x = x;
    this.cursorCoordinates.y = y;
    eventBusServiceLocator.emit(SIGNALS.MOUSE_MOVE, this.cursorCoordinates);
  }

  updateState(oldProps, nextProps) {
    const oldState = get(oldProps, ['result', 'data']);
    let nextState = get(nextProps, ['result', 'data']);
    if (nextState && oldState !== nextState) {
      this.applyStateUpdate(nextState);
    }

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(SIGNALS.LAYOUTER, nextProps.layouter);
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(SIGNALS.PARTICLES, nextProps.particles);
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
      SIGNALS.SHOW_EXTERNAL_TRAFFIC,
      nextProps.traffic
    );
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
      SIGNALS.SIZING_METRIC,
      nextProps.sizingMetric
    );
  }

  applyStateUpdate(nextState) {
    const incomingConnectionsMap = this.connectionsAsMap(nextState.connections);
    this.sceneGraph.updateState(nextState, incomingConnectionsMap);

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
      SIGNALS.POWER_FUNCTIONS,
      getPowerFunctions(incomingConnectionsMap)
    );
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(SIGNALS.STATE_UPDATED, true);
  }

  connectionsAsMap(connections) {
    const incomingConnectionsMap = new Map();
    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];
      const id = connection.to;

      if (incomingConnectionsMap.has(id)) {
        incomingConnectionsMap.get(id).push(connection);
      } else {
        incomingConnectionsMap.set(id, [connection]);
      }
    }
    return incomingConnectionsMap;
  }

  disposeSceneGraph() {
    if (this.sceneGraph) {
      this.sceneGraph.dispose();
      this.sceneGraph = null;
    }
  }

  disposeScene() {
    if (this.scene) {
      getServiceLocators(this.serviceLocatorUid).sceneServiceLocator.provide(null);
      this.scene.dispose();
      this.scene = null;
    }
  }

  disposeServiceLocator() {
    removeServiceLocators(this.serviceLocatorUid);
    this.serviceLocatorUid = null;
  }

  disposeSubscriptions() {
    this.subscriber.dispose();
    this.subscriber = null;
  }

  disposeOverlayReactComponentMounter() {
    this.overlayReactComponentMounter.dispose();
    this.overlayReactComponentMounter = null;
  }

  dispose() {
    this.events$.dispose();
    this.events$ = null;

    this.disposeOverlayReactComponentMounter();
    this.disposeSubscriptions();
    this.disposeSceneGraph();
    this.disposeScene();
    this.disposeServiceLocator();
  }
}
