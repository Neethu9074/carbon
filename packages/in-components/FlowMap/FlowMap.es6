import { on } from 'reactive-observables';

import {
  getServiceLocators,
  createNewServiceLocators,
  removeServiceLocators
} from 'in-components/FlowMap/serviceLocator/serviceLocator';
import createConnectionService from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/ConnectionsService';
import createSceneService from 'in-components/FlowMap/serviceLocator/SceneServiceLocator/SceneService';
import OverlayReactComponentMounter from 'in-components/FlowMap/misc/OverlayReactComponentMounter';
import SceneGraph from 'in-components/FlowMap/SceneGraph/SceneGraph';
import Scene from 'in-components/FlowMap/sceneObjects/Scene';
import { generateUniqueShortId } from 'in-services/util/id';

export default class FlowMap {
  constructor(canvas, overlayReactComponent) {
    this.canvas = canvas;
    this.overlayReactComponent = overlayReactComponent;

    this.initServiceLocator();
    this.initScene();
    this.initSceneGraph();
    this.initOverlayReactComponentMounter();
    this.initSubscriptions();

    this.scene.startRendering();
  }

  initServiceLocator() {
    this.serviceLocatorUid = generateUniqueShortId();
    createNewServiceLocators(this.serviceLocatorUid);

    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.provide(
      createConnectionService(this.serviceLocatorUid)
    );
  }

  initScene() {
    if (!this.scene) {
      this.scene = new Scene(this.serviceLocatorUid, this.canvas, this.overlayReactComponent);

      getServiceLocators(this.serviceLocatorUid).sceneServiceLocator.provide(createSceneService(this.scene));

      this.scene.init();
    }
  }

  initSceneGraph() {
    this.sceneGraph = new SceneGraph(this.serviceLocatorUid, this.data);
  }

  initOverlayReactComponentMounter() {
    this.overlayReactComponentMounter = new OverlayReactComponentMounter(
      this.overlayReactComponent,
      this.serviceLocatorUid
    );
  }

  setSize(width, height) {
    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit('resize', { width, height });
  }

  initSubscriptions() {
    // the GPU is a shared resource and as such there are times when it might be taken away from the app.
    // examples: another page does something that takes the GPU too long and the browser
    // or the OS decides to reset the GPU to get control back. the event is called >>webglcontextlost<<
    this.contextLostSubscription = on(this.canvas, 'webglcontextlost').subscribe(event => {
      event.preventDefault();
      this.disposeSceneGraph();
      this.disposeScene();
    });

    this.contextRestoredSubscription = on(this.canvas, 'webglcontextrestored').subscribe(() => {
      // at the point that this method is called the browser has reset all state
      // to the default WebGL state and all previously allocated resources are invalid.
      // so you need to re-create textures, buffers, framebuffers, renderbuffers, shaders, programs
      // and setup your state (clearColor, blendFunc, depthFunc, etc...)
      // to make it short... recreate the scene
      this.initScene();
      this.initSceneGraph();
    });
  }

  disposeSubscriptions() {
    if (this.contextLostSubscription) {
      this.contextLostSubscription.dispose();
      this.contextLostSubscription = null;
    }
    if (this.contextRestoredSubscription) {
      this.contextRestoredSubscription.dispose();
      this.contextRestoredSubscription = null;
    }
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

  disposeOverlayReactComponentMounter() {
    this.overlayReactComponentMounter.dispose();
    this.overlayReactComponentMounter = null;
  }

  dispose() {
    this.disposeOverlayReactComponentMounter();
    this.disposeSubscriptions();
    this.disposeSceneGraph();
    this.disposeScene();
    this.disposeServiceLocator();
  }
}
