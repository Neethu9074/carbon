/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-components/FlowMap/SceneGraph/SceneGraph', () => {
  let sceneGraphInstance;

  beforeEach(() => {
    const SceneGraph = proxyquire('in-components/FlowMap/SceneGraph/SceneGraph', {}).default;
    sceneGraphInstance = new SceneGraph(42, 42);
  });

  describe('getNewDeletedAndPresentNodesFromLists', () => {
    it('should identify new nodes', () => {
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([], []).newNodes).to.have.members([]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2, 3, 4], [5, 6]).newNodes).to.have.members([
        5,
        6
      ]);
      expect(
        sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2, 3, 4], [1, 2, 3, 7]).newNodes
      ).to.have.members([7]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([], [42]).newNodes).to.have.members([42]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([42, 4711], []).newNodes).to.have.members([]);
    });

    it('should identify present nodes', () => {
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2, 3], []).presentNodes).to.have.members([]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([], [1, 2, 3]).presentNodes).to.have.members([]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([2], [1, 2, 3]).presentNodes).to.have.members([
        2
      ]);
      expect(
        sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2, 3], [1, 2, 3]).presentNodes
      ).to.have.members([1, 2, 3]);
      expect(
        sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2, 3], [2, 6, 3]).presentNodes
      ).to.have.members([2, 3]);
    });

    it('should identify removed nodes', () => {
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([42, 4711], []).removedNodes).to.have.members([
        42,
        4711
      ]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([42, 4711], [2]).removedNodes).to.have.members([
        42,
        4711
      ]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([42, 4711], [42]).removedNodes).to.have.members([
        4711
      ]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2], [3, 4]).removedNodes).to.have.members([
        1,
        2
      ]);
      expect(sceneGraphInstance.getNewDeletedAndPresentNodesFromLists([1, 2], [1, 2]).removedNodes).to.have.members([]);
    });
  });
});
