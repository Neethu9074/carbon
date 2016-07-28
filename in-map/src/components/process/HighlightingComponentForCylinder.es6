import BaseHighlightingComponent from '../common/HighlightingComponent';


export default class HighlightingComponentForCylinder extends BaseHighlightingComponent {

  constructor(config) {
    super(config);
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const margin = 0.05;
    const height = scale.y;
    const widthHalf = scale.x / 2;
    const depthHalf = scale.z / 2;
    const fromX = -(widthHalf + 0.01 + margin) + pos.x - ((1 - (2 * margin + scale.x)) / 2) + 0.01;
    const fromZ = (depthHalf + 0.01 + margin) + pos.z - 0.01 + ((1 - (2 * margin + scale.z)) / 2);
    const lineScaleX = (2 * margin + scale.x);
    const lineScaleZ = (2 * margin + scale.z);

    this.lineContentProvider.setLines([
      fromX + lineScaleX * -0.405, 0, fromZ + lineScaleZ * -0.294,
      fromX + lineScaleX * -0.476, 0, fromZ + lineScaleZ * -0.155,

      fromX + lineScaleX * -0.476, 0, fromZ + lineScaleZ * -0.155,
      fromX + lineScaleX * -0.500, 0, fromZ + lineScaleZ * 0.000,

      fromX + lineScaleX * -0.500, 0, fromZ + lineScaleZ * 0.000,
      fromX + lineScaleX * -0.476, 0, fromZ + lineScaleZ * 0.155,

      fromX + lineScaleX * -0.476, 0, fromZ + lineScaleZ * 0.155,
      fromX + lineScaleX * -0.405, 0, fromZ + lineScaleZ * 0.294,

      fromX + lineScaleX * -0.405, 0, fromZ + lineScaleZ * 0.294,
      fromX + lineScaleX * -0.294, 0, fromZ + lineScaleZ * 0.405,

      fromX + lineScaleX * -0.294, 0, fromZ + lineScaleZ * 0.405,
      fromX + lineScaleX * -0.155, 0, fromZ + lineScaleZ * 0.476,

      fromX + lineScaleX * -0.155, 0, fromZ + lineScaleZ * 0.476,
      fromX + lineScaleX * -0.000, 0, fromZ + lineScaleZ * 0.500,

      fromX + lineScaleX * -0.000, 0, fromZ + lineScaleZ * 0.500,
      fromX + lineScaleX * 0.155, 0, fromZ + lineScaleZ * 0.476,

      fromX + lineScaleX * 0.155, 0, fromZ + lineScaleZ * 0.476,
      fromX + lineScaleX * 0.294, 0, fromZ + lineScaleZ * 0.405,

      fromX + lineScaleX * 0.294, 0, fromZ + lineScaleZ * 0.405,
      fromX + lineScaleX * 0.405, 0, fromZ + lineScaleZ * 0.294,

      // top
      fromX + lineScaleX * 0.476, height, fromZ + lineScaleZ * -0.155,
      fromX + lineScaleX * 0.405, height, fromZ + lineScaleZ * -0.294,

      fromX + lineScaleX * 0.405, height, fromZ + lineScaleZ * -0.294,
      fromX + lineScaleX * 0.294, height, fromZ + lineScaleZ * -0.405,

      fromX + lineScaleX * 0.294, height, fromZ + lineScaleZ * -0.405,
      fromX + lineScaleX * 0.155, height, fromZ + lineScaleZ * -0.476,

      fromX + lineScaleX * 0.155, height, fromZ + lineScaleZ * -0.476,
      fromX + lineScaleX * 0.000, height, fromZ + lineScaleZ * -0.500,

      fromX + lineScaleX * 0.000, height, fromZ + lineScaleZ * -0.500,
      fromX + lineScaleX * -0.155, height, fromZ + lineScaleZ * -0.476,

      fromX + lineScaleX * -0.155, height, fromZ + lineScaleZ * -0.476,
      fromX + lineScaleX * -0.294, height, fromZ + lineScaleZ * -0.405,

      fromX + lineScaleX * -0.294, height, fromZ + lineScaleZ * -0.405,
      fromX + lineScaleX * -0.405, height, fromZ + lineScaleZ * -0.294,

      fromX + lineScaleX * 0.476, height, fromZ + lineScaleZ * 0.155,
      fromX + lineScaleX * 0.500, height, fromZ + lineScaleZ * 0.000,

      fromX + lineScaleX * 0.500, height, fromZ + lineScaleZ * 0.000,
      fromX + lineScaleX * 0.476, height, fromZ + lineScaleZ * -0.155,

      fromX + lineScaleX * 0.405, height, fromZ + lineScaleZ * 0.294,
      fromX + lineScaleX * 0.476, height, fromZ + lineScaleZ * 0.155,

      // side
      fromX + lineScaleX * -0.405, 0, fromZ + lineScaleZ * -0.294,
      fromX + lineScaleX * -0.405, height, fromZ + lineScaleZ * -0.294,

      fromX + lineScaleX * 0.405, 0, fromZ + lineScaleZ * 0.294,
      fromX + lineScaleX * 0.405, height, fromZ + lineScaleZ * 0.294
    ]);
  }
}
