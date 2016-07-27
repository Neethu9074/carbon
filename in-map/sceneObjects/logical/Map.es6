import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Map extends SceneObject {

  constructor(parentComponent, params) {
    super(parentComponent, params);

    console.log('create logical map');
  }

  init() {
    super.init();

    console.log('init logical map');
  }

  initEvents() {
    super.initEvents();

    console.log('initEvents logical map');
  }

  disposeEvents() {
    super.disposeEvents();

    console.log('disposeEvents logical map');
  }

  dispose() {
    super.dispose();

    console.log('dispose logical map');
  }
}
