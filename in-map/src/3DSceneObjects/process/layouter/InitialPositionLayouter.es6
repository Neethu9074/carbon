/* eslint-disable complexity */
export default class FruchtermanReingoldLayout {

  constructor() {
    this.iterations =  1000;
    this.gravity =  1;
    this.speed =  0.1;
  }

  applyLayout({nodes}) {
    nodes.forEach((node) => {
      const pos = node.getComponent('position').getPosition();
      // if the node wasn't layouted
      if (pos.x === 0 && pos.y === 0 && pos.z === 0) {
        node.getComponent('position').setPosition(Math.random(), 0, Math.random());
      }
    });
  }
}
