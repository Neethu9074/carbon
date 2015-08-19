/* eslint-env mocha*/

// import Immutable from 'immutable';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';

import {getIdString} from '../util/snapshots';

describe('conveyer.WiringConveyer', () => {

  let WiringConveyer;
  let conveyer;
  let onNext;
  let connection;

  beforeEach(() => {
    onNext = sinon.stub();

    connection = {
      emitter: new RoEmitter(),
      send: sinon.stub(),
      subscribe: sinon.stub(),
      unsubscribe: sinon.stub(),
      __esModule: true
    };
    WiringConveyer = proxyquire('./WiringConveyer', {
      '../connection/subscriptionAwareConnection': connection
    });
  });

  it('should calculate unique id', () => {
    expect(WiringConveyer.getUniqueId()).to.equal('wiring');
  });

  it('should subscribe via WebSocket connection', () => {
    conveyer = new WiringConveyer();
    conveyer.start(onNext);
    expect(connection.subscribe.calledOnce).to.equal(true);
    expect(connection.subscribe.getCall(0).args[0]).to.equal(conveyer.id);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      id: conveyer.id,
      event: 'subscribe',
      type: 'wiring'
    });
  });

  it('should unsubscribe when the conveyer is stopped', () => {
    conveyer = new WiringConveyer();
    conveyer.start(onNext);
    conveyer.stop();
    expect(connection.unsubscribe.calledOnce).to.equal(true);
  });

  it('should emit empty graph when first message is an edge removal', () => {
    conveyer = new WiringConveyer();
    conveyer.start(onNext);

    const graphNetworkStructure = getGraphNetworkStructure();
    graphNetworkStructure.edges.push({
      source: 0,
      destination: 1,
      relation: 'runs on',
      type: 'removal'
    });
    emitGraph(graphNetworkStructure);

    expect(onNext).to.have.callCount(1);
    const processedGraph = onNext.getCall(0).args[0];
    expect(processedGraph.edges.length).to.equal(0);
    expect(Object.keys(processedGraph.nodes).length).to.equal(0);
  });

  it('should list nodes in graph that have edges', () => {
    conveyer = new WiringConveyer();
    conveyer.start(onNext);

    const graphNetworkStructure = getGraphNetworkStructure();
    graphNetworkStructure.edges.push({
      source: 0,
      destination: 1,
      relation: 'runs on',
      type: 'addition'
    });
    emitGraph(graphNetworkStructure);

    expect(onNext).to.have.callCount(1);
    const processedGraph = onNext.getCall(0).args[0];

    // nodes should exist for all nodes with at least one edge
    expect(Object.keys(processedGraph.nodes).length).to.equal(2);
    const nodeAStrId = getIdString(graphNetworkStructure.nodes[0]);
    expect(processedGraph.nodes[nodeAStrId].toJS()).to.deep.equal({
      id: nodeAStrId,
      pluginId: 'pA',
      steadyId: 'sA',
      hostId: 'hA'
    });
    const nodeBStrId = getIdString(graphNetworkStructure.nodes[1]);
    expect(processedGraph.nodes[nodeBStrId].toJS()).to.deep.equal({
      id: nodeBStrId,
      pluginId: 'pB',
      steadyId: 'sB',
      hostId: 'hB'
    });

    getIdString(graphNetworkStructure.nodes[0]);
    expect(processedGraph.edges.length).to.equal(1);
    expect(processedGraph.edges).to.deep.equal([
      {
        source: nodeAStrId,
        destination: nodeBStrId,
        relation: 'runs on'
      }
    ]);
  });

  it('should process graph updates', () => {
    conveyer = new WiringConveyer();
    conveyer.start(onNext);

    const initialGraph = getGraphNetworkStructure();
    initialGraph.edges.push({
      source: 0,
      destination: 1,
      relation: 'runs on',
      type: 'addition'
    }, {
      source: 1,
      destination: 2,
      relation: 'runs on',
      type: 'addition'
    }, {
      source: 0,
      destination: 3,
      relation: 'runs on',
      type: 'addition'
    });
    emitGraph(initialGraph);

    const graphUpdate = getGraphNetworkStructure();
    graphUpdate.edges.push({
      source: 1,
      destination: 2,
      relation: 'runs on',
      type: 'removal'
    }, {
      source: 1,
      destination: 3,
      relation: 'runs on',
      type: 'addition'
    });
    emitGraph(graphUpdate);

    expect(onNext).to.have.callCount(2);
    const processedGraph = onNext.getCall(1).args[0];
    expect(Object.keys(processedGraph.nodes).length).to.equal(3);

    const nodeAStrId = getIdString(initialGraph.nodes[0]);
    const nodeBStrId = getIdString(initialGraph.nodes[1]);
    const nodeDStrId = getIdString(initialGraph.nodes[3]);
    expect(nodeAStrId in processedGraph.nodes).to.equal(true);
    expect(nodeBStrId in processedGraph.nodes).to.equal(true);
    expect(nodeDStrId in processedGraph.nodes).to.equal(true);

    expect(processedGraph.edges.length).to.equal(3);
    expect(processedGraph.edges).to.deep.equal([
      {
        source: nodeAStrId,
        destination: nodeBStrId,
        relation: 'runs on'
      },
      {
        source: nodeAStrId,
        destination: nodeDStrId,
        relation: 'runs on'
      },
      {
        source: nodeBStrId,
        destination: nodeDStrId,
        relation: 'runs on'
      }
    ]);
  });

  function getGraphNetworkStructure() {
    return {
      nodes: {
        0: snapshot('A'),
        1: snapshot('B'),
        2: snapshot('C'),
        3: snapshot('D')
      },
      edges: []
    };
  }

  function emitGraph(graph) {
    connection.emitter.emit('message', {
      id: conveyer.id,
      data: [graph]
    });
  }

  function snapshot(i) {
    return {
      pluginId: 'p' + i,
      steadyId: 's' + i,
      hostId: 'h' + i
    };
  }
});
