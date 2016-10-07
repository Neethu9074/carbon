/* global require:false */
import {
  SphereBufferGeometry,
  Mesh,
  MeshPhongMaterial} from 'in-map/3DLibProvider';
import {loadImage} from 'in-map/services/imageLoader';
import {getDeltaTime} from 'in-map/misc/time';


export default class GlobeScene {

  constructor(scene) {
    this.rotationSpeed = 0.003;

    require([
      'in-components/globeView/components/cloudAlphaMap.jpg'
    ], (cloudsAlphaPath) => {
      const clouds = this.clouds = new Mesh(
        new SphereBufferGeometry(0.504, 32, 32),
        new MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          alphaMap: loadImage(cloudsAlphaPath, tex => tex.needsUpdate = true)
        })
      );

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
    }
  }
}
