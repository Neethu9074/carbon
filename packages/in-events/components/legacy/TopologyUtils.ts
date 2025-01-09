/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';

import { generateUniqueShortId } from '@instana/utils';

import {
  Application,
  ContextGuideGroup,
  DomainSpecificStack,
  ExtendedService,
  Filter,
  Item,
  Nullish,
  ServiceMap,
  ServiceMapConnection,
  TagFilterExpressionElementUnion,
  TimeConfig
} from 'in-types';
import { RCAEntityDataType } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getSparkChartGranularity } from 'in-applications/metrics';

// four levels of nodes
export type RCA_TOPOLOGY_ENTITY_TYPE_TAGS =
  | 'application'
  | 'service'
  | 'endpoint'
  | 'infrastructure'
  | 'process'
  | 'superService';

export const NODE_LEVEL = {
  application: 0,
  service: 4,
  endpoint: 6,
  infrastructure: 8
} as { [key: string]: number };

// Used to denote special nodes on the topology
type SPECIAL_NODE = 'RCA' | 'TRIGGERING' | 'SPECIAL_RELATION' | 'ARTIFICIAL';

export type RCA_TOPOLOGY_TAGS = RCA_TOPOLOGY_ENTITY_TYPE_TAGS | SPECIAL_NODE;

export type RCA_TOPOLOGY_CONNECTION_TYPES = 'physical' | 'outgoing' | 'family';

export interface ConnectionsMap {
  from: string;
  to: string;
  connectionType: RCA_TOPOLOGY_CONNECTION_TYPES;
  metrics?: any;
  label?: string;
}

export interface nodeInfo {
  id: string;
  label: string;
  data: any;
  specialCaseVisibility: boolean;
  tags: Set<RCA_TOPOLOGY_TAGS>;
  entityType: RCA_TOPOLOGY_ENTITY_TYPE_TAGS;
  [index: string]: any;
}

export interface NodesMap {
  [index: string]: nodeInfo;
}

/**
 * Helper function mainly meant for triggering entities as there is an equivalent in rca utils.
 * Meant to give you a string containing a generic type ('infrastructure', 'application', 'endpoint', 'service') and an actual plugin type for infra entities
 *
 * @param plugin - string containing 'infrastructure', 'application', 'endpoint', 'service'
 * @returns {generic: string, actual: string}
 */

export function determineEntityTypeFromEntityIDMap(plugin: string) {
  if (plugin === 'application' || plugin === 'service') return { generic: plugin, actual: plugin };

  const pluginName = translateFullyQualifiedPluginToShortPluginName(plugin);

  if (pluginName === 'endpoint') return { generic: pluginName, actual: pluginName };

  return { generic: 'infrastructure', actual: plugin };
}

/**
 * All entities should have a stack query that occurs on them which contains what services they belong to.
 * This function is meant to extract the service infos from the stack
 *
 * @param entity - RCAEntityDataType from useFetchAppropriateRCAEntityData
 * @returns Item[] of services extracted from stack data
 */

export function extractServicesFromStackQuery(entity: RCAEntityDataType) {
  const { entityStackData, entityType } = entity;
  if (!entityStackData || !entityStackData.data) return undefined;

  if (entityType === 'service') return [entity.entityData as Item];

  const appData = entityStackData.data.application as DomainSpecificStack;

  if (appData && appData.groups && appData.groups.length > 0) {
    const serviceGroup = appData.groups.filter((appGroup: ContextGuideGroup) => appGroup.type === 'service');
    if (serviceGroup.length > 0) return serviceGroup[0].items;
  }
  return [];
}

/**
 * This is a filtering method meant to take in our ServiceMap and filter our services and connections that are not directly related to our RCA or TE
 *
 * @param applicationServiceMap - ServiceMap object containing {connections: ServiceMapConnection[], services: ExtendedService[]}
 * @param triggeringEntityServices - Item[] Services extracted from stack query (see extractServicesFromStackQuery above)
 * @param rootCauseServices - Set<string> of service IDs related to root causes
 * @returns ServiceMap of filtered services and connections
 */

export function getServiceToServiceConnections(
  applicationServiceMap: ServiceMap,
  triggeringEntityServices: Item[],
  rootCauseServices: Set<string>
) {
  const { connections, services } = applicationServiceMap;

  const triggeringEntityServiceIDs = triggeringEntityServices.map(service => service.id);
  const servicesThatWeCareAbout = [...rootCauseServices, ...triggeringEntityServiceIDs];

  let relevantServices = [] as string[];

  const filteredConnections = connections.filter(connection => {
    let relatedService;
    // if the connection.to is connected to a service we care about we include it
    if (connection.from && servicesThatWeCareAbout.includes(connection.from)) {
      relatedService = connection.to;
      // if the connection.from is connected to a servce we care about we include it
    } else if (connection.to && servicesThatWeCareAbout.includes(connection.to)) {
      relatedService = connection.from;
    }

    if (relatedService && !relevantServices.includes(relatedService)) relevantServices.push(relatedService);

    return relatedService !== undefined;
  });

  const filteredServices = services.filter(service => relevantServices.includes(service.id));

  const unknownService = services.find(val => val.id === 'UNKNOWN');

  // Technically a special case where RCA has no service specified
  if (
    !filteredServices.find(val => val.id === 'UNKNOWN') &&
    servicesThatWeCareAbout.includes('UNKNOWN') &&
    unknownService
  ) {
    filteredServices.push(unknownService);
  }

  return { connections: filteredConnections, services: filteredServices };
}

/**
 * This function builds our initial connections map based on the data of our root causes and TE and thier respective services and hierarchies (if appropriate).
 *
 * @param serviceToServiceConnections - ServiceMap of filtered connections and services
 * @param rootCausesInArray - RCAEntityDataType[] containing all of our RCA data obtained via useFetchAppropriateRCAEntityData
 * @param triggeringEntityData - RCAEntityDataType containing Triggering Entity data obtained via useFetchAppropriateRCAEntityData
 * @param triggeringEntityServices - Item[] containing TE service infromation obtained from stack query of TE
 * @param nodeFilters - string[] containing a list of all of our nodes to make sure that we can filter our connections later to only relevant connections
 * @returns ConnectionsMap[] containing all of our connections
 */
export function constructConnectionsMap(
  serviceToServiceConnections: { connections: ServiceMapConnection[]; services: ExtendedService[] },
  rootCausesInArray: RCAEntityDataType[],
  triggeringEntityData: RCAEntityDataType,
  triggeringEntityServices: Item[],
  nodeFilters?: string[]
): ConnectionsMap[] {
  const { connections: serviceToServiceConnectionMap } = serviceToServiceConnections;

  // Build service to service connections map
  const constructedConnections: ConnectionsMap[] = serviceToServiceConnectionMap.map(serviceIDs => {
    return {
      from: serviceIDs.from,
      to: serviceIDs.to,
      connectionType: 'outgoing',
      metrics: { latency: serviceIDs.latency, errorRate: serviceIDs.errorRate }
    } as ConnectionsMap;
  });

  // helper function to help determine if a connection already exists - to avoid duplicates
  const findIfConnectionAlreadyExists = (from: string, to: string): boolean => {
    let found = false;
    constructedConnections.forEach(connection => {
      if (connection.from === from && connection.to === to) found = true;
    });
    return found;
  };

  // Then go through each root cause and build familal connections between services (for now - TODO: add rest of infra family)
  rootCausesInArray.map(rootCause => {
    const {
      entityData,
      infraServiceLabelInformation,
      nonInfraServiceLabelInformation,
      entityStackData,
      entityType,
      hierarchySnapshots
    } = rootCause;

    let nodeLevel = NODE_LEVEL[entityType] || 100; // use node level to determine if node should go in from or to

    if (!entityData) return;
    let entityDataObject = entityData;

    if (Map.isMap(entityDataObject)) entityDataObject = entityDataObject.toJS();

    let relevantServicesToAdd = [];
    if (nonInfraServiceLabelInformation) {
      relevantServicesToAdd.push(nonInfraServiceLabelInformation);
    } else if (infraServiceLabelInformation && infraServiceLabelInformation.length > 0) {
      relevantServicesToAdd.push(...infraServiceLabelInformation);
    } else if (entityStackData?.data) {
      const rcaServices = extractServicesFromStackQuery(rootCause);
      if (rcaServices && rcaServices.length > 0) {
        relevantServicesToAdd.push(...rcaServices);
      } else {
        relevantServicesToAdd.push({ id: 'UNKNOWN' });
      }
    }

    let entityThatServiceShouldConnectTo = entityDataObject; // in the case of infra entities we need to connect the service to the top level infra entity

    if (entityType === 'infrastructure' && hierarchySnapshots && hierarchySnapshots.length > 0) {
      let firstInHierarchy = hierarchySnapshots[0];

      if (Map.isMap(hierarchySnapshots[0])) firstInHierarchy = hierarchySnapshots[0].toJS();

      if (firstInHierarchy.id !== entityDataObject.id) {
        entityThatServiceShouldConnectTo = firstInHierarchy;
      }
    }

    if (relevantServicesToAdd && relevantServicesToAdd.length > 0) {
      relevantServicesToAdd.forEach(relevantService => {
        let fromID, toID;
        if (nodeLevel > NODE_LEVEL.service) {
          fromID = relevantService.id;
          toID = entityThatServiceShouldConnectTo.id;
        } else {
          fromID = entityThatServiceShouldConnectTo.id;
          toID = relevantService.id;
        }

        constructedConnections.push({
          from: fromID,
          to: toID,
          connectionType: 'family'
        });
      });
    }

    if (entityType === 'infrastructure' && hierarchySnapshots && hierarchySnapshots.length > 0) {
      let prev = hierarchySnapshots[0];
      hierarchySnapshots.map(snapshot => {
        let data = snapshot;
        if (Map.isMap(data)) data = snapshot.toJS();

        if (data.id === prev.id) return;

        if (!findIfConnectionAlreadyExists(prev.id, data.id)) {
          constructedConnections.push({
            from: prev.id,
            to: data.id,
            connectionType: 'physical'
          });
        }
        prev = data;
      });
    }
  });

  const {
    entityData: triggeringEntitySnapshot,
    entityType: triggeringEntityType,
    hierarchySnapshots: triggeringEntityHierarchySnapshots
  } = triggeringEntityData;
  // Then go through triggering entity and build familial connections between services (for now - TODO: add rest of infra family)
  const triggeringNodeLevel = NODE_LEVEL[triggeringEntityType] ?? 100; // use node level to determine if node should go in from or to

  let triggeringEntityObject = triggeringEntitySnapshot;

  if (Map.isMap(triggeringEntityObject)) triggeringEntityObject = triggeringEntitySnapshot?.toJS();

  let entityThatServiceShouldConnectTo = triggeringEntityObject;

  if (
    triggeringEntityType === 'infrastructure' &&
    triggeringEntityHierarchySnapshots &&
    triggeringEntityHierarchySnapshots.length > 0 &&
    triggeringEntityObject
  ) {
    let firstInHierarchy = triggeringEntityHierarchySnapshots[0];

    if (Map.isMap(triggeringEntityHierarchySnapshots[0]))
      firstInHierarchy = triggeringEntityHierarchySnapshots[0].toJS();

    if (firstInHierarchy.id !== triggeringEntityObject.id && !nodeFilters?.includes(triggeringEntityObject.id)) {
      entityThatServiceShouldConnectTo = firstInHierarchy;
    }
  }
  // Add services from stack call
  triggeringEntityServices.map(serviceItem => {
    let fromID, toID;
    if (triggeringNodeLevel > NODE_LEVEL.service) {
      fromID = serviceItem.id;
      toID = entityThatServiceShouldConnectTo?.id;
    } else {
      fromID = entityThatServiceShouldConnectTo?.id;
      toID = serviceItem.id;
    }
    constructedConnections.push({
      from: fromID,
      to: toID,
      connectionType: 'family'
    });
  });

  return constructedConnections.filter(val => {
    const notIncludedInFilter = nodeFilters ? !nodeFilters.includes(val.from) || !nodeFilters.includes(val.to) : false;
    const fromAndToAreTheSame = val.from === val.to;
    if (notIncludedInFilter || fromAndToAreTheSame) {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * This method constructs our initial node map that contains all of our node entities in an object structure with the id of entity being the key and the value being
 * {id, data, specialCaseVisibility, entityType, tags}
 *
 * @param serviceToServiceConnections - ServiceMap of filtered connections and services from ServiceMap query call
 * @param rootCausesInArray - RCAEntityDataType[] containing all of our RCA data obtained via useFetchAppropriateRCAEntityData
 * @param triggeringEntityData - RCAEntityDataType containing Triggering Entity data obtained via useFetchAppropriateRCAEntityData
 * @param triggeringEntityServices - Item[] containing TE service infromation obtained from stack query of TE
 * @returns {NodesMap} Map of nodes in the format of {id, data, specialCaseVisibility, entityType, tags}[]
 */

export function constructNodesMap(
  serviceToServiceConnections: { connections: ServiceMapConnection[]; services: ExtendedService[] },
  rootCausesInArray: RCAEntityDataType[],
  triggeringEntityData: RCAEntityDataType,
  triggeringEntityServices: Item[]
): NodesMap {
  const { services } = serviceToServiceConnections;
  const {
    entityData: triggeringEntitySnapshot,
    entityType: triggeringEntityType,
    hierarchySnapshots: triggeringEntityHierarchySnapshots
  } = triggeringEntityData;
  const constructedNodes = {} as NodesMap;

  // helper function add stuff to nodes map
  const addValueToConstructedNode = (
    id: string,
    data: any,
    specialCaseVisibility: boolean,
    entityType: RCA_TOPOLOGY_ENTITY_TYPE_TAGS,
    tags: Set<RCA_TOPOLOGY_TAGS>
  ) => {
    const label = data && data.label ? data.label : '';
    constructedNodes[id] = {
      id,
      label,
      data,
      specialCaseVisibility,
      entityType,
      tags
    };
  };

  // First iterate through services in from app perspective service map
  if (triggeringEntityType !== 'service' && triggeringEntityType !== 'application') {
    services.map(service => {
      addValueToConstructedNode(service.id, service, true, 'service', new Set(['service']));
    });
  }

  // then we go through each root cause
  rootCausesInArray.map(rootCause => {
    const {
      entityData,
      entityType,
      infraServiceLabelInformation,
      nonInfraServiceLabelInformation,
      entityStackData,
      hierarchySnapshots
    } = rootCause;

    // get familial connection - aka service for now
    const relevantServicesToAdd = [];
    if (nonInfraServiceLabelInformation) {
      relevantServicesToAdd.push(nonInfraServiceLabelInformation);
    } else if (infraServiceLabelInformation && infraServiceLabelInformation.length > 0) {
      const filteredInfraServices = infraServiceLabelInformation.filter(service =>
        services.find(mapService => mapService.id === service.id)
      );
      relevantServicesToAdd.push(...filteredInfraServices);
    } else if (entityStackData.data) {
      const rcaServices = extractServicesFromStackQuery(rootCause);
      if (rcaServices && rcaServices.length > 0) {
        relevantServicesToAdd.push(...rcaServices);
      } else {
        const unspecifiedService = services.find(service => service.id === 'UNKNOWN');
        if (unspecifiedService) {
          relevantServicesToAdd.push(unspecifiedService);
        }
      }
    }

    if (!entityData) return;

    let entityDataObject = entityData;

    if (Map.isMap(entityDataObject)) entityDataObject = entityData.toJS();

    // first add RCA Node
    if (constructedNodes[entityDataObject.id]) {
      constructedNodes[entityDataObject.id].tags.add('RCA');
    } else {
      addValueToConstructedNode(
        entityDataObject.id,
        entityDataObject,
        true,
        entityType as RCA_TOPOLOGY_ENTITY_TYPE_TAGS,
        new Set(['RCA', entityType as RCA_TOPOLOGY_ENTITY_TYPE_TAGS])
      );
    }

    // then add service nodes
    if (relevantServicesToAdd.length > 0) {
      relevantServicesToAdd.forEach(relevantServiceToAdd => {
        if (constructedNodes[relevantServiceToAdd.id]) {
          constructedNodes[relevantServiceToAdd.id].tags.add('service');
          constructedNodes[relevantServiceToAdd.id].tags.add('SPECIAL_RELATION');
        } else {
          addValueToConstructedNode(
            relevantServiceToAdd.id,
            relevantServiceToAdd,
            true,
            'service',
            new Set(['service', 'SPECIAL_RELATION'])
          );
        }
      });
    }

    // then if infra add family

    if (entityType === 'infrastructure' && hierarchySnapshots && hierarchySnapshots.length > 0) {
      hierarchySnapshots.forEach(hierarchyEntity => {
        const entityObject = Map.isMap(hierarchyEntity) ? hierarchyEntity.toJS() : hierarchyEntity;
        if (constructedNodes[entityObject.id]) {
          constructedNodes[entityObject.id].tags.add('SPECIAL_RELATION');
        } else {
          addValueToConstructedNode(
            entityObject.id,
            entityObject,
            true,
            'infrastructure',
            new Set(['infrastructure', 'SPECIAL_RELATION'])
          );
        }
      });
    }
  });

  // then we go through triggering entity and its services

  if (triggeringEntitySnapshot) {
    let triggeringEntitySnapshotObject = triggeringEntitySnapshot;
    if (Map.isMap(triggeringEntitySnapshotObject))
      triggeringEntitySnapshotObject = triggeringEntitySnapshotObject.toJS();

    if (constructedNodes[triggeringEntitySnapshotObject.id]) {
      constructedNodes[triggeringEntitySnapshotObject.id].tags.add('TRIGGERING');
    } else {
      addValueToConstructedNode(
        triggeringEntitySnapshotObject.id,
        triggeringEntitySnapshotObject,
        true,
        triggeringEntityType as RCA_TOPOLOGY_ENTITY_TYPE_TAGS,
        new Set(['TRIGGERING', triggeringEntityType as RCA_TOPOLOGY_ENTITY_TYPE_TAGS])
      );
    }
  }

  // services
  if (triggeringEntityType !== 'service' && triggeringEntityType !== 'application') {
    triggeringEntityServices.map(service => {
      if (!constructedNodes[service.id]) {
        addValueToConstructedNode(service.id, service, true, 'service', new Set(['service']));
      }
    });
  }

  if (
    triggeringEntityType === 'infrastructure' &&
    triggeringEntityHierarchySnapshots &&
    triggeringEntityHierarchySnapshots.length > 0
  ) {
    triggeringEntityHierarchySnapshots.forEach(hierarchyEntity => {
      const entityObject = Map.isMap(hierarchyEntity) ? hierarchyEntity.toJS() : hierarchyEntity;
      if (constructedNodes[entityObject.id]) {
        constructedNodes[entityObject.id].tags.add('SPECIAL_RELATION');
      } else {
        addValueToConstructedNode(
          entityObject.id,
          entityObject,
          true,
          'infrastructure',
          new Set(['infrastructure', 'SPECIAL_RELATION'])
        );
      }
    });
  }

  return constructedNodes;
}

/**
 * This function is meant to create a filter for our getServiceMap query call in order to get the appropriate connections and services to start from and begin filtering.
 * Uses triggering entity and app id as a base filter. Adds triggering entity and RCA information to filter if they exist
 *
 * @todo Make separate queries with each entity type if app ID does not exist for more accurate results
 *
 * @param appID - string containing app perspective ID for incident
 * @param timeConfig - string of time window of incident
 * @param triggeringEntity - RCAEntityDataType of triggering entity
 * @param firstRCA - RCAEntityDataType of first RCA entity if it exists
 * @param secondRCA - RCAEntityDataType of second RCA entity if it exists
 * @param thirdRCA - RCAEntityDataType of third RCA entity if it exists
 * @returns Filter type for getServiceMap query call
 */

export function getFilterForServiceRelationships(
  appID: string | Nullish,
  timeConfig: TimeConfig,
  triggeringEntity: RCAEntityDataType,
  firstRCA?: RCAEntityDataType,
  secondRCA?: RCAEntityDataType,
  thirdRCA?: RCAEntityDataType
): Filter {
  const basicFilter: Filter = {
    includeInternalCalls: true,
    includeSyntheticCalls: true,
    useLongTermDataOnly: false,
    timeConfig
  };
  if (appID) {
    return {
      ...basicFilter,
      application: appID,
      applicationBoundaryScope: 'ALL'
    };
  }

  const chooseAppropriateEntity = () => {
    if (triggeringEntity.entityData) return triggeringEntity;
    if (firstRCA?.entityData) return firstRCA;
    if (secondRCA?.entityData) return secondRCA;
    if (thirdRCA?.entityData) return thirdRCA;
    return undefined;
  };

  const rcaEntityChoice = chooseAppropriateEntity();
  if (rcaEntityChoice && rcaEntityChoice.entityData) {
    return {
      ...basicFilter,
      endpoint: rcaEntityChoice.entityType === 'endpoint' ? rcaEntityChoice.entityData.id : undefined,
      service: rcaEntityChoice.entityType === 'service' ? rcaEntityChoice.entityData.id : undefined,
      label: rcaEntityChoice.entityType === 'infrastructure' ? rcaEntityChoice.entityData.get('label') : undefined
    };
  }
  // may god help us if we reach this point
  return basicFilter;
}

interface GetMetricsObservableProps {
  applicationId: string;
  endpointId: string | undefined;
  serviceId: string | undefined;
  timeConfig: TimeConfig;
}
/**
 * This is meant to create a request for the AP metrics around calls, errors and latency for a given entity
 *
 * This is better used by infra entities to get AP related metrics
 *
 * @param tagFilterExpression - Tag filter expression of an entity
 * @param timeConfig - TimeConfig of incident
 * @returns Observable containing request for AP metrics for an entity
 */
export function getAPMetricsObservable(tagFilterExpression: TagFilterExpressionElementUnion, timeConfig: TimeConfig) {
  const granularity = getSparkChartGranularity(timeConfig);

  return getApplicationMetrics({
    tagFilterExpression,
    includeInternal: false,
    includeSynthetic: false,
    timeConfig,
    timeShift: {
      offset: 0
    },
    metrics: {
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      }
    }
  }).map(result => {
    if (result.data) return result.data;

    if (result.errors && result.errors.length > 0) return {};

    return null;
  });
}

/**
 * Gets an observable containing a request for AP entities
 * @param {Object} AP - The AP entity that we're getting metrics for
 * @param {string} AP.applicationId - The AP ID for a given entity if it exists
 * @param {string} AP.endpointId - The endpoint ID for a given entity if it exists
 * @param {string} AP.serviceId - The service ID for a given entity if it exists
 * @returns Observable for a request for metrics for a given AP entity
 */
export function getLegacyAPMetricsObservable({
  applicationId,
  endpointId,
  serviceId,
  timeConfig
}: GetMetricsObservableProps) {
  const granularity = getSparkChartGranularity(timeConfig);
  var expressions = [];
  if (applicationId) {
    expressions.push(tagFilter('application.id', EQUALS, applicationId, null, DESTINATION));
  }
  if (serviceId) {
    expressions.push(tagFilter('service.id', EQUALS, serviceId, null, DESTINATION));
  }
  if (endpointId) {
    expressions.push(tagFilter('endpoint.id', EQUALS, endpointId, null, DESTINATION));
  }

  return getApplicationMetrics({
    tagFilterExpression: toBackendQueryModel(joinExpressions({ expressions })),
    includeInternal: false,
    includeSynthetic: false,
    timeShift: { offset: 0 },
    timeConfig,
    metrics: {
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      }
    }
  }).map(result => {
    if (result.data) {
      return result.data;
    }
    if (result.errors && result.errors.length > 0) {
      return {};
    }
    return null;
  });
}

// Special cases filter FF
const enabledSpecialCases = {
  connectUnspecifiedServiceToAP: true,
  addAPIfItDoesntExist: true,
  superServices: false
};

/**
 * Goes through our existing relationships and nodes and filters for some additional special uses cases such as having unspecified services, adding an AP node if it is non existent and combining multiple services into one node (super services)
 * @param nodes - NodesMap that has our initial nodes map that we created
 * @param relationships - ConnectionsMap[] that has all of our initial relationships that we created
 * @param relatedApplicationInformation - Application of our TE/RCAs
 * @returns {Object} A map containing our updated NodesMap and ConnectionsMap[] as {nodes: NodesMap, relationships: ConnectionsMap[]}
 */
export function specialCaseConnectionsAndNodes(
  nodes: NodesMap,
  relationships: ConnectionsMap[],
  relatedApplicationInformation: Application | Nullish
): { nodes: NodesMap; relationships: ConnectionsMap[] } {
  const nodeIDs = Object.keys(nodes);
  let nodesMapWithSpecialCases = nodes;
  let relationshipsWithSpecialCases = relationships;

  // Determine if AP already exists -- useful for multiple special cases
  let APNode = '';
  // Look for AP node
  nodeIDs.map(nodeID => {
    // We can skip this if found
    if (APNode) return;
    const node = nodes[nodeID];
    if (node && node.entityType && node.entityType === 'application') APNode = nodeID;
  });

  const unknownID = 'UNKNOWN';

  // CASE: Deal with the case that we have an unspecified service and an AP
  if (enabledSpecialCases.connectUnspecifiedServiceToAP) {
    if (nodeIDs.includes(unknownID) && APNode) {
      let alreadyHaveConnectionToAndFromAPToUnspecifiedService = false;

      // Look to see if connection already exists - redundancy
      relationships.map(relationship => {
        if (alreadyHaveConnectionToAndFromAPToUnspecifiedService) return;
        // could do it all in one line but prefer to be explicit
        if (relationship.from === APNode && relationship.to === unknownID) {
          alreadyHaveConnectionToAndFromAPToUnspecifiedService = true;
        } else if (relationship.from === unknownID && relationship.to === APNode) {
          alreadyHaveConnectionToAndFromAPToUnspecifiedService = true;
        }
      });

      // If connection doesn't exist, create it
      if (!alreadyHaveConnectionToAndFromAPToUnspecifiedService) {
        relationshipsWithSpecialCases.push({
          from: APNode,
          to: unknownID,
          connectionType: 'family'
        });
      }
    }
  }

  // CASE: If we do not have an AP in the topology then we should include it if we have the info
  if (enabledSpecialCases.addAPIfItDoesntExist) {
    if (!APNode && relatedApplicationInformation) {
      nodesMapWithSpecialCases[relatedApplicationInformation.id] = {
        id: relatedApplicationInformation.id,
        data: relatedApplicationInformation,
        entityType: 'application',
        label: relatedApplicationInformation.label,
        specialCaseVisibility: true,
        tags: new Set(['application'])
      };

      nodeIDs.map(nodeID => {
        const node = nodes[nodeID];
        if (node.entityType === 'service') {
          relationshipsWithSpecialCases.push({
            from: relatedApplicationInformation.id,
            to: nodeID,
            connectionType: 'family'
          });
        }
      });
    }
  }
  // CASE: We have infra entities on the topology and these infra entities have a bunch of services

  if (enabledSpecialCases.superServices) {
    // create super services
    let nodeToService = Map<string, string[]>(); // contains a map of nodeID: serviceID[] where serviceID[] will be services that are only connected to that node
    nodeIDs.forEach(nodeID => {
      const node = nodesMapWithSpecialCases[nodeID];

      // determine if service has connections to just one entity on graph

      if (node.entityType === 'service' && !node.tags.has('TRIGGERING') && !node.tags.has('RCA')) {
        //ignore RCA and triggering service nodes
        let connectionsTo = 0;
        let connectedToID;

        relationshipsWithSpecialCases.map(relationship => {
          if (connectionsTo > 1) return;
          if (relationship.from === node.id && relationship.connectionType === 'family') {
            connectionsTo += 1;
            connectedToID = relationship.to;
          }
        });

        if (connectionsTo === 1 && connectedToID) {
          if (nodeToService.has(connectedToID)) {
            nodeToService = nodeToService.set(connectedToID, [...nodeToService.get(connectedToID), nodeID]);
          } else {
            nodeToService = nodeToService.set(connectedToID, [nodeID]);
          }
        }
      }
    });

    // iterate through map of service --> node connections we built
    nodeToService.forEach((serviceIDs, nodeID) => {
      if (nodeID && serviceIDs && serviceIDs?.length > 1) {
        // if multiple services to node then build super service node
        const superServiceNodeID = generateUniqueShortId(); // generate ID
        const servicesInSuperService: nodeInfo[] = [];
        serviceIDs.forEach(serviceID => {
          const node = nodesMapWithSpecialCases[serviceID];
          servicesInSuperService.push(node);
          delete nodesMapWithSpecialCases[serviceID]; //remove service node from topology
        });
        const superServiceNode: nodeInfo = {
          id: superServiceNodeID,
          data: servicesInSuperService,
          label: `${servicesInSuperService.length} services`,
          specialCaseVisibility: true,
          tags: new Set(['ARTIFICIAL', 'superService']),
          entityType: 'superService'
        };
        nodesMapWithSpecialCases[superServiceNodeID] = superServiceNode;

        // Add familial connections
        if (relatedApplicationInformation) {
          relationshipsWithSpecialCases.push({
            from: relatedApplicationInformation.id,
            to: superServiceNodeID,
            connectionType: 'family'
          });
        }
        relationshipsWithSpecialCases.push({
          from: superServiceNodeID,
          to: nodeID,
          connectionType: 'family'
        });

        // Add outgoing connections
        const outgoingConnectionsToSuperService = new Set<string>();
        serviceIDs.forEach(serviceID => {
          const outgoing = getOutgoingConnectionsForGivenNode(serviceID, relationshipsWithSpecialCases);
          outgoing.forEach(ID => outgoingConnectionsToSuperService.add(ID));
        });

        outgoingConnectionsToSuperService.forEach(serviceID => {
          relationshipsWithSpecialCases.push({
            from: superServiceNodeID,
            to: serviceID,
            connectionType: 'outgoing'
          });
        });
      }
    });
  }
  // Okay now we need to iterate through RCA and triggering entity nodes in the case we have infra and we have a connection to the service directly
  nodeIDs.forEach(nodeID => {
    const node = nodesMapWithSpecialCases[nodeID];

    if (node && node.entityType === 'infrastructure' && (node.tags.has('RCA') || node.tags.has('TRIGGERING'))) {
      let connectionToAnotherInfraEntity = false;
      // Determine if RCA/Triggering is in the middle of the hierarchy
      relationshipsWithSpecialCases.map(relationship => {
        if (connectionToAnotherInfraEntity) return;
        const fromNodeID = relationship.from;
        const toNodeID = relationship.to;
        const fromNode = nodesMapWithSpecialCases[fromNodeID];

        if (toNodeID === nodeID && fromNode && fromNode.entityType === 'infrastructure')
          connectionToAnotherInfraEntity = true;
      });

      // if RCA/triggering is already in a hierarcy connected to a service then remove connection between entity to service
      if (connectionToAnotherInfraEntity) {
        relationshipsWithSpecialCases = relationshipsWithSpecialCases
          .map(relationship => {
            const fromNodeID = relationship.from;
            const toNodeID = relationship.to;
            const fromNode = nodesMapWithSpecialCases[fromNodeID];

            if (
              fromNode &&
              toNodeID === nodeID &&
              (fromNode.entityType === 'service' || fromNode.entityType === 'superService')
            ) {
              return null;
            } else {
              return relationship;
            }
          })
          .filter(val => val) as ConnectionsMap[];
      }
    }
  });

  // CASE: the stack call for an AP (if identified as a triggering entity) can prove to not be complete so we should make sure all of our services are hooked up
  // Spotted here in release-instana: eventId=ABWAVfVaQOOlWzDlWPGGBw
  nodeIDs.forEach(nodeID => {
    const node = nodesMapWithSpecialCases[nodeID];

    if (node && node.entityType === 'service') {
      let foundServiceConnection = relationshipsWithSpecialCases.find(relationship => {
        if (relationship.to === nodeID && relationship.from === APNode) {
          return true;
        }
        return false;
      });

      if (!foundServiceConnection) {
        relationshipsWithSpecialCases.push({
          from: APNode,
          to: nodeID,
          connectionType: 'family'
        });
      }
    }
  });

  // Remove nodes without a relationship
  filterNodesWithoutRelationships(nodesMapWithSpecialCases, relationshipsWithSpecialCases);
  // Remove services that only have a AP connection
  filterServicesThatDoNotHaveExternalConnections(nodesMapWithSpecialCases, relationshipsWithSpecialCases);

  return {
    nodes: nodesMapWithSpecialCases,
    relationships: filterOutRelationshipsThatContainNonExistentNodes(
      Object.keys(nodesMapWithSpecialCases),
      relationshipsWithSpecialCases
    )
  };
}

/**
 * Filters out relationships that contain nodes which do not exist in our nodes map
 *
 * @param nodes - string[] containing all IDs of our node map
 * @param relationships - ConnectionsMap[] relationships in our graph
 * @returns ConnectionsMap[] updated to remove all relationships with non-existent nodes
 */
function filterOutRelationshipsThatContainNonExistentNodes(
  nodes: string[],
  relationships: ConnectionsMap[]
): ConnectionsMap[] {
  return relationships.filter(relationship => {
    if (!nodes.includes(relationship.from) || !nodes.includes(relationship.to)) return false;

    return true;
  });
}

/**
 * Filters out nodes that do not have a relationship in our connections map
 *
 * @param nodes - NodesMap that contains all the nodes on our graph
 * @param relationships - ConnectionsMap[] containing all the relationships in our graph
 */
function filterNodesWithoutRelationships(nodes: NodesMap, relationships: ConnectionsMap[]) {
  const isInARelationship = (nodeID: string) => {
    let found = false;
    for (let i = 0; i < relationships.length; i++) {
      if (relationships[i].from === nodeID || relationships[i].to === nodeID) {
        found = true;
        break;
      }
    }
    return found;
  };

  Object.keys(nodes).map(nodeID => {
    if (!isInARelationship(nodeID)) {
      delete nodes[nodeID];
    }
  });
}

/**
 * Filters our services that do not have any connections except to AP on graph
 * Excluding TE and RCA entities of course
 *
 * @param nodes - NodesMap of all of our existing nodes
 * @param relationships - ConnectionsMap of all of our existing relationships in the graph
 */

function filterServicesThatDoNotHaveExternalConnections(nodes: NodesMap, relationships: ConnectionsMap[]) {
  const onlyAPConnection = (nodeID: string) => {
    let countWithoutAP = 0;
    relationships.map(relationship => {
      const fromNode = nodes[relationship.from];
      const toNode = nodes[relationship.to];

      if (
        relationship.to === nodeID &&
        fromNode &&
        fromNode.entityType !== 'application' &&
        relationship.connectionType !== 'outgoing'
      ) {
        countWithoutAP += 1;
      } else if (
        relationship.from === nodeID &&
        toNode &&
        toNode.entityType !== 'application' &&
        relationship.connectionType !== 'outgoing'
      ) {
        countWithoutAP += 1;
      }
    });

    return countWithoutAP === 0;
  };

  Object.keys(nodes).map(nodeID => {
    if (onlyAPConnection(nodeID) && !nodes[nodeID].tags.has('RCA') && !nodes[nodeID].tags.has('TRIGGERING')) {
      delete nodes[nodeID];
    }
  });
}

/**
 * Get all the ougoing connections for a given node ID based on our relationship map
 *
 * @param nodeID - string containing the ID of a node were searching for
 * @param relationships - ConnectionsMap[] of all the relationships in our graph
 * @returns string[] containing the IDs of all outgoing connections
 */
function getOutgoingConnectionsForGivenNode(nodeID: string, relationships: ConnectionsMap[]): string[] {
  const outgoingNodeConnections: string[] = [];

  relationships.map(relationship => {
    if (relationship.connectionType === 'outgoing') {
      if (relationship.from === nodeID) {
        outgoingNodeConnections.push(relationship.to);
      } else if (relationship.to === nodeID) {
        outgoingNodeConnections.push(relationship.from);
      }
    }
  });

  return outgoingNodeConnections;
}
