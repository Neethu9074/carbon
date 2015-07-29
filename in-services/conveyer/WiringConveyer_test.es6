/* eslint-env mocha*/
/*eslint max-len:[2, 120] */

'use strict';

import Immutable from 'immutable';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';
import RoEmitter from 'roemitter';

const ec2 = 'com.instana.forge.infrastructure.virtualization.EC2';

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
    expect(WiringConveyer.getUniqueId({pluginId: ec2}))
      .to.equal(ec2);
  });

  it('should subscribe via WebSocket connection', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
    conveyer.start(onNext);
    expect(connection.subscribe.calledOnce).to.equal(true);
    expect(connection.subscribe.getCall(0).args[0]).to.equal(conveyer.id);
    expect(connection.subscribe.getCall(0).args[1]).to.deep.equal({
      id: conveyer.id,
      event: 'subscribe',
      type: 'wiring',
      pluginId: ec2
    });
  });

  it('should unsubscribe when the conveyer is stopped', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
    conveyer.start(onNext);
    conveyer.stop();
    expect(connection.unsubscribe.calledOnce).to.equal(true);
  });

  it('should process node and edge network format', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
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

    const graph = onNext.getCall(0).args[0];
    expect(Immutable.Map.isMap(graph)).to.equal(true);
    expect(graph.size).to.equal(2);

    const key = graph.keySeq().first();
    expect(Immutable.Map.isMap(key)).to.equal(true);
    expect(key.get('steadyId')).to.equal('sA');

    const edges = graph.get(key);
    expect(Immutable.Set.isSet(edges)).to.equal(true);
    expect(edges.size).to.equal(1);

    const destination = edges.first();
    expect(destination.get('steadyId')).to.equal('sB');
  });

  it('should set up bidirectional edges', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
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

    const graph = onNext.getCall(0).args[0];
    expect(Immutable.Map.isMap(graph)).to.equal(true);
    expect(graph.size).to.equal(2);

    const steadyIds = [
      graph.keySeq().first().get('steadyId'),
      graph.keySeq().last().get('steadyId')
    ];
    expect(steadyIds.indexOf('sA') !== -1).to.equal(true);
    expect(steadyIds.indexOf('sB') !== -1).to.equal(true);
  });

  it('should process multiple edges per node', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
    conveyer.start(onNext);

    const graphNetworkStructure = getGraphNetworkStructure();
    graphNetworkStructure.edges.push({
      source: 0,
      destination: 1,
      relation: 'runs on',
      type: 'addition'
    }, {
      source: 0,
      destination: 2,
      relation: 'runs on',
      type: 'addition'
    });
    emitGraph(graphNetworkStructure);

    expect(onNext).to.have.callCount(1);
    const graph = onNext.getCall(0).args[0];
    expect(graph.size).to.equal(3);

    const edges = graph.first();
    expect(edges.size).to.equal(2);

    const steadyIds = [
      edges.first().get('steadyId'),
      edges.last().get('steadyId')
    ];
    expect(steadyIds.indexOf('sB') !== -1).to.equal(true);
    expect(steadyIds.indexOf('sC') !== -1).to.equal(true);
  });

  it('should remove edges', () => {
    conveyer = new WiringConveyer({pluginId: ec2});
    conveyer.start(onNext);

    const graphNetworkStructure = getGraphNetworkStructure();
    graphNetworkStructure.edges.push({
      source: 0,
      destination: 1,
      relation: 'runs on',
      type: 'addition'
    }, {
      source: 0,
      destination: 2,
      relation: 'runs on',
      type: 'addition'
    });
    emitGraph(graphNetworkStructure);

    graphNetworkStructure.edges.push({
      source: 0,
      destination: 1,
      relation: 'runs on',
      type: 'removal'
    });
    emitGraph(graphNetworkStructure);

    expect(onNext).to.have.callCount(2);
    const graph = onNext.getCall(1).args[0];

    const edges = graph.first();
    expect(edges.size).to.equal(1);

    expect(edges.first().get('steadyId')).to.equal('sC');
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
