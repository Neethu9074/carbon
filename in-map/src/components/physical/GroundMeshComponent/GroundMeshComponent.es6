import MeshComponent from '../../common/MeshComponent';


export default class GroundMeshComponent extends MeshComponent {
  constructor(config) {
    super(config);
  }

  sizeChanged({x, y, z}) {
    super.sizeChanged({x: x * 1.5, y, z: z * 1.5});
  }
}
