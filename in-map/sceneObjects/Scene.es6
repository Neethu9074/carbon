import {requestFrame, requestedFrame$} from 'in-map/stores/sceneStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Scene extends SceneObject {

  constructor(params) {
    super(params);

    this.canvas = params.canvas;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.handleAnimationFrames = this.handleAnimationFrames.bind(this);

    console.log('create scene');
  }

  init() {
    super.init();
    console.log('init scene');
  }

  initEvents() {
    super.initEvents();
    console.log('initEvents scene');
    this.handleAnimationFrames();

    requestedFrame$.throttle(5000).subscribe(frame => {
      this.update();
      this.render(frame);
    });
  }

  handleAnimationFrames() {
    requestAnimationFrame(this.handleAnimationFrames);
    requestFrame();
  }

  update() {
    console.log('update scene');
  }

  render(frame) {
    console.log('render frame', frame);
  }

  dispose() {
    console.log('dispose scene');
  }
}
