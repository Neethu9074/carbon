/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import connections from 'in-map/stores/connectionsStore';


describe('in-map', () => {
  describe('misc/logiacl/ConnectedNodesHighlighter', () => {
    let selectedSnapshotIdForHighlightingInMap;
    let highlighter;
    let clearIds;
    let setIds;

    beforeEach(() => {
      selectedSnapshotIdForHighlightingInMap = create();
      selectedSnapshotIdForHighlightingInMap.emit(null);

      setIds = sinon.stub();
      clearIds = sinon.stub();

      const ConnectedNodesHighlighter = proxyquire('in-map/misc/logical/ConnectedNodesHighlighter', {
        'in-map/stores/logical/connectedHighlightingStore': {
          setIds,
          clearIds
        },
        'in-map/misc/TimingConfig': {
          CONNECTED_HIGHLIGHTING_CHECK: 0
        },
        'in-map/stores/selectedMapSceneObjectStore': {
          selectedSnapshotIdForHighlightingInMap$: selectedSnapshotIdForHighlightingInMap
        }
      }).default;

      highlighter = new ConnectedNodesHighlighter();
      highlighter.initEvents();
    });

    afterEach(() => {
      highlighter.dispose();
      clearHighlightedEntityId();
    });

    it('should clear ids when nothing is highlighted', () => {
      expect(setIds).to.have.callCount(0);
      expect(clearIds).to.have.callCount(1);
    });

    it('should clear ids when disposing highlighter', () => {
      highlighter.dispose();

      expect(setIds).to.have.callCount(0);
      expect(clearIds).to.have.callCount(2);
    });

    it('should not set the entity id if the entity is not connected', () => {
      setHighlightedEntityId('foo');

      expect(setIds).to.have.callCount(0);
    });

    it('should not set the entity id if the entity is not connected', () => {
      setHighlightedEntityId('foo');

      connections.add('foo_c', {
        id: 'foo_c',
        sourceNode: { id: 'n1' },
        destinationNode: { id: 'n1' }
      });

      expect(setIds).to.have.callCount(0);

      connections.remove('foo_c');
    });

    it('should set the entity id of connected, this and connection if the node is connected', () => {
      setHighlightedEntityId('foo');

      connections.add('foo_c', {
        id: 'foo_c',
        sourceNode: { id: 'foo' },
        destinationNode: { id: 'bar' }
      });

      expect(setIds).to.have.callCount(1);
      expect(setIds.getCall(0).args[0]).to.deep.equal({
        'foo': true,
        'bar': true,
        'foo_c': true
      });

      connections.remove('foo_c');
    });

    it('should set the entity id of connected, this and connection if the node is connected', () => {
      setHighlightedEntityId('bar');

      connections.add('foo_c', {
        id: 'foo_c',
        sourceNode: { id: 'foo' },
        destinationNode: { id: 'bar' }
      });

      expect(setIds).to.have.callCount(1);
      expect(setIds.getCall(0).args[0]).to.deep.equal({
        'foo': true,
        'bar': true,
        'foo_c': true
      });

      connections.remove('foo_c');
    });

    it('should set the entity id of connected, this and connection if the node is connected', () => {
      setHighlightedEntityId('foo');

      connections.add('foo_c', {
        id: 'foo_c',
        sourceNode: { id: 'foo' },
        destinationNode: { id: 'bar' }
      });

      expect(setIds).to.have.callCount(1);
      expect(setIds.getCall(0).args[0]).to.deep.equal({
        'foo': true,
        'bar': true,
        'foo_c': true
      });

      connections.add('foo_c2', {
        id: 'foo_c2',
        sourceNode: { id: 'foo' },
        destinationNode: { id: 'unknown' }
      });

      expect(setIds).to.have.callCount(2);
      expect(setIds.getCall(1).args[0]).to.deep.equal({
        'foo': true,
        'bar': true,
        'foo_c': true,
        'foo_c2': true,
        'unknown': true
      });

      connections.remove('foo_c');
      connections.remove('foo_c2');
    });

    it('should set the selected entity id if the entity is connected', () => {
      selectedSnapshotIdForHighlightingInMap.emit('foo');

      connections.add('foo_c', {
        id: 'foo_c',
        sourceNode: { id: 'n1' },
        destinationNode: { id: 'n1' }
      });

      expect(setIds).to.have.callCount(0);

      connections.remove('foo_c');
    });

    it('should set the selected entity id if the entity is connected', () => {
      selectedSnapshotIdForHighlightingInMap.emit('foo');

      connections.add('foo_c', {
        id: 'foo_c',
        sourceNode: { id: 'n1' },
        destinationNode: { id: 'n1' }
      });

      expect(setIds).to.have.callCount(0);

      connections.remove('foo_c');
    });
  });
});
