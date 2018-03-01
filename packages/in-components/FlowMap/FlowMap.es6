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
import Subscriber from 'in-map/misc/Subscriber';

export default class FlowMap {
  constructor({ canvas, overlayReactComponent, createDataFetchingService }) {
    this.canvas = canvas;
    this.overlayReactComponent = overlayReactComponent;
    this.serviceLocatorUid = generateUniqueShortId();

    this.initSceneGraph();
    this.initOverlayReactComponentMounter();
    this.initServiceLocator(createDataFetchingService);
    this.initScene();
    this.initSubscriptions();
    this.addRootNodeIfPresent();

    this.scene.startRendering();
  }

  initServiceLocator(createDataFetchingService) {
    createNewServiceLocators(this.serviceLocatorUid, this.sceneGraph);

    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.provide(
      createConnectionService(this.serviceLocatorUid)
    );

    if (createDataFetchingService) {
      getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.provide(createDataFetchingService());
    }
  }

  addRootNodeIfPresent() {
    const rootNodeData = getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.getRootNodeData();
    if (rootNodeData) {
      this.sceneGraph.addRootNode(rootNodeData);
      this.overlayReactComponentMounter.update(rootNodeData.service.id);
    }
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
    this.subscriber = new Subscriber();

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
      })
    ]);
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
    this.disposeOverlayReactComponentMounter();
    this.disposeSubscriptions();
    this.disposeSceneGraph();
    this.disposeScene();
    this.disposeServiceLocator();
  }
}
