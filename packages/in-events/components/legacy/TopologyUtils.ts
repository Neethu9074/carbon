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
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { getSparkChartGranularity } from 'in-applications/metrics';
import getMetrics from 'in-applications/subscriptions/getMetrics';
import { boundaryScopes } from 'in-applications/constants';

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

export function determineEntityTypeFromEntityIDMap(plugin: string) {
  if (plugin === 'application' || plugin === 'service') return { generic: plugin, actual: plugin };

  const pluginName = translateFullyQualifiedPluginToShortPluginName(plugin);

  if (pluginName === 'endpoint') return { generic: pluginName, actual: pluginName };

  return { generic: 'infrastructure', actual: plugin };
}

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
      relevantServicesToAdd.push(...infraServiceLabelInformation);
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

// This one works better for direct AP entities
export function getLegacyAPMetricsObservable({
  applicationId,
  endpointId,
  serviceId,
  timeConfig
}: GetMetricsObservableProps) {
  const granularity = getSparkChartGranularity(timeConfig);

  return getMetrics({
    filter: {
      application: applicationId,
      endpoint: endpointId,
      service: serviceId,
      timeConfig,
      applicationBoundaryScope: boundaryScopes.all,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
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
    if (result.data) {
      return result.data;
    }
    if (result.errors && result.errors.length > 0) {
      return {};
    }
    return null;
  });
}

const enabledSpecialCases = {
  connectUnspecifiedServiceToAP: true,
  addAPIfItDoesntExist: true,
  superServices: false
};

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

function filterOutRelationshipsThatContainNonExistentNodes(
  nodes: string[],
  relationships: ConnectionsMap[]
): ConnectionsMap[] {
  return relationships.filter(relationship => {
    if (!nodes.includes(relationship.from) || !nodes.includes(relationship.to)) return false;

    return true;
  });
}

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
