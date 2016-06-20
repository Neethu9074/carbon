/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';


describe('process layouterStore', () => {
  let store;
  let nodes$;
  let edges$;
  let subscription;
  let onInventarChange;

  beforeEach(() => {
    resetStoreRegistry();

    nodes$ = create();
    edges$ = create();

    store = proxyquire('in-map/src/stores/process/layouterStore', {
      'in-map/src/stores/process/nodesStore': {
        nodes$
      },
      'in-map/src/stores/process/edgesStore': {
        edges$
      }
    });

    onInventarChange = sinon.stub();
    subscription = store.inventar$.subscribe(onInventarChange);
  });

  afterEach(() => {
    subscription.dispose();
  });

  function sendTestData() {
    nodes$.emit({
      node1: { id: 'node1' },
      node2: { id: 'node2' }
    });
    edges$.emit({
      edge1: { id: 'edge1' }
    });
  }

  function checkCallIsEqualTestData(call) {
    expect(call).to.deep.equal({
      nodes: [
        { id: 'node1' },
        { id: 'node2' }
      ],
      edges: [
        { id: 'edge1' }
      ]
    });
  }

  it('should combine nodes and edges to inventar stream', () => {
    expect(onInventarChange).to.have.callCount(0);

    sendTestData();
    expect(onInventarChange).to.have.callCount(1);
    checkCallIsEqualTestData(onInventarChange.getCall(0).args[0]);
  });

  it('should not fire when layouting is disabled and fire when enabled again', () => {
    store.disableLayouting();

    expect(onInventarChange).to.have.callCount(0);

    sendTestData();
    expect(onInventarChange).to.have.callCount(0);

    store.enableLayouting();
    expect(onInventarChange).to.have.callCount(1);
    checkCallIsEqualTestData(onInventarChange.getCall(0).args[0]);
  });
});
