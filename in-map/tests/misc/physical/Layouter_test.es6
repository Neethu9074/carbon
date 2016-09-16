/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import createObjectCollection from 'in-map/stores/ObjectCollectionStream';


describe('in-map', () => {
  describe('misc/physical/Layouter', () => {
    let eventBus;
    let layouter;
    let focusId;
    let groups;
    let nodes;

    beforeEach(() => {
      groups = createObjectCollection();
      nodes = createObjectCollection();
      eventBus = new RoEmitter();
      focusId = sinon.stub();

      const createLayouter = proxyquire('in-map/misc/physical/Layouter', {
        'in-map/stores/physical/groupsStore': {
          groups
        },
        'in-map/stores/physical/nodesStore': {
          nodes
        },
        'in-map/misc/TimingConfig': {
          PHYSICAL_LAYOUTING: 0
        },
        'in-map/services/eventBus': {
          eventBus
        },
        'in-map/services/focus': {
          focusId
        }
      }).default;

      layouter = createLayouter();
    });

    afterEach(() => {
      layouter.dispose();
      eventBus.dispose();
    });

    it('should layout groups', () => {
      eventBus.emit('layoutNeedsUpdate', true);

      const node11 = createNode('node1_1');
      const node12 = createNode('node1_2');
      nodes.add(node11);
      nodes.add(node12);

      const group1 = createGroup('group1', [node11, node12]);
      groups.add('group1', group1);

      expect(group1.getPosition().x).to.equal(0);
      expect(group1.getPosition().y).to.equal(0);
      expect(group1.getPosition().z).to.equal(-1.5);

      expect(group1.getScale().sx).to.equal(3);
      expect(group1.getScale().sz).to.equal(6);
    });

    it('should layout nodes inside the group', () => {
      eventBus.emit('layoutNeedsUpdate', true);

      const node11 = createNode('node1_1');
      const node12 = createNode('node1_2');
      nodes.add(node11);
      nodes.add(node12);

      const group1 = createGroup('group1', [node11, node12]);
      groups.add('group1', group1);

      expect(node11.getPosition().x).to.equal(0);
      expect(node11.getPosition().y).to.equal(0);
      expect(node11.getPosition().z).to.equal(0);
    });

    it('should layout nodes inside many groups', () => {
      const node11 = createNode('node1_1');
      const node12 = createNode('node1_2');
      const node21 = createNode('node2_1');
      const node22 = createNode('node2_2');
      nodes.add(node11);
      nodes.add(node12);
      nodes.add(node21);
      nodes.add(node22);

      const group1 = createGroup('group1', [node11, node12]);
      const group2 = createGroup('group2', [node21, node22]);
      groups.add('group1', group1);
      groups.add('group2', group2);

      eventBus.emit('layoutNeedsUpdate', true);

      expect(group1.getPosition().x).to.equal(-2);
      expect(group1.getPosition().z).to.equal(-1.5);

      expect(group1.getScale().sx).to.equal(3);
      expect(group1.getScale().sz).to.equal(6);

      expect(group2.getPosition().x).to.equal(2);
      expect(group2.getPosition().z).to.equal(-1.5);

      expect(group2.getScale().sx).to.equal(3);
      expect(group2.getScale().sz).to.equal(6);

      expect(node11.getPosition().x).to.equal(-2);
      expect(node11.getPosition().z).to.equal(0);

      expect(node12.getPosition().x).to.equal(-2);
      expect(node12.getPosition().z).to.equal(-3);

      expect(node21.getPosition().x).to.equal(2);
      expect(node21.getPosition().z).to.equal(0);

      expect(node22.getPosition().x).to.equal(2);
      expect(node22.getPosition().z).to.equal(-3);
    });
  });
});

function createNode(id) {
  let x = 0;
  let y = 0;
  let z = 0;
  let sx = 0;
  let sy = 0;
  let sz = 0;
  return {
    id,
    _cachedLabel: id,
    x, y, z, sx, sy, sz,
    getComponent: () => {
      return {
        setPositionXYZ: (_x, _y, _z) => { x = _x; y = _y; z = _z; },
        setScaleXYZ: (_x, _y, _z) => { sx = _x; sy = _y; sz = _z; }
      };
    },
    getPosition: () => { return {x, y, z}; },
    getScale: () => { return {sx, sy, sz}; }
  };
}

function createGroup(id, nodes) {
  const _nodes = createObjectCollection();
  nodes.forEach(n => _nodes.add(n.id, n));
  const group = createNode(id);
  group.nodes = _nodes;
  return group;
}
