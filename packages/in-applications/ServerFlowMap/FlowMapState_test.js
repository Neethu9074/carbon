/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import FlowMapState from 'in-applications/ServerFlowMap/FlowMapState';

describe('in-applications/ServerFlowMap/FlowMapState', () => {
  let flowMapState;
  beforeEach(() => {
    flowMapState = new FlowMapState();
  });

  describe('addNode', () => {
    it('should add node', () => {
      flowMapState.addNode('foo');
      expect(flowMapState.nodes.size).to.equal(1);
      expect(flowMapState.nodes.get('foo').id).to.equal('foo');
    });

    it('should not add nodes twice', () => {
      flowMapState.addNode('foo');
      expect(flowMapState.nodes.size).to.equal(1);
      expect(flowMapState.nodes.get('foo').id).to.equal('foo');

      flowMapState.addNode('bar');
      expect(flowMapState.nodes.size).to.equal(2);
      expect(flowMapState.nodes.get('foo').id).to.equal('foo');
      expect(flowMapState.nodes.get('bar').id).to.equal('bar');

      flowMapState.addNode('foo');
      expect(flowMapState.nodes.size).to.equal(2);
    });
  });

  describe('addChild', () => {
    let node;
    beforeEach(() => {
      node = flowMapState.addNode('foo');
    });

    it('should add child', () => {
      expect(node.children.size).to.equal(0);

      flowMapState.addChild(node, { id: 'child1' });
      expect(node.children.size).to.equal(1);
      expect(node.children.get('child1').id).to.equal('child1');
    });

    it('should not add children twice', () => {
      expect(node.children.size).to.equal(0);

      flowMapState.addChild(node, { id: 'child1' });
      expect(node.children.size).to.equal(1);
      flowMapState.addChild(node, { id: 'child2' });
      expect(node.children.size).to.equal(2);
      flowMapState.addChild(node, { id: 'child1' });
      expect(node.children.size).to.equal(2);
    });
  });

  describe('addRootNode', () => {
    it('should set the root node', () => {
      flowMapState.addRootNode({ id: 'root' });
      expect(flowMapState.nodes.size).to.equal(1);
      expect(flowMapState.nodes.get('root').id).to.equal('root');
    });

    it('should set the given endpoint as the root nodes child if available', () => {
      flowMapState.addRootNode({ id: 'root', endpoint: { id: 'rootEndpoint' } });
      expect(flowMapState.nodes.size).to.equal(1);
      expect(flowMapState.nodes.get('root').id).to.equal('root');
      expect(flowMapState.nodes.get('root').children.get('rootEndpoint').id).to.equal('rootEndpoint');
    });
  });

  describe('getRootNodeId', () => {
    it('should set the root node and save its id', () => {
      flowMapState.addRootNode({ id: 'root' });
      expect(flowMapState.getRootNodeId()).to.equal('root');
    });
  });

  describe('addConnected', () => {
    it('should add connected item in the given direction', () => {
      const node = flowMapState.addNode('foo');
      expect(node.incoming).to.have.length(0);

      flowMapState.addConnected(node, { id: 'foo', nodeId: 'bar' }, 'incoming');
      expect(node.incoming).to.have.length(1);

      flowMapState.addConnected(node, { id: 'foo2', nodeId: 'bar' }, 'incoming');
      expect(node.incoming).to.have.length(2);

      flowMapState.addConnected(node, { id: 'foo', nodeId: 'bar2' }, 'incoming');
      expect(node.incoming).to.have.length(3);

      flowMapState.addConnected(node, { id: 'foo2', nodeId: 'bar2' }, 'incoming');
      expect(node.incoming).to.have.length(4);
    });

    it('should not add connected item in the given direction twice', () => {
      const node = flowMapState.addNode('foo');
      expect(node.incoming).to.have.length(0);

      flowMapState.addConnected(node, { id: 'foo', nodeId: 'bar' }, 'incoming');
      expect(node.incoming).to.have.length(1);
      flowMapState.addConnected(node, { id: 'foo', nodeId: 'bar' }, 'incoming');
      expect(node.incoming).to.have.length(1);

      flowMapState.addConnected(node, { id: 'foo' }, 'incoming');
      expect(node.incoming).to.have.length(2);
      flowMapState.addConnected(node, { id: 'foo' }, 'incoming');
      expect(node.incoming).to.have.length(2);

      flowMapState.addConnected(node, { nodeId: 'foo' }, 'incoming');
      expect(node.incoming).to.have.length(3);
      flowMapState.addConnected(node, { nodeId: 'foo' }, 'incoming');
      expect(node.incoming).to.have.length(3);
    });
  });

  describe('mapResult', () => {
    it('should copy the result structure but replace the id with a unique one', () => {
      expect(
        flowMapState.mapResult(
          {
            data: {
              items: [
                {
                  service: { id: 'service1' },
                  endpoint: 2,
                  applications: ['app1', 'app2'],
                  relatedNodesCount: 3,
                  metrics: 4
                }
              ]
            }
          },
          [],
          'incoming'
        )
      ).to.deep.equal([
        {
          id: 'service1',
          service: { id: 'service1' },
          endpoint: 2,
          applications: ['app1', 'app2'],
          relatedNodesCount: 3,
          metrics: 4
        }
      ]);

      expect(
        flowMapState.mapResult(
          {
            data: {
              items: [
                {
                  service: { id: 'service1' },
                  endpoint: 2,
                  applications: ['app1', 'app2'],
                  relatedNodesCount: 3,
                  metrics: 4
                }
              ]
            }
          },
          ['foo'],
          'incoming'
        )
      ).to.deep.equal([
        {
          id: 'service1<-foo',
          service: { id: 'service1' },
          endpoint: 2,
          applications: ['app1', 'app2'],
          relatedNodesCount: 3,
          metrics: 4
        }
      ]);
    });

    describe('calculateUniqueIdForNode', () => {
      it('should generate a uid based on the path and direction', () => {
        expect(flowMapState.calculateUniqueIdForNode('foo', [], 'incoming')).to.equal('foo');
        expect(flowMapState.calculateUniqueIdForNode('foo', [], 'outgoing')).to.equal('foo');
        expect(flowMapState.calculateUniqueIdForNode('foo', ['1'], 'incoming')).to.equal('foo<-1');
        expect(flowMapState.calculateUniqueIdForNode('foo', ['1', '2'], 'incoming')).to.equal('foo<-1<-2');
        expect(flowMapState.calculateUniqueIdForNode('foo', ['1'], 'outgoing')).to.equal('1->foo');
        expect(flowMapState.calculateUniqueIdForNode('foo', ['1', '2'], 'outgoing')).to.equal('1->2->foo');
      });
    });
  });
});
