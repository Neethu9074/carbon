import PathFinder from 'in-components/ServerFlowMap/PathFinder';
import { find } from 'in-services/arrayUtils';

export default class FlowMapState {
  constructor() {
    this.nodes = new Map();
    this.pathFinder = new PathFinder(this.nodes);
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

  addRootNode({ id, service, endpoint, applicationContext, metricValues }) {
    this.rootNodeId = id;
    this.applicationContext = applicationContext;
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

  addConnected(node, item, direction) {
    const contains = find(node[direction], _item => _item.nodeId === item.nodeId && _item.id === item.id);
    if (!contains) {
      node[direction].push(item);
      node.hasRelatedNodes[direction] = false;
    }
  }

  processResult(result, onError, onLoading, onResult, direction, path) {
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

    const nodes = this.mapResult(result, path, direction);
    const numRemainingNodes = Math.max(0, result.data.totalHits - result.data.page * result.data.pageSize);
    onResult(nodes, numRemainingNodes, result.data.page);
  }

  processServiceResult(nodeId, endpointId, result, direction, path) {
    const currentNodes = this.nodes;
    const node = currentNodes.get(nodeId);

    const onResult = (nodes, numRemainingNodes, cursor) => {
      node.isLoading[direction] = false;
      node.hasRelatedNodes[direction] = false;
      node.paginationInformation[direction] = { numRemainingNodes, cursor };
      for (let i = 0; i < nodes.length; i++) {
        const newNode = nodes[i];
        const serviceNode = currentNodes.has(newNode.id)
          ? currentNodes.get(newNode.id)
          : this.addNode(
              newNode.id,
              this.isWithinAppContext(newNode.applications) ? this.applicationContext : null,
              newNode.service,
              newNode.metrics
            );

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

    this.processResult(result, onError, onLoad, onResult, direction, path);
  }

  processEndpointResult(nodeId, endpointId, result, direction, path) {
    const currentNodes = this.nodes;
    const node = currentNodes.get(nodeId);

    const onResult = (children, numRemainingNodes, cursor) => {
      const child = node.children.get(endpointId);
      child.hasRelatedNodes[direction] = false;
      child.paginationInformation[direction] = { numRemainingNodes, cursor };

      for (let i = 0; i < children.length; i++) {
        const newChild = children[i];
        const serviceNode = currentNodes.has(newChild.id)
          ? currentNodes.get(newChild.id)
          : this.addNode(
              newChild.id,
              this.isWithinAppContext(newChild.applications) ? this.applicationContext : null,
              newChild.service,
              newChild.metrics
            );

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

    this.processResult(result, onError, onLoad, onResult, direction, path);
  }

  mapResult(result, path, direction) {
    return (result.data.items || []).filter(node => node.service.id).map(n => ({
      id: this.calculateUniqueIdForNode(n.service.id, path, direction),
      service: n.service,
      endpoint: n.endpoint,
      applications: n.applications,
      relatedNodesCount: n.relatedNodesCount,
      metrics: n.metrics
    }));
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
    hasRelatedNodes: {},
    paginationInformation: {}
  };
}
