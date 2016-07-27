import {requestFrame, requestedFrame$} from 'in-map/stores/sceneStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import Map from 'in-map/sceneObjects/physical/Map';


export default class Scene extends SceneObject {

  constructor(parentComponent, params) {
    super(parentComponent, params);

    this.canvas = params.canvas;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.update = this.update.bind(this);

    console.log('create scene');
  }

  init() {
    super.init();
    console.log('init scene');

    this.parentComponent.addSceneObject(Map, {});
    // this.setupCanvas();
    // this.setupRenderer();
  }

  initEvents() {
    super.initEvents();
    console.log('initEvents scene');
    this.update();

    requestedFrame$.throttle(1000).subscribe(() => {
      this.parentComponent.update();
    });
  }

  update() {
    requestAnimationFrame(this.update);
    requestFrame();
  }

  dispose() {
    console.log('dispose scene');
  }
}
