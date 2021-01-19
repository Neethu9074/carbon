/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PathFinder from 'in-applications/ServerFlowMap/PathFinder';
import { find } from 'in-services/arrayUtils';

const emptyChildrenMap = new Map();

export default class FlowMapState {
  constructor() {
    this.nodes = new Map();
    this.pathFinder = new PathFinder(this.nodes);
  }

  getNode(nodeConfig) {
    if (this.nodes.has(nodeConfig.id)) {
      return this.nodes.get(nodeConfig.id);
    }

    if (nodeConfig.isRemainingNodesPlaceHolder) {
      this.nodes.set(nodeConfig.id, nodeConfig);
      return nodeConfig;
    }

    return this.addNode(
      nodeConfig.id,
      this.isWithinAppContext(nodeConfig.applications) ? this.applicationContext : null,
      nodeConfig.service,
      nodeConfig.metrics
    );
  }

  addNode(id, applicationId, data, metricValues) {
    const node = createNode(id, applicationId, data, metricValues);
    this.nodes.set(node.id, node);
    return node;
  }

  addChild(node, endpoint, metrics) {
    if (node.children.has(endpoint.id)) {
      return node.children.get(endpoint.id);
    }

    const newChild = createChild(node, endpoint, metrics);
    node.children.set(newChild.id, newChild);

    return newChild;
  }

  addRootNode({ id, service, endpoint, applicationContext, applicationBoundaryScope, metricValues }) {
    this.rootNodeId = id;
    this.applicationContext = applicationContext;
    this.applicationBoundaryScope = applicationBoundaryScope;
    this.pathFinder.setRootNodeId(id);

    const rootNode = this.addNode(id, applicationContext, service, metricValues);

    if (endpoint) {
      return this.addChild(rootNode, endpoint, metricValues);
    }
    return rootNode;
  }

  getRootNodeId() {
    return this.rootNodeId;
  }

  getApplicationContext() {
    return this.applicationContext;
  }

  getApplicationBoundaryScope() {
    return this.applicationBoundaryScope;
  }

  addConnected(node, item, direction) {
    const contains = find(node[direction], _item => _item.nodeId === item.nodeId && _item.id === item.id);
    if (!contains) {
      node[direction].push(item);
      node.hasRelatedNodes[direction] = false;
    }
  }

  processResult(nodeId, endpointId, result, onError, onLoading, onResult, direction, path) {
    const hasErrors = result.errors.length > 0;
    onError(result.errors);
    if (hasErrors) {
      return;
    }

    const isLoading = result.progress.loading;
    onLoading(isLoading);
    if (isLoading) {
      return;
    }

    this.clearCurrentNodesFromDummies(nodeId, endpointId);

    const nodes = this.mapResult(result, path, direction);
    onResult(nodes);
  }

  mutateNodesWithPlaceHolderIfNecessary(node, endpointId, nodes, result, direction, createPlaceHolderNodeFunction) {
    const cursor = result.data.page;
    const numRemainingNodes = Math.max(0, result.data.totalHits - cursor * result.data.pageSize);
    if (numRemainingNodes > 0) {
      const placeholderNodeId = createRemainingPlaceholderId(node.id, endpointId);
      if (this.nodes.has(placeholderNodeId)) {
        this.nodes.get(placeholderNodeId).paginationInformation = {
          connectedNode: node,
          direction,
          numRemainingNodes,
          cursor
        };
        return;
      }
      const placeHolderNode = createPlaceHolderNodeFunction(node.id);
      placeHolderNode.paginationInformation = { connectedNode: node, direction, numRemainingNodes, cursor };
      nodes.push(placeHolderNode);
    }
  }

  processServiceResult(nodeId, endpointId, result, direction, path) {
    const node = this.nodes.get(nodeId);

    const onResult = nodes => {
      node.isLoading[direction] = false;
      node.hasRelatedNodes[direction] = false;

      this.mutateNodesWithPlaceHolderIfNecessary(node, endpointId, nodes, result, direction, createPlaceHolderNode);

      for (let i = 0; i < nodes.length; i++) {
        const newNode = nodes[i];
        const serviceNode = this.getNode(newNode);

        this.addConnected(node, serviceNode, direction);

        if (direction === 'incoming') {
          serviceNode.hasRelatedNodes.incoming = true;
          serviceNode.hasRelatedNodes.outgoing = false;
          if (newNode.relatedNodesCount === 0) {
            serviceNode.hasRelatedNodes.incoming = false;
          }
        } else {
          serviceNode.hasRelatedNodes.outgoing = true;
          serviceNode.hasRelatedNodes.incoming = false;
          if (newNode.relatedNodesCount === 0) {
            serviceNode.hasRelatedNodes.outgoing = false;
          }
        }
      }
    };

    const onError = errors => (node.errors[direction] = errors);
    const onLoad = isLoading => (node.isLoading[direction] = isLoading);

    this.processResult(node.id, null, result, onError, onLoad, onResult, direction, path);
  }

  processEndpointResult(nodeId, endpointId, result, direction, path) {
    const node = this.nodes.get(nodeId);

    const onResult = children => {
      const child = node.children.get(endpointId);
      child.hasRelatedNodes[direction] = false;

      this.mutateNodesWithPlaceHolderIfNecessary(
        node,
        endpointId,
        children,
        result,
        direction,
        createPlaceHolderNodeWithEndpoint
      );

      for (let i = 0; i < children.length; i++) {
        const newChild = children[i];
        const serviceNode = this.getNode(newChild);

        this.addConnected(node, serviceNode, direction);

        const newChildInstance = this.addChild(serviceNode, newChild.endpoint, newChild.metrics);

        if (direction === 'incoming') {
          serviceNode.hasRelatedNodes.outgoing = true;
          newChildInstance.hasRelatedNodes.incoming = true;
          newChildInstance.hasRelatedNodes.outgoing = false;
          if (newChild.relatedNodesCount === 0) {
            newChildInstance.hasRelatedNodes.incoming = false;
          }
        } else {
          serviceNode.hasRelatedNodes.incoming = true;
          newChildInstance.hasRelatedNodes.outgoing = true;
          newChildInstance.hasRelatedNodes.incoming = false;
          if (newChild.relatedNodesCount === 0) {
            newChildInstance.hasRelatedNodes.outgoing = false;
          }
        }

        this.addConnected(child, newChildInstance, direction);
      }
    };

    const onError = errors => {
      const child = node.children.get(endpointId);
      if (child) {
        child.errors[direction] = errors;
      }
    };

    const onLoad = isLoading => {
      const child = node.children.get(endpointId);
      if (child) {
        child.isLoading[direction] = isLoading;
      }
    };

    this.processResult(nodeId, endpointId, result, onError, onLoad, onResult, direction, path);
  }

  mapResult(result, path, direction) {
    return (result.data.items || [])
      .filter(node => node.service.id)
      .map(n => ({
        id: this.calculateUniqueIdForNode(n.service.id, path, direction),
        service: n.service,
        endpoint: n.endpoint,
        applications: n.applications,
        relatedNodesCount: n.relatedNodesCount,
        metrics: n.metrics
      }));
  }

  clearCurrentNodesFromDummies(nodeId) {
    const placeholderNodeId = createRemainingPlaceholderId(nodeId);
    const nodesIterator = this.nodes.values();
    for (const node of nodesIterator) {
      if (node.id === placeholderNodeId) {
        this.nodes.delete(node.id);
      }
    }
  }

  calculateUniqueIdForNode(id, previousNodesPath, direction) {
    let path;
    if (direction === 'incoming') {
      path = [id].concat(previousNodesPath);
    } else {
      path = previousNodesPath.concat([id]);
    }
    return path.join(direction === 'incoming' ? '<-' : '->');
  }

  isWithinAppContext(applications) {
    return (
      this.applicationContext &&
      applications &&
      applications.map(application => application.id).indexOf(this.applicationContext) >= 0
    );
  }
}

function createNode(id, applicationId, data, metricValues) {
  const newNode = createBasicNode(id, applicationId, data, metricValues);
  newNode.__originalId = data ? data.id : id;
  newNode.children = new Map();
  return newNode;
}

function createChild(parentNode, endpoint, metricValues) {
  const newNode = createBasicNode(endpoint.id, parentNode.applicationId, endpoint, metricValues);
  newNode.nodeId = parentNode.id;
  return newNode;
}

function createBasicNode(id, applicationId, data, metricValues) {
  return {
    id,
    applicationId,
    data,
    metricValues,
    incoming: [],
    outgoing: [],
    errors: {},
    isLoading: {},
    hasRelatedNodes: {}
  };
}

function createPlaceHolderNode(nodeId, endpointId) {
  const node = createBasicNode(createRemainingPlaceholderId(nodeId, endpointId));
  node.isRemainingNodesPlaceHolder = true;
  node.children = emptyChildrenMap;
  return node;
}

function createPlaceHolderNodeWithEndpoint(nodeId, endpointId) {
  const node = createPlaceHolderNode(nodeId);
  node.endpoint = {
    id: createPlaceHolderNode(endpointId)
  };
  return node;
}

function createRemainingPlaceholderId(id) {
  return `placeholder_${id}`;
}
