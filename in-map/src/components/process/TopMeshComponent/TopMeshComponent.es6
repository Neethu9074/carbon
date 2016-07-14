import MeshComponent from '../../common/MeshComponent';


export default class TopMeshComponent extends MeshComponent {
  constructor(config) {
    super(config);
  }

  positionChanged(newPosition) {
    // avoid z fighting, so use height + 0.01
    this.positionToSet.set(newPosition.x, newPosition.y + 1.01, newPosition.z);
    this.needsUpdate = true;
  }

  colorChanged() {
    // do nothing to not react on colorChanged events
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
