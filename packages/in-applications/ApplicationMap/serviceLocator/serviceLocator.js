import HoveredConncetionsServiceLocator from 'in-applications/ApplicationMap/serviceLocator/HoveredConncetionsServiceLocator/HoveredConncetionsServiceLocator';
import HiddenEntitiesServiceLocator from 'in-applications/ApplicationMap/serviceLocator/HiddenEntitiesServiceLocator/HiddenEntitiesServiceLocator';
import ConnectionsServiceLocator from 'in-applications/ApplicationMap/serviceLocator/ConnectionsServiceLocator/ConnectionsServiceLocator';
import EventBusServiceLocator from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusServiceLocator';
import SceneServiceLocator from 'in-applications/ApplicationMap/serviceLocator/SceneServiceLocator/SceneServiceLocator';
import NodesServiceLocator from 'in-applications/ApplicationMap/serviceLocator/NodesServiceLocator/NodesServiceLocator';

const locatorMap = new Map();

export function createNewServiceLocators(id) {
  const locators = {
    sceneServiceLocator: new SceneServiceLocator(),
    nodesServiceLocator: new NodesServiceLocator(),
    eventBusServiceLocator: new EventBusServiceLocator(id)
  };
  locators.connectionsServiceLocator = new ConnectionsServiceLocator(id, locators.eventBusServiceLocator);
  locators.hiddenEntitiesServiceLocator = new HiddenEntitiesServiceLocator(
    locators.eventBusServiceLocator,
    locators.nodesServiceLocator,
    locators.connectionsServiceLocator
  );
  locators.hoveredConncetionsServiceLocator = new HoveredConncetionsServiceLocator(
    locators.eventBusServiceLocator,
    locators.connectionsServiceLocator,
    locators.sceneServiceLocator
  );
  locators.connectionsServiceLocator.initSubscriptions(locators.hiddenEntitiesServiceLocator);

  locatorMap.set(id, locators);
}

export function getServiceLocators(id) {
  return locatorMap.get(id);
}

export function removeServiceLocators(id) {
  const locators = getServiceLocators(id);

  locators.hiddenEntitiesServiceLocator.dispose();
  locators.sceneServiceLocator.dispose();
  locators.nodesServiceLocator.dispose();
  locators.eventBusServiceLocator.dispose();
  locators.connectionsServiceLocator.dispose();
  locators.hoveredConncetionsServiceLocator.dispose();

  locatorMap.delete(id);
}
