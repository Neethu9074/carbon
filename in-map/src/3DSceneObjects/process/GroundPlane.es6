import BaseGroundPlane from 'in-map/src/3DSceneObjects/physical/GroundPlane';


export default class GroundPlane extends BaseGroundPlane {

  constructor({parent, size}) {
    super({parent, size});
  }

  getGroundTexture() {
    super.getGroundTexture();
    this.groundtexture.repeat.set(this.size, this.size);
  }

  onZoom() {}
}
