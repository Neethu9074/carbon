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
      removeNode: sinon.stub(),
      createSubNode: sinon.stub(),
      removeSubNode: sinon.stub(),
      createEdge: sinon.stub(),
      removeEdge: sinon.stub()
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

  it('should create two nodes and two edges', () => {
    viewStructure.emit(immutable.fromJS(
      entity('ROOT', [
        entity('a',
               [entity('a.a'), entity('a.b')]
        )
      ])
    ));
    expect(client.createNode.callCount).to.equal(1);
    expect(client.createSubNode.callCount).to.equal(2);
    expect(client.createEdge.callCount).to.equal(2);

    expect(client.createNode.getCall(0).args[0]).to.equal('a');
    expect(client.createSubNode.getCall(0).args[0]).to.equal('a.a');
    expect(client.createSubNode.getCall(1).args[0]).to.equal('a.b');
    expect(client.createEdge.getCall(0).args[0].get('id')).to.equal('a,a.a');
    expect(client.createEdge.getCall(1).args[0].get('id')).to.equal('a,a.b');
  });

  function entity(id, children = [], outgoingConnections = []) {
    return {
      id,
      children,
      outgoingConnections: outgoingConnections.map(to => connection(id + ',' + to,
                                                                    id,
                                                                    to))
    };
  }

  function connection(id, from, to) {
    return {
      id,
      from,
      to
    };
  }

});
