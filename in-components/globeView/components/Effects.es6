/* global require:false */
import {
  PlaneBufferGeometry,
  Mesh,
  DoubleSide,
  MeshBasicMaterial} from 'in-map/3DLibProvider';
import {resourceLoaded} from 'in-components/globeView/stores/isLoadingStore';
import {loadImage} from 'in-map/services/imageLoader';


export default class Effects {

  constructor(parent) {
    require([
      'in-components/globeView/components/globeEffectMap.png'
    ], (effectMapPath) => {
      const effectPlane = this.effectPlane = new Mesh(
        new PlaneBufferGeometry(1, 1, 1, 1),
        new MeshBasicMaterial({
          color: 0xffffff,
          side: DoubleSide,
          transparent: true,
          depthWrite: false,
          map: loadImage(effectMapPath, tex => {
            tex.needsUpdate = true;
            resourceLoaded('globeEffectMap');
          })
        })
      );

      effectPlane.renderOrder = 10;
      parent.add(effectPlane);
    });
  }

  // polynomal function, calculated by discrete point observations with an error of 10^-5
  getScaleFromDistance(x) {
    const x2 = x * x;
    const x3 = x2 * x;
    return 0.1602564088 * x3 * x
           - 1.130730373 * x3
           + 3.043502314 * x2
           - 3.764695004 * x
           + 3.075177139;
  }

  update(camDistance) {
    if (this.effectPlane) {
      const l = this.getScaleFromDistance(camDistance);
      this.effectPlane.scale.set(l, l, l);
    }
  }

  dispose() {
    if (this.effectPlane) {
      this.effectPlane.material.dispose();
      this.effectPlane.geometry.dispose();
      this.effectPlane = null;
    }
  }
}
