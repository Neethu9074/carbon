import MeshComponent from '../../common/MeshComponent';


export default class TopMeshComponent extends MeshComponent {
  constructor(config) {
    super(config);
  }

  positionChanged(newPosition) {
    // avoid z fighting, so use height + 0.01
    this.positionToSet.set(newPosition.x, newPosition.y + 0.251, newPosition.z);
    this.needsUpdate = true;
  }

  colorChanged() {
    // do nothing to not react on colorChanged events
  }
}
