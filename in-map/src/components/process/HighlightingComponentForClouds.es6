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
      fromX + lineScaleX * -0.008, 0, fromZ + lineScaleZ * 0.285,
      fromX + lineScaleX * -0.066, 0, fromZ + lineScaleZ * 0.251,

      fromX + lineScaleX * -0.132, 0, fromZ + lineScaleZ * 0.213,
      fromX + lineScaleX * -0.066, 0, fromZ + lineScaleZ * 0.251,

      fromX + lineScaleX * -0.132, 0, fromZ + lineScaleZ * 0.213,
      fromX + lineScaleX * -0.207, 0, fromZ + lineScaleZ * 0.17,

      fromX + lineScaleX * -0.282, 0, fromZ + lineScaleZ * 0.127,
      fromX + lineScaleX * -0.207, 0, fromZ + lineScaleZ * 0.17,

      fromX + lineScaleX * -0.282, 0, fromZ + lineScaleZ * 0.127,
      fromX + lineScaleX * -0.362, 0, fromZ + lineScaleZ * 0.08,

      fromX + lineScaleX * -0.406, 0, fromZ + lineScaleZ * 0.055,
      fromX + lineScaleX * -0.362, 0, fromZ + lineScaleZ * 0.08,

      fromX + lineScaleX * -0.406, 0, fromZ + lineScaleZ * 0.055,
      fromX + lineScaleX * -0.433, 0, fromZ + lineScaleZ * 0.03,

      fromX + lineScaleX * -0.474, 0, fromZ + lineScaleZ * -0.013,
      fromX + lineScaleX * -0.433, 0, fromZ + lineScaleZ * 0.03,

      fromX + lineScaleX * -0.474, 0, fromZ + lineScaleZ * -0.013,
      fromX + lineScaleX * -0.496, 0, fromZ + lineScaleZ * -0.076,

      fromX + lineScaleX * -0.483, 0, fromZ + lineScaleZ * -0.169,
      fromX + lineScaleX * -0.496, 0, fromZ + lineScaleZ * -0.076,

      fromX + lineScaleX * 0.052, 0, fromZ + lineScaleZ * 0.32,
      fromX + lineScaleX * -0.008, 0, fromZ + lineScaleZ * 0.285,

      fromX + lineScaleX * 0.052, 0, fromZ + lineScaleZ * 0.32,
      fromX + lineScaleX * 0.118, 0, fromZ + lineScaleZ * 0.358,

      fromX + lineScaleX * 0.189, 0, fromZ + lineScaleZ * 0.399,
      fromX + lineScaleX * 0.118, 0, fromZ + lineScaleZ * 0.358,

      fromX + lineScaleX * 0.189, 0, fromZ + lineScaleZ * 0.399,
      fromX + lineScaleX * 0.246, 0, fromZ + lineScaleZ * 0.432,

      fromX + lineScaleX * 0.261, 0, fromZ + lineScaleZ * 0.439,
      fromX + lineScaleX * 0.246, 0, fromZ + lineScaleZ * 0.432,

      fromX + lineScaleX * 0.261, 0, fromZ + lineScaleZ * 0.439,
      fromX + lineScaleX * 0.312, 0, fromZ + lineScaleZ * 0.446,

      fromX + lineScaleX * 0.385, 0, fromZ + lineScaleZ * 0.422,
      fromX + lineScaleX * 0.312, 0, fromZ + lineScaleZ * 0.446,

      fromX + lineScaleX * 0.385, 0, fromZ + lineScaleZ * 0.422,
      fromX + lineScaleX * 0.436, 0, fromZ + lineScaleZ * 0.386,


      fromX + lineScaleX * 0.251, height, fromZ + lineScaleZ * -0.3,
      fromX + lineScaleX * 0.269, height, fromZ + lineScaleZ * -0.195,

      fromX + lineScaleX * 0.251, height, fromZ + lineScaleZ * -0.3,
      fromX + lineScaleX * 0.206, height, fromZ + lineScaleZ * -0.373,

      fromX + lineScaleX * 0.137, height, fromZ + lineScaleZ * -0.427,
      fromX + lineScaleX * 0.206, height, fromZ + lineScaleZ * -0.373,

      fromX + lineScaleX * 0.137, height, fromZ + lineScaleZ * -0.427,
      fromX + lineScaleX * 0.055, height, fromZ + lineScaleZ * -0.458,

      fromX + lineScaleX * -0.054, height, fromZ + lineScaleZ * -0.453,
      fromX + lineScaleX * 0.055, height, fromZ + lineScaleZ * -0.458,

      fromX + lineScaleX * -0.054, height, fromZ + lineScaleZ * -0.453,
      fromX + lineScaleX * -0.133, height, fromZ + lineScaleZ * -0.418,

      fromX + lineScaleX * -0.25, height, fromZ + lineScaleZ * -0.286,
      fromX + lineScaleX * -0.133, height, fromZ + lineScaleZ * -0.418,

      fromX + lineScaleX * -0.25, height, fromZ + lineScaleZ * -0.286,
      fromX + lineScaleX * -0.308, height, fromZ + lineScaleZ * -0.299,

      fromX + lineScaleX * -0.375, height, fromZ + lineScaleZ * -0.287,
      fromX + lineScaleX * -0.308, height, fromZ + lineScaleZ * -0.299,

      fromX + lineScaleX * -0.375, height, fromZ + lineScaleZ * -0.287,
      fromX + lineScaleX * -0.448, height, fromZ + lineScaleZ * -0.23,

      fromX + lineScaleX * -0.483, height, fromZ + lineScaleZ * -0.169,
      fromX + lineScaleX * -0.448, height, fromZ + lineScaleZ * -0.23,

      fromX + lineScaleX * 0.338, height, fromZ + lineScaleZ * -0.174,
      fromX + lineScaleX * 0.269, height, fromZ + lineScaleZ * -0.195,

      fromX + lineScaleX * 0.338, height, fromZ + lineScaleZ * -0.174,
      fromX + lineScaleX * 0.402, height, fromZ + lineScaleZ * -0.133,

      fromX + lineScaleX * 0.456, height, fromZ + lineScaleZ * -0.061,
      fromX + lineScaleX * 0.402, height, fromZ + lineScaleZ * -0.133,

      fromX + lineScaleX * 0.456, height, fromZ + lineScaleZ * -0.061,
      fromX + lineScaleX * 0.475, height, fromZ + lineScaleZ * 0.037,

      fromX + lineScaleX * 0.442, height, fromZ + lineScaleZ * 0.125,
      fromX + lineScaleX * 0.475, height, fromZ + lineScaleZ * 0.037,

      fromX + lineScaleX * 0.442, height, fromZ + lineScaleZ * 0.125,
      fromX + lineScaleX * 0.476, height, fromZ + lineScaleZ * 0.161,

      fromX + lineScaleX * 0.492, height, fromZ + lineScaleZ * 0.237,
      fromX + lineScaleX * 0.476, height, fromZ + lineScaleZ * 0.161,

      fromX + lineScaleX * 0.492, height, fromZ + lineScaleZ * 0.237,
      fromX + lineScaleX * 0.487, height, fromZ + lineScaleZ * 0.299,

      fromX + lineScaleX * 0.436, height, fromZ + lineScaleZ * 0.386,
      fromX + lineScaleX * 0.487, height, fromZ + lineScaleZ * 0.299,


      fromX + lineScaleX * -0.483, 0, fromZ + lineScaleZ * -0.169,
      fromX + lineScaleX * -0.483, height, fromZ + lineScaleZ * -0.169,

      fromX + lineScaleX * 0.436, 0, fromZ + lineScaleZ * 0.386,
      fromX + lineScaleX * 0.436, height, fromZ + lineScaleZ * 0.386
    ]);
  }
}
