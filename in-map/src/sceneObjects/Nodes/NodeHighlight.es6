'use strict';

import Highlight from '../Highlight';


export default class NodeHighlight extends Highlight {
  constructor({client}) {
    super({client});
  }

  //sets the primary highlight whatever that means
  setHighlight() {
    if(this.isHighlighted) {
      return;
    }

    const client = this.client;

    this.setupHighlightBorderLines(client);
    super.setHighlight();

    //make the changes visible
    client.renderScene();
  }

  setupHighlightBorderLines(client) {
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

  hide() {
    this.client.scene.lineFactory.removeFragment(this.client.id + '_h');
  }

  clearHighlightBorderLines() {
    const client = this.client;
    client.scene.lineFactory.removeFragment(client.id + '_h');
  }

  //clears the primary highlighting
  clearHighlight() {
    const client = this.client;

    //don't dispose the highlighting twice
    if(!this.isHighlighted) {return; }

    this.clearHighlightBorderLines();

    //make the changes visible
    client.renderScene();

    super.clearHighlight();
  }

  refresh() {
    if(this.isHighlighted) {
      this.clearHighlightBorderLines();
      this.setupHighlightBorderLines(this.client);
    }
  }

  onMouseOver() {
    this.setHighlight();
  }

  onMouseOff() {
    //only disable highlighting if the node was not selected (is needed if
    //the node was selected and mouseoff was fired)
    if(!this.client.isSelected()) {
      this.clearHighlight();
    }
  }

  dispose() {
    this.clearHighlightBorderLines();
  }
}
