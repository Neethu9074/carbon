import BaseHighlightingComponent from '../common/HighlightingComponent';


export default class HighlightingComponent extends BaseHighlightingComponent {

  constructor(config) {
    super(config);
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const fromX = pos.x - ((1 - scale.x) / 2) + 0.01;
    const toX = fromX - scale.x - 0.02;
    const fromZ = pos.z - 0.01 + ((1 - scale.z) / 2);
    const toZ = fromZ + scale.z + 0.02;

    this.lineContentProvider.setLines([
      toX, 0, fromZ,
      toX, 0, toZ,

      toX, 0, toZ,
      fromX, 0, toZ,

      fromX, 0, toZ,
      fromX, 0, fromZ,

      fromX, 0, fromZ,
      toX, 0, fromZ
    ]);
  }
}
