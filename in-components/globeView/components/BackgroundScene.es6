import StarField from 'in-components/globeView/components/StarField';
import {OrthographicCamera, Scene} from 'in-map/3DLibProvider';


export default class BackgroundScene {
  constructor() {
    this.initScene();
  }

  initScene() {
    const scene = this.scene = new Scene();

    const camera = this.camera = new OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 10);
    scene.add(camera);

    this.starField = new StarField(scene);
    scene.add(camera);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.starField.dispose();
  }
}
