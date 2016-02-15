import LineMeshComponent from '../../common/LineMeshComponent';


export default class GroundLineMeshComponent extends LineMeshComponent {
  constructor(config) {
    super(config);
  }

  positionChanged(pos) {
    super.positionChanged({
      newPosition: {
        x: pos.newPosition.x - 0.5,
        y: pos.newPosition.y,
        z: pos.newPosition.z + 0.5
      }
    });
  }

  sizeChanged({x, y, z}) {
    super.sizeChanged({x: x * 1.5, y, z: z * 1.5});
  }
}
