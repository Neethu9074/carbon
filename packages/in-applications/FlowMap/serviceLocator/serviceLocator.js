import ConnectionsServiceLocator from 'in-applications/FlowMap/serviceLocator/ConnectionsServiceLocator/ConnectionsServiceLocator';
import EventBusServiceLocator from 'in-applications/FlowMap/serviceLocator/EventBusServiceLocator/EventBusServiceLocator';
import SceneServiceLocator from 'in-applications/FlowMap/serviceLocator/SceneServiceLocator/SceneServiceLocator';
import NodesServiceLocator from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/NodesServiceLocator';

const locatorMap = new Map();

export function createNewServiceLocators(id) {
  locatorMap.set(id, {
    sceneServiceLocator: new SceneServiceLocator(),
    nodesServiceLocator: new NodesServiceLocator(),
    eventBusServiceLocator: new EventBusServiceLocator(id),
    connectionsServiceLocator: new ConnectionsServiceLocator()
  });
}

export function getServiceLocators(id) {
  return locatorMap.get(id);
}

export function removeServiceLocators(id) {
  const locators = getServiceLocators(id);

  locators.sceneServiceLocator.dispose();
  locators.nodesServiceLocator.dispose();
  locators.eventBusServiceLocator.dispose();
  locators.connectionsServiceLocator.dispose();

  locatorMap.delete(id);
}
