import BaseHighlightingComponent from './BaseHighlightingComponent';


export default class Cube extends BaseHighlightingComponent {

  constructor(config) {
    super(config);
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const fromX = pos.x - ((1 - scale.x) / 2) + 0.01;
    const toX = fromX - scale.x - 0.02;
    const fromY = pos.y - 0.01;
    const toY = fromY + scale.y + 0.02;
    const fromZ = pos.z - 0.01 + ((1 - scale.z) / 2);
    const toZ = fromZ + scale.z + 0.02;

    this.lineContentProvider.setLines([
      toX, fromY, fromZ,
      toX, fromY, toZ,

      toX, fromY, toZ,
      fromX, fromY, toZ,

      fromX, fromY, toZ,
      fromX, fromY, fromZ,

      fromX, fromY, fromZ,
      toX, fromY, fromZ,

      toX, fromY, fromZ,
      toX, toY, fromZ,

      fromX, fromY, toZ,
      fromX, toY, toZ,

      toX, toY, fromZ,
      fromX, toY, fromZ,

      fromX, toY, fromZ,
      fromX, toY, toZ
    ]);
  }
}
