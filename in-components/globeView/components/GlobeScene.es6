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
  MeshPhongMaterial} from 'in-map/3DLibProvider';
import {setGlobeSize} from 'in-components/globeView/stores/globeSizeStore';
import createControls from 'in-components/globeView/components/Controls';
import {loadImage} from 'in-map/services/imageLoader';


export default class GlobeScene {
  constructor(renderer) {
    this.textureLoaded = false;

    this.initScene();
    this.initControls(renderer);
  }

  initScene() {
    const scene = this.scene = new Scene();

    const poi = this.poi = new Object3D();

    const camera = this.camera = new PerspectiveCamera(75, 1, 0.1, 10);
    scene.add(camera);

    const globe = this.globe = new Mesh(
      new SphereBufferGeometry(0.5, 100, 100),
      new MeshBasicMaterial({ color: 0x000000 })
    );

    require([
      'in-components/globeView/components/diffuse.jpg',
      'in-components/globeView/components/specular.jpg',
      'in-components/globeView/components/bump.jpg'
    ], (worldDiffuseMapPath, worldSpecularMapPath, worldBumpMapPath) => {
      globe.material.dispose();
      globe.material = new MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 10,
        map: loadImage(worldDiffuseMapPath, tex => tex.needsUpdate = true),
        specularMap: loadImage(worldSpecularMapPath, tex => tex.needsUpdate = true),
        normalMap: loadImage(worldBumpMapPath, tex => tex.needsUpdate = true),
        normalScale: new Vector2(0.5, 0.5)
      });

      scene.add(globe);
    });

    const pointLight = new PointLight(0xffffff, 0.5, 4);
    pointLight.position.set(1, 1, 1);

    scene.add(new AmbientLight(0xaaaaaa));

    poi.add(pointLight);
    poi.add(camera);

    scene.add(poi);
  }

  initControls(renderer) {
    this.controls = createControls(
      renderer.domElement,
      this.camera,
      {
        poi: this.poi,
        cameraMoveSpeed: 4,
        startingWorldDistance: 0,
        startingZoomDistance: 1.1,
        maxZoomIn: 0.9,
        maxZoomOut: 1.7,
        zoomSteps: 0.15,
        zoomSpeed: 4
      }
    );
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();

    setGlobeSize(0.35 / this.camera.position.z);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.controls.dispose();

    this.globe.material.dispose();
    this.globe.geometry.dispose();
  }
}
