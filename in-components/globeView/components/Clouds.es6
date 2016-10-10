/* global require:false */
import {
  SphereBufferGeometry,
  Mesh,
  MeshBasicMaterial} from 'in-map/3DLibProvider';
import {loadImage} from 'in-map/services/imageLoader';
import {getDeltaTime} from 'in-map/misc/time';


export default class Clouds {

  constructor(scene) {
    this.rotationSpeed = 0.005;

    require([
      'in-components/globeView/components/cloudAlphaMap.jpg'
    ], (cloudsAlphaPath) => {
      const clouds = this.clouds = new Mesh(
        new SphereBufferGeometry(0.504, 32, 32),
        new MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          alphaMap: loadImage(cloudsAlphaPath, tex => tex.needsUpdate = true)
        })
      );

      clouds.renderOrder = 3;
      scene.add(clouds);
    });
  }

  update() {
    const dt = getDeltaTime();

    if (this.clouds) {
      this.clouds.rotateX(dt * this.rotationSpeed);
      this.clouds.rotateY(dt * this.rotationSpeed);
    }
  }

  dispose() {
    if (this.clouds) {
      this.clouds.material.dispose();
      this.clouds.geometry.dispose();
      this.clouds = null;
    }
  }
}
