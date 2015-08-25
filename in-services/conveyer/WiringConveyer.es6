import * as connection from '../connection/subscriptionAwareConnection';
import {getIdString, extractCoordinates} from '../snapshots';

export default class WiringConveyer {

  static getUniqueId() {
    return 'wiring';
  }

  constructor() {
    this.id = connection.getSubscriptionId();

    this.subscribeEvent = {
      id: this.id,
      type: 'wiring',
      event: 'subscribe'
    };

    this.dataEventPredicate = e => e.id === this.id;
  }

  start(onNext) {
    this.onNext = onNext;

    this.subscription = connection.emitter.on('message')
      .filter(this.dataEventPredicate)
      .subscribe(e => {
        this.process(e.data[0]);
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.graph = this.nodes = this.edges = this.nodeOccurrenceCounter = this.nodeCache = null;

    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

  process(graphUpdate) {
    // a graph looks like this
    // {
    //   nodes: {
    //     <snapshotStringId>: Immutable{id, hostId, pluginId, steadyId}
    //   },
    //   edges: [
    //     {relation: String, source: snapshotStringId, target: snapshotStringId}
    //   ]
    // }
    if (!this.graph) {
      this.graph = {};
      this.nodes = this.graph.nodes = {};
      this.edges = this.graph.edges = [];

      // used to count the number of edges a node is involved in. Is used to remove a node from
      // the graph once it is involved in 0 edges. Basically reference counting to avoid leaking
      // node instances.
      this.nodeOccurrenceCounter = {};
    }

    // add new nodes to the graph and build up a mapping object so that we can
    // translate short IDs to long snapshot IDs
    const updateLocalNodeMapping = this.addNewNodes(graphUpdate);

    // add / remove edges
    graphUpdate.edges.forEach(edgeUpdate => {
      if (edgeUpdate.type === 'addition') {
        this.addEdge(edgeUpdate, updateLocalNodeMapping);
      } else {
        this.removeEdge(edgeUpdate, updateLocalNodeMapping);
      }
    });

    this.removeUnreferencedNodes();

    this.onNext(this.graph);
  }

  addNewNodes(graphUpdate) {
    // maps shortKeyInGraphUpdate => snapshotIdString
    const updateLocalNodeMapping = {};

    Object.keys(graphUpdate.nodes).map(shortKey => {
      const nodeUpdate = graphUpdate.nodes[shortKey];
      const idString = getIdString(nodeUpdate);

      updateLocalNodeMapping[shortKey] = idString;

      if (!(idString in this.nodes)) {
        const snapshotId = extractCoordinates(nodeUpdate);
        this.nodes[idString] = snapshotId;
        this.nodeOccurrenceCounter[idString] = 0;
      }
    });

    return updateLocalNodeMapping;
  }

  addEdge(edgeUpdate, updateLocalNodeMapping) {
    const source = updateLocalNodeMapping[edgeUpdate.source];
    const destination = updateLocalNodeMapping[edgeUpdate.destination];

    this.nodeOccurrenceCounter[source]++;
    this.nodeOccurrenceCounter[destination]++;

    const edge = {
      source,
      destination,
      relation: edgeUpdate.relation
    };
    this.edges.push(edge);
  }

  removeEdge(edgeUpdate, updateLocalNodeMapping) {
    const source = updateLocalNodeMapping[edgeUpdate.source];
    const destination = updateLocalNodeMapping[edgeUpdate.destination];

    this.nodeOccurrenceCounter[source]--;
    this.nodeOccurrenceCounter[destination]--;

    this.graph.edges = this.edges = this.edges.filter(edge => {
      return !(edge.source === source &&
        edge.destination === destination &&
        edge.relation === edgeUpdate.relation);
    });
  }

  removeUnreferencedNodes() {
    const nodesToRemove = Object.keys(this.nodeOccurrenceCounter)
      .filter(strId => this.nodeOccurrenceCounter[strId] <= 0);

    nodesToRemove.forEach(strId => {
      delete this.nodeOccurrenceCounter[strId];
      delete this.nodes[strId];
    });
  }
}
