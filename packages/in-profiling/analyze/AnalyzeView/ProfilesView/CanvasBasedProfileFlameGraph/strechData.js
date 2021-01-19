/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function strechData({ layers }, scale) {
  const totalWidth = scale.getRangeTo();
  const layerIterator = layers.values();
  for (const layer of layerIterator) {
    strechNodes(layer);
  }

  function strechNodes(layerNodes) {
    for (let i = 0; i < layerNodes.length; i++) {
      const node = layerNodes[i];
      node.s_x = scale.getDomain(node.x);
      node.s_width = node.width * scale.scaleFactor;
      if (node.s_x + node.s_width > 0 && node.s_x < totalWidth) {
        node.s_x = Math.max(0, node.s_x);
        node.s_width = Math.min(totalWidth, node.s_width);
      }
    }
  }
}
