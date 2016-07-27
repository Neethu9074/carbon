import Subscriber from 'in-map/sceneObjects/Subscriber';


export default class SceneObject extends Subscriber {

  constructor(id) {
    super();

    this.id = id;
    console.log('create', id);
  }

  init() {
    console.log('init', this.id);
  }

  initEvents() {
    console.log('initEvents', this.id);
  }

  disposeEvents() {
    console.log('disposeEvents', this.id);

    super.dispose();
  }

  dispose() {
    console.log('dispose', this.id);

    this.id = null;
  }
}
