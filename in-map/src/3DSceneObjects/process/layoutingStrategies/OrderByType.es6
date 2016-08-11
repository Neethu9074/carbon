import NodeUnknownService from 'in-map/src/3DSceneObjects/process/NodeUnknownService';
import NodeCluster from 'in-map/src/3DSceneObjects/process/NodeCluster';


const SCALE = 5;

export default function applyLayout(nodes) {
  const incomingExits = nodes.filter(node => node instanceof NodeUnknownService);
  const simple = nodes.filter(node => node instanceof NodeCluster);

  for (let i = 0, length = incomingExits.length; i < length; i++) {
    const node = incomingExits[i];
    node.getComponent('position').setPosition(0, 0, i);
  }

  const numNodesPerCol = Math.ceil(Math.sqrt(simple.length));
  const xOffset = 10;
  const dimension = (numNodesPerCol - 2) * SCALE;
  let rowIndex = 0;
  let columnIndex = 0;
  for (let i = 0, length = simple.length; i < length; i++) {
    let currentColumn = columnIndex++;
    if (currentColumn >= numNodesPerCol) {
      columnIndex = 0;
      currentColumn = 0;
      rowIndex++;
    }

    const node = simple[i];
    node.getComponent('position').setPosition(
      xOffset + rowIndex * SCALE,
      0,
      currentColumn * SCALE - dimension / 2);
  }
}
