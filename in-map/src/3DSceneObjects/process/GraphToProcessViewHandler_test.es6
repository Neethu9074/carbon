/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';


describe('GraphToProcessViewHandler', () => {
  let graphToProcessViewHandler;
  let viewStructure;
  let client;

  beforeEach(() => {
    viewStructure = create();
    client = {
      createNode: sinon.stub(),
      createEdge: sinon.stub(),
      removeNode: sinon.stub(),
      removeEdge: sinon.stub(),
      createSubNode: sinon.stub()
    };

    const GraphToProcessViewHandler = proxyquire('in-map/src/3DSceneObjects/process/GraphToProcessViewHandler', {
      'in-stores/view': {
        viewStructure
      }
    }).default;

    graphToProcessViewHandler = new GraphToProcessViewHandler(client);
  });

  afterEach(() => {
    graphToProcessViewHandler.dispose();
  });

  it('should create two nodes and one edge', () => {
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'to')
    ]));
    expect(client.createNode.callCount).to.equal(2);
    expect(client.createEdge.callCount).to.equal(1);

    expect(client.createNode.getCall(0).args[0]).to.equal('a');
    expect(client.createNode.getCall(1).args[0]).to.equal('b');
    expect(client.createEdge.getCall(0).args[0]).to.equal('process-view-connection:a,b,to');
  });

  it('should remove all that was created', () => {
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'to')
    ]));
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'to', 'remove')
    ]));
    expect(client.createNode.callCount).to.equal(2);
    expect(client.createEdge.callCount).to.equal(1);
    expect(client.removeEdge.callCount).to.equal(1);
    expect(client.removeNode.callCount).to.equal(2);

    expect(client.createNode.getCall(0).args[0]).to.equal('a');
    expect(client.createNode.getCall(1).args[0]).to.equal('b');
    expect(client.createEdge.getCall(0).args[0]).to.equal('process-view-connection:a,b,to');

    expect(client.removeNode.getCall(0).args[0]).to.equal('a');
    expect(client.removeNode.getCall(1).args[0]).to.equal('b');
    expect(client.removeEdge.getCall(0).args[0]).to.equal('process-view-connection:a,b,to');
  });

  it('should add new upcoming nodes', () => {
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'to')
    ]));
    viewStructure.emit(immutable.fromJS([
      edge('a', 'c', 'to')
    ]));
    expect(client.createNode.callCount).to.equal(3);
    expect(client.createEdge.callCount).to.equal(2);

    expect(client.createNode.getCall(0).args[0]).to.equal('a');
    expect(client.createNode.getCall(1).args[0]).to.equal('b');
    expect(client.createNode.getCall(2).args[0]).to.equal('c');
    expect(client.createEdge.getCall(0).args[0]).to.equal('process-view-connection:a,b,to');
    expect(client.createEdge.getCall(1).args[0]).to.equal('process-view-connection:a,c,to');
  });

  it('should collect all top cluster and nodes without cluster', () => {
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'of'),
      edge('c', 'b', 'of'),
      edge('d', 'e', 'of'),
      edge('h', 'd', 'of'),
      edge('f', 'e', 'of'),
      edge('g', 'f', 'to')
    ]));

    // 1 level: b, e, g
    expect(graphToProcessViewHandler.getParentNodeFor('b')).to.equal(undefined);
    expect(graphToProcessViewHandler.getParentNodeFor('e')).to.equal(undefined);
    expect(graphToProcessViewHandler.getParentNodeFor('g')).to.equal(undefined);

    // 2 level: a, c, d, f
    expect(graphToProcessViewHandler.getParentNodeFor('a')).to.equal('b');
    expect(graphToProcessViewHandler.getParentNodeFor('c')).to.equal('b');
    expect(graphToProcessViewHandler.getParentNodeFor('d')).to.equal('e');
    expect(graphToProcessViewHandler.getParentNodeFor('f')).to.equal('e');

    // 3 level: h
    expect(graphToProcessViewHandler.getParentNodeFor('h')).to.equal('d');
  });

  it('should update LUT', () => {
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'of'),
      edge('c', 'b', 'of'),
      edge('d', 'e', 'of'),
      edge('h', 'd', 'of'),
      edge('f', 'e', 'of'),
      edge('g', 'f', 'to')
    ]));

    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'of', 'remove')
    ]));

    // 2 level: a, c, d, f
    expect(graphToProcessViewHandler.getParentNodeFor('a')).to.equal(undefined);
  });

  it('should call nodes or subNodes based on hierarchy', () => {
    viewStructure.emit(immutable.fromJS([
      edge('a', 'b', 'of'),
      edge('c', 'b', 'of'),
      edge('d', 'e', 'of'),
      edge('h', 'd', 'of'),
      edge('f', 'e', 'of'),
      edge('g', 'f', 'to')
    ]));

    expect(client.createNode.callCount).to.equal(3);
    expect(client.createNode.getCall(0).args[0]).to.equal('b');
    expect(client.createNode.getCall(1).args[0]).to.equal('e');
    expect(client.createNode.getCall(2).args[0]).to.equal('g');


    expect(client.createSubNode.callCount).to.equal(5);

    expect(client.createSubNode.getCall(0).args[0]).to.equal('a');
    expect(client.createSubNode.getCall(0).args[1]).to.equal('b');

    expect(client.createSubNode.getCall(1).args[0]).to.equal('c');
    expect(client.createSubNode.getCall(1).args[1]).to.equal('b');

    expect(client.createSubNode.getCall(2).args[0]).to.equal('d');
    expect(client.createSubNode.getCall(2).args[1]).to.equal('e');

    expect(client.createSubNode.getCall(3).args[0]).to.equal('h');
    expect(client.createSubNode.getCall(3).args[1]).to.equal('d');

    expect(client.createSubNode.getCall(4).args[0]).to.equal('f');
    expect(client.createSubNode.getCall(4).args[1]).to.equal('e');
  });

  function edge(from, to, relation, type = 'add') {
    return {
      from,
      to,
      relation,
      type,
      id: 'process-view-connection:' + from + ',' + to + ',' + relation
    };
  }
});
