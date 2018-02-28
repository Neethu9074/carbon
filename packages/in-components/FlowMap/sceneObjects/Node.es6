import { uniq } from 'lodash';
import { combineLatest } from 'reactive-observables';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';
import Child from 'in-components/FlowMap/sceneObjects/Child';
import Subscriber from 'in-map/misc/Subscriber';

// 0.1, because we want to give the calculation a bit of space (10%) until the screenposition is invalid
const leftBoundary = -0.1;
const rightBoundary = 1.1;
const topBoundary = -0.1;
const bottomBoundary = 1.1;

export default class Node extends SceneObject {
  constructor(serviceLocatorUid, id, metricValues) {
    super(id, serviceLocatorUid);

    this.outgoing = [];
    this.incoming = [];
    this.initSubscriptions(metricValues);
    this.screenPosition = null;
    this.children = new Map();

    this.events$.emit('isExpanded_incoming', false);
    this.events$.emit('isExpanded_outgoing', false);

    if (metricValues) {
      this.events$.emit('metricValues', metricValues);
    }
  }

  initSubscriptions(metricValues) {
    this.subscriber = new Subscriber();
    this.subscriber.addSubscription(
      combineLatest([
        getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.on('cameraUpdate'),
        this.events$.on('transform')
      ]).subscribe(() => this.updateScreenPosition())
    );

    if (!metricValues) {
      this.subscriber.addSubscription(
        getServiceLocators(this.serviceLocatorUid)
          .dataFetchingServiceLocator.fetchMetricsForNodeId(this.id)
          .map(result => {
            if (!result.progress.loading) {
              return result.data;
            }
            return null;
          })
          .subscribe(metrics => {
            this.events$.emit('metricValues', metrics || null);
          })
      );
    }
  }

  updateScreenPosition() {
    const sceneServiceLocator = getServiceLocators(this.serviceLocatorUid).sceneServiceLocator;
    const scene = sceneServiceLocator.getScene();

    const screenPosition = this.position.clone();
    screenPosition.applyMatrix4(scene.camera.getRenderableCamera().projection);

    screenPosition.x = (screenPosition.x + 1) / 2;
    screenPosition.y = -(screenPosition.y - 1) / 2;

    if (
      screenPosition.x > leftBoundary &&
      screenPosition.x < rightBoundary &&
      screenPosition.y > topBoundary &&
      screenPosition.y < bottomBoundary
    ) {
      screenPosition.x *= scene.camera.width;
      screenPosition.y *= scene.camera.height;
      this.events$.emit('screenPosition', screenPosition);
      this.screenPosition = screenPosition;
    } else {
      if (this.screenPosition != null) {
        this.screenPosition = null;
        this.events$.emit('screenPosition', null);
      }
    }
  }

  setData(data) {
    this.events$.emit('data', data);
  }

  addChild(child) {
    if (this.children.has(child.id)) {
      return this.children.get(child.id);
    }

    const newChild = new Child(this.serviceLocatorUid, this.id, this.__originalId, child.id);
    newChild.setData(child);

    this.children.set(child.id, newChild);
    this.events$.emit('children', this.children);

    return newChild;
  }

  setIsLoadingData(isLoading, direction) {
    this.events$.emit(`isLoadingData_${direction}`, isLoading);
  }

  setIsExpanded(isIncomingExpanded, direction) {
    this.events$.emit(`isExpanded_${direction}`, isIncomingExpanded);
  }

  addConnected(ids, direction) {
    this[direction] = uniq(this[direction].concat(ids));
    this.setIsExpanded(true, direction);
  }

  setErrorsInDirection(errors = [], direction) {
    if (errors.length > 0) {
      this.resetConnected(direction);
    }
    this.setIsLoadingData(false, direction);
    this.events$.emit(`errors_${direction}`, errors);
  }

  resetConnected(direction) {
    this[direction] = [];
    this.setIsExpanded(false, direction);
  }

  expandRight() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.fetchOutgoingDataForNodeId(this.id);
  }

  expandLeft() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.fetchIncomingDataForNodeId(this.id);
  }

  disposeSubscriptions() {
    const dataFetchingServiceLocator = getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator;
    dataFetchingServiceLocator.disposeOpenDataSubscriptionsForNodeId(this.id);

    this.subscriber.dispose();
    this.subscriber = null;
  }

  dispose() {
    this.outgoing = null;
    this.incoming = null;

    this.disposeSubscriptions();

    const serviceLocators = getServiceLocators(this.serviceLocatorUid);
    serviceLocators.nodesServiceLocator.removeNode(this.id, this);

    super.dispose();
  }
}
