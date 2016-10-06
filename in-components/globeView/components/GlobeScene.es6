/* global require:false */
import {
  SphereBufferGeometry,
  PerspectiveCamera,
  Scene,
  Mesh,
  MeshBasicMaterial} from 'in-map/3DLibProvider';
import {setGlobeSize} from 'in-components/globeView/stores/globeSizeStore';
import createControls from 'in-components/graphView/components/Controls';
import {loadImage} from 'in-map/services/imageLoader';


export default class GlobeScene {
  constructor(renderer) {
    this.camera = new PerspectiveCamera(90, 1, 1, 100);
    this.scene = new Scene();

    this.controls = createControls(
      renderer.domElement,
      this.camera,
      {
        cameraMoveSpeed: 4,
        startingWorldDistance: 0,
        startingZoomDistance: 20,
        maxZoomIn: 17,
        maxZoomOut: 22,
        zoomSpeed: 5
      }
    );

    require(['in-components/globeView/components/world.jpg'], (worldDiffuseMapPath) => {
      const globe = new Mesh(
        new SphereBufferGeometry(10, 32, 32),
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
    setGlobeSize(5.5 / this.camera.position.z);
  }

  dispose() {
    this.controls.dispose();
  }
}
