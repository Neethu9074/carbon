import BaseHighlightingComponent from '../common/HighlightingComponent';


export default class HighlightingComponent extends BaseHighlightingComponent {

  constructor(config) {
    super(config);
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const margin = 0.2;
    const fromX = -(0.5 + margin) + pos.x - ((1 - (2 * margin + scale.x)) / 2) + 0.01;
    const fromZ = (0.5 + margin) + pos.z - 0.01 + ((1 - (2 * margin + scale.z)) / 2);
    const lineScaleX = (2 * margin + scale.x);
    const lineScaleZ = (2 * margin + scale.z);

    this.lineContentProvider.setLines([
      fromX + lineScaleX * -0.433, 0, fromZ + lineScaleZ * 0.25,
      fromX + lineScaleX * 0, 0, fromZ + lineScaleZ * 0.5,

      fromX, 0, fromZ + lineScaleZ * 0.5,
      fromX + lineScaleX * 0.433, 0, fromZ + lineScaleZ * 0.25,

      fromX + lineScaleX * 0.433, 0, fromZ + lineScaleZ * 0.25,
      fromX + lineScaleX * 0.433, 0, fromZ + lineScaleZ * -0.25,

      fromX + lineScaleX * 0.433, 0, fromZ + lineScaleZ * -0.25,
      fromX, 0, fromZ + lineScaleZ * -0.5,

      fromX, 0, fromZ + lineScaleZ * -0.5,
      fromX + lineScaleX * -0.433, 0, fromZ + lineScaleZ * -0.25,

      fromX + lineScaleX * -0.433, 0, fromZ + lineScaleZ * -0.25,
      fromX + lineScaleX * -0.433, 0, fromZ + lineScaleZ * 0.25
    ]);
  }
}
