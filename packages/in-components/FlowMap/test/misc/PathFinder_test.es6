/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-components/FlowMap/misc/PathFinder', () => {
  const nodesMock = getNodesMock();
  const PathFinder = proxyquire('in-components/FlowMap/misc/PathFinder', {
    'in-components/FlowMap/serviceLocator/serviceLocator': {
      getServiceLocators: () => ({
        nodesServiceLocator: {
          getNodes: () => nodesMock
        }
      })
    }
  }).default;
  const pathFinder = new PathFinder('', 'root');

  beforeEach(() => {
    const nodesMock = new Map();
    nodesMock.set('root', { id: 'root', outgoing: ['in1', 'in2'], incoming: ['out1', 'out2'] });
  });

  describe('findPath', () => {
    it('should return given id if the id is not in the graph', () => {
      expect(pathFinder.find('foobar')).to.deep.equal(['foobar']);
    });

    it('should return the root when root is given', () => {
      expect(pathFinder.find('root')).to.deep.equal(['root']);
    });

    it('should return given id if there is no root', () => {
      expect(pathFinder.find('in1', 'incoming')).to.deep.equal(['in1', 'root']);
      expect(pathFinder.find('in2', 'incoming')).to.deep.equal(['in2', 'root']);

      expect(pathFinder.find('in1.1', 'incoming')).to.deep.equal(['in1.1', 'in1', 'root']);
      expect(pathFinder.find('in1.2', 'incoming')).to.deep.equal(['in1.2', 'in1', 'root']);

      expect(pathFinder.find('out1', 'outgoing')).to.deep.equal(['root', 'out1']);
      expect(pathFinder.find('out2', 'outgoing')).to.deep.equal(['root', 'out2']);

      expect(pathFinder.find('out2.1', 'outgoing')).to.deep.equal(['root', 'out2', 'out2.1']);
      expect(pathFinder.find('out2.1.1', 'outgoing')).to.deep.equal(['root', 'out2', 'out2.1', 'out2.1.1']);
    });
  });
});

/*
in1.1 ----> in1 ----> root ----> out1
in1.2 --/         /         \---> out2 ----> out2.1 ----> out2.1.1
            in2 -/
*/
function getNodesMock() {
  const nodesMock = new Map();
  nodesMock.set('root', { id: 'root', outgoing: ['out1', 'out2'], incoming: ['in1', 'in2'] });

  nodesMock.set('in1', { id: 'in1', outgoing: [], incoming: ['in1.1', 'in1.2'] });
  nodesMock.set('in2', { id: 'in2', outgoing: [], incoming: [] });

  nodesMock.set('out1', { id: 'out1', outgoing: [], incoming: [] });
  nodesMock.set('out2', { id: 'out2', outgoing: ['out2.1'], incoming: [] });

  nodesMock.set('in1.1', { id: 'in1.1', outgoing: [], incoming: [] });
  nodesMock.set('in1.2', { id: 'in1.2', outgoing: [], incoming: [] });

  nodesMock.set('out2.1', { id: 'out2.1', outgoing: ['out2.1.1'], incoming: [] });
  nodesMock.set('out2.1.1', { id: 'out2.1.1', outgoing: [], incoming: [] });
  return nodesMock;
}
