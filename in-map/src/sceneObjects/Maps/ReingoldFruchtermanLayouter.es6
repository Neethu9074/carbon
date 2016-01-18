export default class ReingoldFruchtermanLayouter {

  constructor() {}

  applyLayout(map) {
    map.nodes.forEach((node, index) => {
      node.getComponent('position').setPosition(index, 0, 0);
    });
  }
}
