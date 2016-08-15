import BaseHighlightingComponent from '../common/HighlightingComponent';


export default class HighlightingComponentForCylinder extends BaseHighlightingComponent {

  constructor(config) {
    super(config);
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const margin = 0.03;
    const height = scale.y + margin;
    const widthHalf = scale.x / 2;
    const depthHalf = scale.z / 2;
    const fromX = -(widthHalf + margin) + pos.x - ((1 - (2 * margin + scale.x)) / 2);
    const fromZ = (depthHalf + margin) + pos.z + ((1 - (2 * margin + scale.z)) / 2);
    const lineScaleX = (2 * margin + scale.x);
    const lineScaleZ = (2 * margin + scale.z);
    const xOffset = fromX + lineScaleX;
    const zOffset = fromZ + lineScaleZ;

    this.lineContentProvider.setLines([
      xOffset * -0.405, -margin, zOffset * -0.294,
      xOffset * -0.476, -margin, zOffset * -0.155,

      xOffset * -0.476, -margin, zOffset * -0.155,
      xOffset * -0.500, -margin, zOffset * 0.000,

      xOffset * -0.500, -margin, zOffset * 0.000,
      xOffset * -0.476, -margin, zOffset * 0.155,

      xOffset * -0.476, -margin, zOffset * 0.155,
      xOffset * -0.405, -margin, zOffset * 0.294,

      xOffset * -0.405, -margin, zOffset * 0.294,
      xOffset * -0.294, -margin, zOffset * 0.405,

      xOffset * -0.294, -margin, zOffset * 0.405,
      xOffset * -0.155, -margin, zOffset * 0.476,

      xOffset * -0.155, -margin, zOffset * 0.476,
      xOffset * -0.000, -margin, zOffset * 0.500,

      xOffset * -0.000, -margin, zOffset * 0.500,
      xOffset * 0.155, -margin, zOffset * 0.476,

      xOffset * 0.155, -margin, zOffset * 0.476,
      xOffset * 0.294, -margin, zOffset * 0.405,

      xOffset * 0.294, -margin, zOffset * 0.405,
      xOffset * 0.405, -margin, zOffset * 0.294,

      // top
      xOffset * 0.476, height, zOffset * -0.155,
      xOffset * 0.405, height, zOffset * -0.294,

      xOffset * 0.405, height, zOffset * -0.294,
      xOffset * 0.294, height, zOffset * -0.405,

      xOffset * 0.294, height, zOffset * -0.405,
      xOffset * 0.155, height, zOffset * -0.476,

      xOffset * 0.155, height, zOffset * -0.476,
      xOffset * 0.000, height, zOffset * -0.500,

      xOffset * 0.000, height, zOffset * -0.500,
      xOffset * -0.155, height, zOffset * -0.476,

      xOffset * -0.155, height, zOffset * -0.476,
      xOffset * -0.294, height, zOffset * -0.405,

      xOffset * -0.294, height, zOffset * -0.405,
      xOffset * -0.405, height, zOffset * -0.294,

      xOffset * 0.476, height, zOffset * 0.155,
      xOffset * 0.500, height, zOffset * 0.000,

      xOffset * 0.500, height, zOffset * 0.000,
      xOffset * 0.476, height, zOffset * -0.155,

      xOffset * 0.405, height, zOffset * 0.294,
      xOffset * 0.476, height, zOffset * 0.155,

      // side
      xOffset * -0.405, -margin, zOffset * -0.294,
      xOffset * -0.405, height, zOffset * -0.294,

      xOffset * 0.405, -margin, zOffset * 0.294,
      xOffset * 0.405, height, zOffset * 0.294
    ]);
  }
}
