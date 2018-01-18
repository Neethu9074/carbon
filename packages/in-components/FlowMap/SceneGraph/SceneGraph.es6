import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import layout from 'in-components/FlowMap/misc/flowLayouting/flowLayouter';
import Connection from 'in-components/FlowMap/sceneObjects/Connection';
import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class SceneGraph {
  constructor(serviceLocatorUid, data) {
    this.serviceLocatorUid = serviceLocatorUid;
    this.data = data;

    // apply test data
    this.data = {
      object: {
        id: 'Shop',
        incoming: [
          { id: 'www.website.com' },
          {
            id: 'products',
            incoming: [{ id: 'eum 1' }, { id: 'eum 2' }]
          }
        ],
        outgoing: [
          {
            id: 'Web Service 1',
            outgoing: [{ id: 'Database' }]
          },
          { id: 'Web Service 2' },
          { id: 'Web Service 3' }
        ]
      }
    };

    this.nodesMap = new Map();
    this.connectionsMap = new Map();

    this.addNodeAndStructure(this.data.object);
    this.relayout();
  }

  addNodeAndStructure(node) {
    this.nodesMap.set(node.id, new Node(this.serviceLocatorUid, node));

    node.incoming = node.incoming || [];
    node.outgoing = node.outgoing || [];

    this.addConnectedNodes(node, 'incoming', this.createIncomingConnection.bind(this));
    this.addConnectedNodes(node, 'outgoing', this.createOutgoingConnection.bind(this));
  }

  addConnectedNodes(node, direction, createNode) {
    for (let i = 0; i < node[direction].length; i++) {
      const connectedNode = node[direction][i];
      this.addNodeAndStructure(connectedNode);

      const connection = createNode(node, connectedNode);
      this.connectionsMap.set(connection.id, connection);
    }
  }

  createIncomingConnection(node, other) {
    return new Connection(this.serviceLocatorUid, other, node);
  }

  createOutgoingConnection(node, other) {
    return new Connection(this.serviceLocatorUid, node, other);
  }

  relayout() {
    layout(this.data.object, this.nodesMap, this.connectionsMap);

    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.update();

    getServiceLocators(this.serviceLocatorUid)
      .sceneServiceLocator.getScene()
      .requestRendering();
  }

  disposeMap(map) {
    const items = map.values();
    for (const item of items) {
      item.dispose();
    }

    map.clear();
  }

  dispose() {
    this.disposeMap(this.connectionsMap);
    this.connectionsMap = null;

    this.disposeMap(this.nodesMap);
    this.nodesMap = null;

    this.serviceLocatorUid = null;
    this.data = null;
  }
}
