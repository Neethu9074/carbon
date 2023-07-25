/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import flowLayout from 'in-applications/ApplicationMap/misc/layouting/Vizceral';

describe('applyLayout', () => {
  it('should support simple node chain', () => {
    const nodes = buildNodes(['a1', 'b1', 'c1', 'c2']);
    const edges = buildEdges([
      { from: 'a1', to: 'b1' },
      { from: 'b1', to: 'c1' },
      { from: 'b1', to: 'c2' }
    ]);

    flowLayout.applyLayout({ nodes, edges });

    expectColumns(nodes, 3);
    expectSameColumn(nodes, ['c1', 'c2']);
  });

  it('should support one node referencing many', () => {
    const nodes = buildNodes(['s', 'a1', 'a2', 'a3', 'a4']);
    const edges = buildEdges([
      { from: 's', to: 'a1' },
      { from: 's', to: 'a2' },
      { from: 's', to: 'a3' },
      { from: 's', to: 'a4' }
    ]);

    flowLayout.applyLayout({ nodes, edges });

    expectColumns(nodes, 2);
    expectSameColumn(nodes, ['a1', 'a2', 'a3', 'a4']);
  });

  it('should support one self referencing node', () => {
    const nodes = buildNodes(['s1']);
    const edges = buildEdges([{ from: 's1', to: 's1' }]);

    flowLayout.applyLayout({ nodes, edges });

    expectColumns(nodes, 1);
  });

  it('should support self referencing nodes', () => {
    const nodes = buildNodes(['s1', 's2', 'db1', 'db2']);
    const edges = buildEdges([
      { from: 's1', to: 's1' },
      { from: 's1', to: 'db1' },
      { from: 's1', to: 'db2' },
      { from: 's2', to: 's2' },
      { from: 's2', to: 'db1' },
      { from: 's2', to: 'db2' }
    ]);

    flowLayout.applyLayout({ nodes, edges });

    expectColumns(nodes, 2);
    expectSameColumn(nodes, ['s1', 's2']);
    expectSameColumn(nodes, ['db1', 'db2']);
  });
});

function expectColumns(nodeMap, numberOfColumns) {
  const nodes = [...nodeMap.values()];
  const uniqueX = new Set(nodes.map(node => node.x)).size;
  expect(uniqueX).to.equal(numberOfColumns);
}

function expectSameColumn(nodeMap, nodesIds) {
  const expectedX = nodeMap.get(nodesIds[0]).x;
  nodesIds.forEach(id => {
    expect(nodeMap.get(id).x).to.equal(expectedX);
  });
}

function buildNodes(ids) {
  const nodes = new Map();
  ids.forEach(id => {
    nodes.set(id, {
      id: id,
      x: 0,
      y: 0
    });
  });
  return nodes;
}

function buildEdges(fromTo) {
  const edges = new Map();
  fromTo.forEach(e => {
    edges.set(e.from + '-to-' + e.to, {
      from: {
        id: e.from
      },
      to: {
        id: e.to
      }
    });
  });
  return edges;
}
