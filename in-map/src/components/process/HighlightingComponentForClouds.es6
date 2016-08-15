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
      xOffset * -0.008, -margin, zOffset * 0.285,
      xOffset * -0.066, -margin, zOffset * 0.251,

      xOffset * -0.132, -margin, zOffset * 0.213,
      xOffset * -0.066, -margin, zOffset * 0.251,

      xOffset * -0.132, -margin, zOffset * 0.213,
      xOffset * -0.207, -margin, zOffset * 0.17,

      xOffset * -0.282, -margin, zOffset * 0.127,
      xOffset * -0.207, -margin, zOffset * 0.17,

      xOffset * -0.282, -margin, zOffset * 0.127,
      xOffset * -0.362, -margin, zOffset * 0.08,

      xOffset * -0.406, -margin, zOffset * 0.055,
      xOffset * -0.362, -margin, zOffset * 0.08,

      xOffset * -0.406, -margin, zOffset * 0.055,
      xOffset * -0.433, -margin, zOffset * 0.03,

      xOffset * -0.474, -margin, zOffset * -0.013,
      xOffset * -0.433, -margin, zOffset * 0.03,

      xOffset * -0.474, -margin, zOffset * -0.013,
      xOffset * -0.496, -margin, zOffset * -0.076,

      xOffset * -0.483, -margin, zOffset * -0.169,
      xOffset * -0.496, -margin, zOffset * -0.076,

      xOffset * 0.052, -margin, zOffset * 0.32,
      xOffset * -0.008, -margin, zOffset * 0.285,

      xOffset * 0.052, -margin, zOffset * 0.32,
      xOffset * 0.118, -margin, zOffset * 0.358,

      xOffset * 0.189, -margin, zOffset * 0.399,
      xOffset * 0.118, -margin, zOffset * 0.358,

      xOffset * 0.189, -margin, zOffset * 0.399,
      xOffset * 0.246, -margin, zOffset * 0.432,

      xOffset * 0.261, -margin, zOffset * 0.439,
      xOffset * 0.246, -margin, zOffset * 0.432,

      xOffset * 0.261, -margin, zOffset * 0.439,
      xOffset * 0.312, -margin, zOffset * 0.446,

      xOffset * 0.385, -margin, zOffset * 0.422,
      xOffset * 0.312, -margin, zOffset * 0.446,

      xOffset * 0.385, -margin, zOffset * 0.422,
      xOffset * 0.436, -margin, zOffset * 0.386,


      xOffset * 0.251, height, zOffset * -0.3,
      xOffset * 0.269, height, zOffset * -0.195,

      xOffset * 0.251, height, zOffset * -0.3,
      xOffset * 0.206, height, zOffset * -0.373,

      xOffset * 0.137, height, zOffset * -0.427,
      xOffset * 0.206, height, zOffset * -0.373,

      xOffset * 0.137, height, zOffset * -0.427,
      xOffset * 0.055, height, zOffset * -0.458,

      xOffset * -0.054, height, zOffset * -0.453,
      xOffset * 0.055, height, zOffset * -0.458,

      xOffset * -0.054, height, zOffset * -0.453,
      xOffset * -0.133, height, zOffset * -0.418,

      xOffset * -0.25, height, zOffset * -0.286,
      xOffset * -0.133, height, zOffset * -0.418,

      xOffset * -0.25, height, zOffset * -0.286,
      xOffset * -0.308, height, zOffset * -0.299,

      xOffset * -0.375, height, zOffset * -0.287,
      xOffset * -0.308, height, zOffset * -0.299,

      xOffset * -0.375, height, zOffset * -0.287,
      xOffset * -0.448, height, zOffset * -0.23,

      xOffset * -0.483, height, zOffset * -0.169,
      xOffset * -0.448, height, zOffset * -0.23,

      xOffset * 0.338, height, zOffset * -0.174,
      xOffset * 0.269, height, zOffset * -0.195,

      xOffset * 0.338, height, zOffset * -0.174,
      xOffset * 0.402, height, zOffset * -0.133,

      xOffset * 0.456, height, zOffset * -0.061,
      xOffset * 0.402, height, zOffset * -0.133,

      xOffset * 0.456, height, zOffset * -0.061,
      xOffset * 0.475, height, zOffset * 0.037,

      xOffset * 0.442, height, zOffset * 0.125,
      xOffset * 0.475, height, zOffset * 0.037,

      xOffset * 0.442, height, zOffset * 0.125,
      xOffset * 0.476, height, zOffset * 0.161,

      xOffset * 0.492, height, zOffset * 0.237,
      xOffset * 0.476, height, zOffset * 0.161,

      xOffset * 0.492, height, zOffset * 0.237,
      xOffset * 0.487, height, zOffset * 0.299,

      xOffset * 0.436, height, zOffset * 0.386,
      xOffset * 0.487, height, zOffset * 0.299,


      xOffset * -0.483, -margin, zOffset * -0.169,
      xOffset * -0.483, height, zOffset * -0.169,

      xOffset * 0.436, -margin, zOffset * 0.386,
      xOffset * 0.436, height, zOffset * 0.386
    ]);
  }
}
