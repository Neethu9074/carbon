import { on } from 'reactive-observables';

import {
  getServiceLocators,
  createNewServiceLocators,
  removeServiceLocators
} from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import createConnectionService from 'in-applications/FlowMap/serviceLocator/ConnectionsServiceLocator/ConnectionsService';
import createSceneService from 'in-applications/FlowMap/serviceLocator/SceneServiceLocator/SceneService';
import OverlayReactComponentMounter from 'in-applications/FlowMap/misc/OverlayReactComponentMounter';
import { SIGNALS } from 'in-applications/FlowMap/components/Controls/Controls';
import SceneGraph from 'in-applications/FlowMap/SceneGraph/SceneGraph';
import Scene from 'in-applications/FlowMap/sceneObjects/Scene';
import { generateUniqueShortId } from 'in-services/util/id';
import { alwaysNull } from 'in-services/fixedStreams';
import Subscriber from 'in-map/misc/Subscriber';

export default class FlowMap {
  constructor({
    canvas,
    overlayReactComponent,
    expandNodeLeft,
    expandNodeRight,
    expandChildLeft,
    expandChildRight,
    loadMore
  }) {
    this.canvas = canvas;
    this.overlayReactComponent = overlayReactComponent;
    this.serviceLocatorUid = generateUniqueShortId();

    this.initSceneGraph();
    this.initOverlayReactComponentMounter(expandNodeLeft, expandNodeRight, expandChildLeft, expandChildRight, loadMore);
    this.initServiceLocator();
    this.initScene();
    this.initSubscriptions();

    this.scene.startRendering();
  }

  initServiceLocator() {
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
    this.sceneGraph = new SceneGraph(this.serviceLocatorUid);
  }

  initOverlayReactComponentMounter(expandNodeLeft, expandNodeRight, expandChildLeft, expandChildRight, loadMore) {
    this.overlayReactComponentMounter = new OverlayReactComponentMounter(
      this.overlayReactComponent,
      this.serviceLocatorUid,
      expandNodeLeft,
      expandNodeRight,
      expandChildLeft,
      expandChildRight,
      loadMore
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

    this.subscriber.addSubscription(
      getServiceLocators(this.serviceLocatorUid)
        .eventBusServiceLocator.on(SIGNALS.HEATMAP)
        .flatMap(metricUsedForColorCalculation => {
          if (metricUsedForColorCalculation) {
            return getServiceLocators(this.serviceLocatorUid)
              .nodesServiceLocator.getNodes()
              .stream.throttle(1000)
              .map(nodes => this.getMaxValueForColorCalculation(nodes, metricUsedForColorCalculation));
          } else {
            return alwaysNull;
          }
        })
        .subscribe(maxHeatMapMetricValue => {
          getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
            'maxHeatMapMetricValue',
            maxHeatMapMetricValue
          );
        })
    );
  }

  getMaxValueForColorCalculation(nodes, metricUsedForColorCalculation) {
    if (metricUsedForColorCalculation === 'errors') {
      return 1;
    }
    let maxValue = 0;
    nodes = nodes.values();
    for (const node of nodes) {
      if (node.children.size > 0) {
        const children = node.children.values();
        for (const child of children) {
          maxValue = Math.max(maxValue, child.getMetricValueOrDefault(metricUsedForColorCalculation, 0));
        }
      } else {
        maxValue = Math.max(maxValue, node.getMetricValueOrDefault(metricUsedForColorCalculation, 0));
      }
    }
    return maxValue;
  }

  updateState(nextFlowMapState) {
    this.sceneGraph.updateState(nextFlowMapState);

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
      'rootNodeId',
      nextFlowMapState.getRootNodeId()
    );

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
      'applicationContext',
      nextFlowMapState.getApplicationContext()
    );

    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(
      'applicationBoundaryScope',
      nextFlowMapState.getApplicationBoundaryScope()
    );
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
