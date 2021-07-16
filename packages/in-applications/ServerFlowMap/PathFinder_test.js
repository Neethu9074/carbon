/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import PathFinder from 'in-applications/ServerFlowMap/PathFinder';

describe('in-applications/ServerFlowMap/PathFinder', () => {
  const nodesMock = getNodesMock();
  const pathFinder = new PathFinder(nodesMock);
  pathFinder.setRootNodeId('root');

  describe('findPath', () => {
    it('should return given id if the id is not in the graph', () => {
      expect(map(pathFinder.find('foobar'))).to.deep.equal(['foobar']);
    });

    it('should return the root when root is given', () => {
      expect(map(pathFinder.find('root'))).to.deep.equal(['root']);
    });

    it('should return given id if there is no root', () => {
      expect(map(pathFinder.find('in1', 'incoming'))).to.deep.equal(['in1', 'root']);
      expect(map(pathFinder.find('in2', 'incoming'))).to.deep.equal(['in2', 'root']);

      expect(map(pathFinder.find('in1.1', 'incoming'))).to.deep.equal(['in1.1', 'in1', 'root']);
      expect(map(pathFinder.find('in1.2', 'incoming'))).to.deep.equal(['in1.2', 'in1', 'root']);

      expect(map(pathFinder.find('out1', 'outgoing'))).to.deep.equal(['root', 'out1']);
      expect(map(pathFinder.find('out2', 'outgoing'))).to.deep.equal(['root', 'out2']);

      expect(map(pathFinder.find('out2.1', 'outgoing'))).to.deep.equal(['root', 'out2', 'out2.1']);
      expect(map(pathFinder.find('out2.1.1', 'outgoing'))).to.deep.equal(['root', 'out2', 'out2.1', 'out2.1.1']);
    });
  });
});

function map(result) {
  return result.map(item => item.id);
}

/*
in1.1 ----> in1 ----> root ----> out1
in1.2 --/         /         \---> out2 ----> out2.1 ----> out2.1.1
            in2 -/
*/
function getNodesMock() {
  const nodesMock = new Map();
  nodesMock.set('root', {
    id: 'root',
    outgoing: [
      { id: 'out1', incoming: [], outgoing: [] },
      {
        id: 'out2',
        outgoing: [{ id: 'out2.1', outgoing: [{ id: 'out2.1.1', incoming: [], outgoing: [] }] }],
        incoming: []
      }
    ],
    incoming: [
      {
        id: 'in1',
        outgoing: [],
        incoming: [
          { id: 'in1.1', incoming: [], outgoing: [] },
          { id: 'in1.2', incoming: [], outgoing: [] }
        ]
      },
      { id: 'in2', incoming: [], outgoing: [] }
    ]
  });

  nodesMock.set('out1', true);
  nodesMock.set('out2', true);
  nodesMock.set('out2.1', true);
  nodesMock.set('out2.1.1', true);
  nodesMock.set('in1', true);
  nodesMock.set('in2', true);
  nodesMock.set('in1.1', true);
  nodesMock.set('in1.2', true);
  return nodesMock;
}
