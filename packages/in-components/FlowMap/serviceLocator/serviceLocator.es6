import DataFetchingServiceLocator from 'in-components/FlowMap/serviceLocator/DataFetchingServiceLocator/DataFetchingServiceLocator';
import ConnectionsServiceLocator from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/ConnectionsServiceLocator';
import EventBusServiceLocator from 'in-components/FlowMap/serviceLocator/EventBusServiceLocator/EventBusServiceLocator';
import SceneServiceLocator from 'in-components/FlowMap/serviceLocator/SceneServiceLocator/SceneServiceLocator';
import NodesServiceLocator from 'in-components/FlowMap/serviceLocator/NodesServiceLocator/NodesServiceLocator';

const locatorMap = new Map();

export function createNewServiceLocators(id) {
  locatorMap.set(id, {
    sceneServiceLocator: new SceneServiceLocator(),
    nodesServiceLocator: new NodesServiceLocator(),
    eventBusServiceLocator: new EventBusServiceLocator(id),
    connectionsServiceLocator: new ConnectionsServiceLocator(),
    dataFetchingServiceLocator: new DataFetchingServiceLocator()
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
  locators.dataFetchingServiceLocator.dispose();

  locatorMap.delete(id);
}
