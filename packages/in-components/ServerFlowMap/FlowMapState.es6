import PathFinder from 'in-components/ServerFlowMap/PathFinder';
import { find } from 'in-services/arrayUtils';

export default class FlowMapState {
  constructor() {
    this.nodes = new Map();
    this.pathFinder = new PathFinder(this.nodes);
  }

  addNode(id, data, metricValues) {
    const node = createNode(id, data, metricValues);
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

  addRootNode({ id, service, endpoint, metricValues }) {
    this.rootNodeId = id;
    this.pathFinder.setRootNodeId(id);

    const rootNode = this.addNode(id, service, metricValues);

    if (endpoint) {
      return this.addChild(rootNode, endpoint, metricValues);
    }
    return rootNode;
  }

  getRootNodeId() {
    return this.rootNodeId;
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
    onResult(nodes);
  }

  processServiceResult(nodeId, endpointId, result, direction, path) {
    const currentNodes = this.nodes;
    const node = currentNodes.get(nodeId);

    const onResult = nodes => {
      node.isLoading[direction] = false;
      node.hasRelatedNodes[direction] = false;
      for (let i = 0; i < nodes.length; i++) {
        const newNode = nodes[i];
        const serviceNode = currentNodes.has(newNode.id)
          ? currentNodes.get(newNode.id)
          : this.addNode(newNode.id, newNode.service, newNode.metrics);

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

    const onResult = children => {
      const child = node.children.get(endpointId);
      child.hasRelatedNodes[direction] = false;

      for (let i = 0; i < children.length; i++) {
        const newChild = children[i];
        const serviceNode = currentNodes.has(newChild.id)
          ? currentNodes.get(newChild.id)
          : this.addNode(newChild.id, newChild.service, newChild.metrics);

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
    return (result.data || []).filter(node => node.service.id).map(n => ({
      id: this.calculateUniqueIdForNode(n.service.id, path, direction),
      service: n.service,
      endpoint: n.endpoint,
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
}

function createNode(id, data, metricValues) {
  const newNode = createBasicNode(id, data, metricValues);
  newNode.__originalId = data ? data.id : id;
  newNode.children = new Map();
  return newNode;
}

function createChild(parentNode, endpoint, metricValues) {
  const newNode = createBasicNode(endpoint.id, endpoint, metricValues);
  newNode.nodeId = parentNode.id;
  return newNode;
}

function createBasicNode(id, data, metricValues) {
  return {
    id,
    data,
    metricValues,
    incoming: [],
    outgoing: [],
    errors: {},
    isLoading: {},
    hasRelatedNodes: {}
  };
}
