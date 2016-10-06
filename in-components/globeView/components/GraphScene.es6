import createControls from 'in-components/graphView/components/Controls';
import {PerspectiveCamera, Scene} from 'in-map/3DLibProvider';


export default class GraphScene {
  constructor(renderer) {
    this.camera = new PerspectiveCamera(75, 1, 1, 1000);
    this.scene = new Scene();

    this.controls = createControls(
      renderer.domElement,
      this.camera,
      {
        cameraMoveSpeed: 4,
        startingWorldDistance: 0,
        startingZoomDistance: 30,
        zoomSpeed: 5
      }
    );
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  updateGeometry() {
  }

  realtimeUpdate() {
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
  }
}
