/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error will migrate in future commit
import ConnectionsServiceLocator from 'in-applications/FlowMap/serviceLocator/ConnectionsServiceLocator/ConnectionsServiceLocator';
// @ts-expect-error will migrate in future commit
import NodesServiceLocator from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/NodesServiceLocator';
import EventBusServiceLocator from 'in-applications/FlowMap/serviceLocator/EventBusServiceLocator/EventBusServiceLocator';
import SceneServiceLocator from 'in-applications/FlowMap/serviceLocator/SceneServiceLocator/SceneServiceLocator';

const locatorMap = new Map();

export function createNewServiceLocators(id: string) {
  locatorMap.set(id, {
    sceneServiceLocator: new SceneServiceLocator(),
    nodesServiceLocator: new NodesServiceLocator(),
    eventBusServiceLocator: new EventBusServiceLocator(),
    connectionsServiceLocator: new ConnectionsServiceLocator()
  });
}

export function getServiceLocators(id: string) {
  return locatorMap.get(id);
}

export function removeServiceLocators(id: string) {
  const locators = getServiceLocators(id);

  locators.sceneServiceLocator.dispose();
  locators.nodesServiceLocator.dispose();
  locators.eventBusServiceLocator.dispose();
  locators.connectionsServiceLocator.dispose();

  locatorMap.delete(id);
}
