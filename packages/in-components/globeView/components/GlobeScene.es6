/* global require:false */
import {
  AmbientLight,
  SphereBufferGeometry,
  PerspectiveCamera,
  Scene,
  Mesh,
  PointLight,
  Vector2,
  Object3D,
  MeshBasicMaterial,
  MeshPhongMaterial
} from 'in-map/3DLibProvider';
import { resourceLoaded } from 'in-components/globeView/stores/isLoadingStore';
import GlobeOverlay from 'in-components/globeView/components/GlobeOverlay';
import createControls from 'in-components/globeView/components/Controls';
import Effects from 'in-components/globeView/components/Effects';
import Clouds from 'in-components/globeView/components/Clouds';
import Traces from 'in-components/globeView/components/Traces';
import { loadImage } from 'in-map/services/imageLoader';

export default class GlobeScene {
  constructor(renderer) {
    this.initScene();
    this.initControls(renderer);
  }

  initScene() {
    const scene = (this.scene = new Scene());

    const poi = (this.poi = new Object3D());

    const camera = (this.camera = new PerspectiveCamera(65, 1, 0.1, 10));
    scene.add(camera);

    const globe = (this.globe = new Mesh(
      new SphereBufferGeometry(0.5, 100, 100),
      new MeshBasicMaterial({
        color: 0x000000
      })
    ));
    globe.renderOrder = 2;

    require([
      'in-components/globeView/components/textures/diffuse.jpg',
      'in-components/globeView/components/textures/specular.jpg',
      'in-components/globeView/components/textures/bump.jpg'
    ], (worldDiffuseMapPath, worldSpecularMapPath, worldBumpMapPath) => {
      globe.material.dispose();
      globe.material = new MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 10,
        map: loadImage(worldDiffuseMapPath, tex => {
          tex.needsUpdate = true;
          resourceLoaded('globeDiffuseMap');
        }),
        specularMap: loadImage(worldSpecularMapPath, tex => {
          tex.needsUpdate = true;
          resourceLoaded('globeSpecularMap');
        }),
        normalMap: loadImage(worldBumpMapPath, tex => {
          tex.needsUpdate = true;
          resourceLoaded('globeNormalMap');
        }),
        normalScale: new Vector2(0.5, 0.5)
      });

      scene.add(globe);
    });

    this.traces = new Traces(scene);
    this.clouds = new Clouds(scene);
    this.effects = new Effects(poi);
    this.globeOverlay = new GlobeOverlay(scene);

    const pointLight = new PointLight(0xffffff, 0.55, 4);
    pointLight.position.set(1, 1, 1);

    scene.add(new AmbientLight(0xaaaaaa));

    poi.add(pointLight);
    poi.add(camera);

    scene.add(poi);
  }

  initControls(renderer) {
    this.controls = createControls(renderer.domElement, this.camera, {
      poi: this.poi
    });
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();

    this.clouds.update();
    this.globeOverlay.update(this.camera);
    this.effects.update(this.camera.position.z);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.controls.dispose();

    this.traces.dispose();
    this.effects.dispose();
    this.clouds.dispose();
    this.globeOverlay.dispose();
    this.globe.material.dispose();
    this.globe.geometry.dispose();
  }
}
