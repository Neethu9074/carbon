const SCALE = 5;

export default class Chessboard {

  constructor() {}

  applyLayout(inventar) {
    const nunNodesPerRow = Math.ceil(Math.sqrt(inventar.nodes.length));

    let rowIndex = 1;
    let columnIndex = 1;
    inventar.nodes
      .map(node => {
        let numEdges = 0;
        inventar.edges.forEach(edge => {
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
        node.sceneObject.getComponent('position').setPosition(currentRowIndex * SCALE, 0, columnIndex * SCALE);

        if (rowIndex > nunNodesPerRow) {
          rowIndex = 1;
          columnIndex++;
        }
      });
  }
}
