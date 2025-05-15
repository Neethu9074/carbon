/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Mesh, PlaneBufferGeometry, DoubleSide, MeshBasicMaterial } from 'in-map/3DLibProvider';
import { OrthographicCamera, Scene, LinearFilter } from 'in-map/3DLibProvider';
import { loadImage } from 'in-map/services/imageLoader';

export default class BackgroundScene {
  constructor() {
    this.initScene();
  }

  initScene() {
    const scene = (this.scene = new Scene());

    const camera = (this.camera = new OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 10));
    camera.position.z = 1;
    scene.add(camera);

    const plane = (this.plane = new Mesh(
      new PlaneBufferGeometry(1.2, 0.6, 1, 1),
      new MeshBasicMaterial({
        color: 0xffffff,
        side: DoubleSide,
        depthWrite: false
      })
    ));
    plane.rotateX(Math.PI);
    plane.rotationAutoUpdate = false;
    plane.matrixAutoUpdate = false;
    plane.frustumCulled = false;
    plane.renderOrder = 1;
    require(['in-websites/WebsiteDashboard/components/GlobeView/textures/background.jpg'], worldDiffuseMapPath => {
      plane.material.map = loadImage(worldDiffuseMapPath, tex => {
        tex.minFilter = LinearFilter;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
      });
      scene.add(plane);
    });

    scene.add(camera);
  }

  resize(width, height) {
    let aspect = height / width;
    if (aspect > 1) {
      let aspect = width / height;
      this.camera.top = -0.5;
      this.camera.bottom = 0.5;
      this.camera.left = this.camera.top * aspect;
      this.camera.right = this.camera.bottom * aspect;
    } else {
      this.camera.left = -0.5;
      this.camera.right = 0.5;
      this.camera.top = this.camera.left * aspect;
      this.camera.bottom = this.camera.right * aspect;
    }

    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.camera.updateProjectionMatrix();
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.plane) {
      this.plane.geometry.dispose();
      this.plane.material.dispose();
      this.plane = null;
    }
  }
}
