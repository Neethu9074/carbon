

import Immutable from 'immutable';

import * as connection from '../connection/subscriptionAwareConnection';
import {getIdString, extractId} from '../util/snapshots';

export default class WiringConveyer {

  static getUniqueId({pluginId}) {
    return pluginId;
  }

  constructor({pluginId}) {
    this.id = connection.getSubscriptionId();

    this.subscribeEvent = {
      id: this.id,
      type: 'wiring',
      event: 'subscribe',
      pluginId
    };

    this.dataEventPredicate = e => e.id === this.id;
  }

  start(onNext) {
    this.onNext = onNext;

    this.subscription = connection.emitter.on('message')
      .filter(this.dataEventPredicate)
      .subscribe(e => {
        if (this.graph) {
          this.processUpdate(e.data[0]);
        } else {
          this.processInitial(e.data[0]);
        }
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.graph = null;
    this.nodeCache = null;

    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

  processInitial(graph) {
    // snapshotId => ImmutableSet<SnapshotId>
    this.graph = Immutable.Map();

    // snapshotIdString => snapshotId
    //
    // TODO Who is responsible for clearing this node cache?
    // This is a memory leak, but it is one which can possibly be
    // ignored as it only exists as long as there is at least one
    // subscriber. Cleaning this nodeCache can be quite a costly
    // operation.
    this.nodeCache = {};

    const nodeMapping = this.buildUpNodeMapping(graph);
    this.processEdges(nodeMapping, graph);

    this.onNext(this.graph);
  }

  processUpdate(graph) {
    const nodeMapping = this.buildUpNodeMapping(graph);
    this.processEdges(nodeMapping, graph);
    this.onNext(this.graph);
  }

  /**
   * Add all nodes from this graph to the node cache. This is necessary
   * in order for the following logic to use the same. Additionally
   * creates an update-local node mapping from shortId to snapshot ID string
   *
   * @param {object} graph The graph as received from the backend
   * @returns {object} An update-local node mapping from short id to
   *   snapshot ID string.
   */
  buildUpNodeMapping(graph) {
    const nodeMapping = {};

    Object.keys(graph.nodes).forEach(shortId => {
      const wiringNode = graph.nodes[shortId];
      const idString = getIdString(wiringNode);
      nodeMapping[shortId] = idString;

      if (!(idString in this.nodeCache)) {
        this.nodeCache[idString] = extractId(wiringNode);
      }
    });

    return nodeMapping;
  }

  processEdges(nodeMapping, graphUpdate) {
    graphUpdate.edges.forEach(edge => {
      const sourceIdString = nodeMapping[edge.source];
      const source = this.nodeCache[sourceIdString];
      const destinationIdString = nodeMapping[edge.destination];
      const destination = this.nodeCache[destinationIdString];

      if (edge.type === 'addition') {
        this.addEdge(source, destination, edge.relation);
        this.addEdge(destination, source, edge.relation);
      } else {
        this.removeEdge(source, destination, edge.relation);
        this.removeEdge(destination, source, edge.relation);
      }
    });
  }

  addEdge(source, destination) {
    let edges = this.graph.get(source);
    if (!edges) {
      edges = Immutable.Set([destination]);
    } else {
      edges = edges.add(destination);
    }
    this.graph = this.graph.set(source, edges);
  }

  removeEdge(source, destination) {
    let edges = this.graph.get(source);
    if (edges) {
      edges = edges.remove(destination);
      if (edges.size === 0) {
        this.graph = this.graph.remove(source);
      } else {
        this.graph = this.graph.set(source, edges);
      }
    }
  }
}
