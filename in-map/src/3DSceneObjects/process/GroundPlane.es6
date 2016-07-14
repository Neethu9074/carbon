import BaseGroundPlane from 'in-map/src/3DSceneObjects/common/GroundPlane';


export default class GroundPlane extends BaseGroundPlane {

  constructor({parent, size}) {
    super({parent, size});
  }

  onZoom() {}
}
