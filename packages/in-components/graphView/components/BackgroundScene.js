/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  PlaneBufferGeometry,
  OrthographicCamera,
  MeshBasicMaterial,
  LinearFilter,
  DoubleSide,
  Scene,
  Mesh
} from 'in-map/3DLibProvider';
import galaxyImagePath from 'in-components/graphView/components/background.jpg';
import { loadImage } from 'in-map/services/imageLoader';

export default class BackgroundScene {
  constructor() {
    this.backgroundCamera = new OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 10);
    this.backgroundScene = new Scene();

    const material = new MeshBasicMaterial({
      side: DoubleSide,
      depthWrite: false
    });

    const plane = (this.plane = new Mesh(new PlaneBufferGeometry(1, 1, 1, 1, 1, 1), material));

    plane.rotationAutoUpdate = false;
    plane.matrixAutoUpdate = false;
    plane.frustumCulled = false;
    plane.position.set(0, 0, -1);
    plane.updateMatrix();

    this.backgroundScene.add(plane);

    const texture = loadImage(galaxyImagePath, loadedTexture => {
      loadedTexture.needsUpdate = true;
    });

    texture.minFilter = LinearFilter;
    material.map = texture;
  }

  render(renderer) {
    renderer.render(this.backgroundScene, this.backgroundCamera);
  }

  dispose() {
    // TODO
  }
}
