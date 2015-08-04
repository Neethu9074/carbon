'use strict';

import Highlight from '../Highlight';


export default class NodeHighlight extends Highlight {
  constructor({client}) {
    super({client});
  }

  show() {
    this.setupHighlightBorderLines();

    //make the changes visible
    this.client.renderScene();
  }

  hide() {
    this.clearHighlightBorderLines();

    //make the changes visible
    this.client.renderScene();
  }

  setupHighlightBorderLines() {
    const client = this.client;

    //create outline effect using lines
    const pos = client.getComponent('position').getPosition();
    if(!pos) {
      return;
    }

    const height = client.height;
    const fromX = pos.x + 0.01;
    const toX = pos.x - 1.01;
    const fromY = pos.y - 0.01;
    const toY = fromY + height + 0.02;
    const fromZ = pos.z - 0.01;
    const toZ = pos.z + 1.01;

    const points = [
      {x: toX, y: fromY, z: fromZ},
      {x: toX, y: fromY, z: toZ},

      {x: toX, y: fromY, z: toZ},
      {x: fromX, y: fromY, z: toZ},

      {x: fromX, y: fromY, z: toZ},
      {x: fromX, y: fromY, z: fromZ},

      {x: fromX, y: fromY, z: fromZ},
      {x: toX, y: fromY, z: fromZ},

      {x: toX, y: fromY, z: fromZ},
      {x: toX, y: toY, z: fromZ},

      {x: fromX, y: fromY, z: toZ},
      {x: fromX, y: toY, z: toZ},

      {x: toX, y: toY, z: fromZ},
      {x: fromX, y: toY, z: fromZ},

      {x: fromX, y: toY, z: fromZ},
      {x: fromX, y: toY, z: toZ}
    ];

    const factory = client.scene.lineFactory;
    factory.addFragment({id: client.id + '_h', points, highlighted: true});
  }

  clearHighlightBorderLines() {
    const client = this.client;
    client.scene.lineFactory.removeFragment(client.id + '_h');
  }

  refresh() {
    if(this.isHighlighted) {
      this.clearHighlightBorderLines();
      this.setupHighlightBorderLines();
    }
  }

  dispose() {
    this.clearHighlightBorderLines();
  }
}
