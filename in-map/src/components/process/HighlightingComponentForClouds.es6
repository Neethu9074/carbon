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
      fromX + lineScaleX * 0.05, height, fromZ + lineScaleZ * -0.46,
      fromX + lineScaleX * 0.176, height, fromZ + lineScaleZ * -0.394,

      fromX + lineScaleX * 0.176, height, fromZ + lineScaleZ * -0.394,
      fromX + lineScaleX * 0.271, height, fromZ + lineScaleZ * -0.287,

      fromX + lineScaleX * 0.271, height, fromZ + lineScaleZ * -0.287,
      fromX + lineScaleX * 0.321, height, fromZ + lineScaleZ * -0.125,

      fromX + lineScaleX * 0.321, height, fromZ + lineScaleZ * -0.125,
      fromX + lineScaleX * 0.293, height, fromZ + lineScaleZ * 0.026,

      fromX + lineScaleX * 0.293, height, fromZ + lineScaleZ * 0.026,
      fromX + lineScaleX * 0.384, height, fromZ + lineScaleZ * 0.233,

      fromX + lineScaleX * 0.384, height, fromZ + lineScaleZ * 0.233,
      fromX + lineScaleX * 0.315, height, fromZ + lineScaleZ * 0.353,

      fromX + lineScaleX * 0.05, height, fromZ + lineScaleZ * -0.46,
      fromX + lineScaleX * -0.087, height, fromZ + lineScaleZ * -0.47,

      fromX + lineScaleX * -0.288, height, fromZ + lineScaleZ * -0.37,
      fromX + lineScaleX * -0.087, height, fromZ + lineScaleZ * -0.47,

      fromX + lineScaleX * -0.288, height, fromZ + lineScaleZ * -0.37,
      fromX + lineScaleX * -0.39, height, fromZ + lineScaleZ * -0.378,

      fromX + lineScaleX * -0.288, height, fromZ + lineScaleZ * -0.37,
      fromX + lineScaleX * -0.39, height, fromZ + lineScaleZ * -0.378,

      fromX + lineScaleX * -0.494, height, fromZ + lineScaleZ * -0.312,
      fromX + lineScaleX * -0.39, height, fromZ + lineScaleZ * -0.378,

      fromX + lineScaleX * -0.494, height, fromZ + lineScaleZ * -0.312,
      fromX + lineScaleX * -0.546, height, fromZ + lineScaleZ * -0.222,


      fromX + lineScaleX * -0.546, height, fromZ + lineScaleZ * -0.222,
      fromX + lineScaleX * -0.546, 0, fromZ + lineScaleZ * -0.222,

      fromX + lineScaleX * 0.315, height, fromZ + lineScaleZ * 0.353,
      fromX + lineScaleX * 0.315, 0, fromZ + lineScaleZ * 0.353,


      fromX + lineScaleX * -0.303, 0, fromZ + lineScaleZ * 0.153,
      fromX + lineScaleX * -0.181, 0, fromZ + lineScaleZ * 0.224,

      fromX + lineScaleX * -0.181, 0, fromZ + lineScaleZ * 0.224,
      fromX + lineScaleX * -0.062, 0, fromZ + lineScaleZ * 0.292,

      fromX + lineScaleX * -0.062, 0, fromZ + lineScaleZ * 0.292,
      fromX + lineScaleX * 0.044, 0, fromZ + lineScaleZ * 0.354,

      fromX + lineScaleX * 0.044, 0, fromZ + lineScaleZ * 0.354,
      fromX + lineScaleX * 0.089, 0, fromZ + lineScaleZ * 0.38,

      fromX + lineScaleX * 0.206, 0, fromZ + lineScaleZ * 0.409,
      fromX + lineScaleX * 0.089, 0, fromZ + lineScaleZ * 0.38,

      fromX + lineScaleX * 0.206, 0, fromZ + lineScaleZ * 0.409,
      fromX + lineScaleX * 0.315, 0, fromZ + lineScaleZ * 0.353,

      fromX + lineScaleX * -0.303, 0, fromZ + lineScaleZ * 0.153,
      fromX + lineScaleX * -0.411, 0, fromZ + lineScaleZ * 0.091,

      fromX + lineScaleX * -0.505, 0, fromZ + lineScaleZ * 0.005,
      fromX + lineScaleX * -0.411, 0, fromZ + lineScaleZ * 0.091,

      fromX + lineScaleX * -0.505, 0, fromZ + lineScaleZ * 0.005,
      fromX + lineScaleX * -0.534, 0, fromZ + lineScaleZ * -0.089,

      fromX + lineScaleX * -0.546, 0, fromZ + lineScaleZ * -0.222,
      fromX + lineScaleX * -0.534, 0, fromZ + lineScaleZ * -0.089
    ]);
  }
}
