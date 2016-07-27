import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Map extends SceneObject {

  constructor(parentComponent, params) {
    super(parentComponent, params);

    console.log('create physical map');
  }

  init() {
    super.init();

    console.log('init physical map');
  }

  initEvents() {
    super.initEvents();

    console.log('initEvents physical map');
  }

  disposeEvents() {
    super.disposeEvents();

    console.log('disposeEvents physical map');
  }

  dispose() {
    super.dispose();

    console.log('dispose physical map');
  }
}
