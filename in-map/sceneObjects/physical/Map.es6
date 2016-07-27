import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Map extends SceneObject {

  constructor(parentComponent, params) {
    super(parentComponent, params);

    console.log('create map');
  }

  init() {
    super.init();
    console.log('init map');
  }

  initEvents() {
    super.initEvents();
    console.log('initEvents map');
  }

  dispose() {
    console.log('dispose map');
  }
}
