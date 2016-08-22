const SCALE = 5;

export default function applyLayout(nodes, edges) {
  const nunNodesPerRow = Math.ceil(Math.sqrt(nodes.length));
  const dimension = nunNodesPerRow * SCALE;

  let rowIndex = 1;
  let columnIndex = 1;
  nodes
    .map(node => {
      let numEdges = 0;
      edges.forEach(edge => {
        if (edge.sourceNode.id === node.id || edge.destinationNode.id === node.id) {
          numEdges++;
        }
      });

      return {
        sceneObject: node,
        numEdges
      };
    })
    .sort((a, b) => a.numEdges - b.numEdges)
    .forEach(node => {
      const currentRowIndex = rowIndex++;
      node.sceneObject.getComponent('transform').setPositionXYZ(
        currentRowIndex * SCALE - dimension / 2,
        0,
        columnIndex * SCALE - dimension / 2);

      if (rowIndex > nunNodesPerRow) {
        rowIndex = 1;
        columnIndex++;
      }
    });
}
