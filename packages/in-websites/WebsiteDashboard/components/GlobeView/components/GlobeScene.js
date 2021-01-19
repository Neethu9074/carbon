/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* global require:false */
import {
  AmbientLight,
  SphereBufferGeometry,
  PerspectiveCamera,
  Scene,
  Mesh,
  PointLight,
  Object3D,
  Vector3,
  Matrix4,
  MeshBasicMaterial,
  MeshPhongMaterial
} from 'in-map/3DLibProvider';
import HeatMapGlobe from 'in-websites/WebsiteDashboard/components/GlobeView/components/HeatMapGlobe';
import createControls from 'in-websites/WebsiteDashboard/components/GlobeView/components/Controls';
import Effects from 'in-websites/WebsiteDashboard/components/GlobeView/components/Effects';
import { loadImage } from 'in-map/services/imageLoader';

export default class GlobeScene {
  constructor(globeView, getData$, getValue, overlay) {
    this.globeView = globeView;
    this.initScene(getData$, getValue);
    this.initControls(overlay);
  }

  initScene(getData$, getValue) {
    const poi = (this.poi = new Object3D());
    const camera = (this.camera = new PerspectiveCamera(55, 1, 0.1, 10));
    camera.projection = new Matrix4();
    camera.lookAt = new Vector3();
    this.inverse = new Matrix4();

    const scene = (this.scene = new Scene());
    scene.add(camera);

    const globe = (this.globe = new Mesh(
      new SphereBufferGeometry(0.5, 75, 75),
      new MeshBasicMaterial({ color: 0x000000 })
    ));
    globe.renderOrder = 2;
    require([
      'in-websites/WebsiteDashboard/components/GlobeView/textures/diffuse.jpg',
      'in-websites/WebsiteDashboard/components/GlobeView/textures/specular.jpg',
      'in-websites/WebsiteDashboard/components/GlobeView/textures/normal.jpg'
    ], (worldDiffuseMapPath, worldSpecularMapPath, normalMapPath) => {
      globe.material.dispose();
      globe.material = new MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 5,
        map: loadImage(worldDiffuseMapPath, tex => {
          tex.needsUpdate = true;
        }),
        specularMap: loadImage(worldSpecularMapPath, tex => {
          tex.needsUpdate = true;
        }),
        normalMap: loadImage(normalMapPath, tex => {
          tex.needsUpdate = true;
        })
      });
    });

    this.effects = new Effects(poi);
    this.heatMapGlobe = new HeatMapGlobe(scene, getData$, getValue);

    const pointLight = new PointLight(0xffffff, 0.5, 8);
    pointLight.position.set(0, 0, 5);
    scene.add(new AmbientLight(0xaaaaaa));

    poi.add(pointLight);
    poi.add(camera);

    scene.add(poi);
  }

  initControls(overlay) {
    this.controls = createControls(overlay, this.camera, {
      poi: this.poi
    });
  }

  pinchUp() {
    this.controls.pinchUp();
  }

  pinchDown() {
    this.controls.pinchDown();
  }

  rotateLeft() {
    this.controls.rotateLeft();
  }

  rotateRight() {
    this.controls.rotateRight();
  }

  toggleAutoRotate() {
    this.controls.toggleAutoRotate();
  }

  toggleHeatMap(enabled) {
    if (enabled) {
      this.scene.remove(this.globe);
    } else {
      this.scene.add(this.globe);
    }
    this.heatMapGlobe.toggleHeatMap(enabled);
  }

  updateData(props) {
    this.heatMapGlobe.updateData(props);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
    this.effects.update(this.camera.position.z);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);

    this.inverse.getInverse(this.camera.matrixWorld);
    this.camera.projection.multiplyMatrices(this.camera.projectionMatrix, this.inverse);
    this.camera.getWorldDirection(this.camera.lookAt);
  }

  dispose() {
    this.heatMapGlobe.dispose();
    this.controls.dispose();
    this.effects.dispose();
    this.globe.material.dispose();
    this.globe.geometry.dispose();
  }
}
