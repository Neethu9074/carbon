/* global require:false */
import {
  SphereBufferGeometry,
  PerspectiveCamera,
  Scene,
  Mesh,
  MeshBasicMaterial} from 'in-map/3DLibProvider';
import createControls from 'in-components/graphView/components/Controls';
import {loadImage} from 'in-map/services/imageLoader';


export default class GlobeScene {
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
        maxZoomIn: 15,
        maxZoomOut: 40,
        zoomSpeed: 5
      }
    );

    require(['in-components/globeView/components/world.jpg'], (worldDiffuseMapPath) => {
      const globe = new Mesh(
        new SphereBufferGeometry(9, 32, 32),
        new MeshBasicMaterial({
          color: 0xffffff,
          map: loadImage(worldDiffuseMapPath, tex => tex.needsUpdate = true)
        })
      );

      this.scene.add(globe);
    });
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  realtimeUpdate() {
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
  }
}
