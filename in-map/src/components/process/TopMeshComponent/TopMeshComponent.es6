import MeshComponent from '../../common/MeshComponent';


export default class TopMeshComponent extends MeshComponent {
  constructor(config) {
    super(config);

    // avoid z fighting, so use height + 0.01
    this.height = config.height + 0.01;
  }

  positionChanged(newPosition) {
    this.positionToSet.set(newPosition.x, newPosition.y + this.height, newPosition.z);
    this.needsUpdate = true;
  }

  sizeChanged({x, y, z}) {
    const scale = this.scaleToSet;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet.set(x * 0.9, y, z * 0.9);
    this.needsUpdate = true;
  }
}
