import BaseGroundPlane from '../common/GroundPlane';


export default class GroundPlane extends BaseGroundPlane {

  constructor({parent, size}) {
    super({parent, size});

    this.addSceneObject(this.ground);
  }
}
