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
      'in-components/globeView/components/textures/globeOverlayEffectMap.png',
      'in-components/globeView/components/textures/globeOuterGlowEffectMap.png'
    ], (overlayMapPath, outerGlowMapPath) => {
      const planeGeometry = this.planeGeometry = new PlaneBufferGeometry(1.2929, 1.2929, 1, 1);

      const effectPlaneOuterGlow = this.effectPlaneOuterGlow = new Mesh(
        planeGeometry,
        new MeshBasicMaterial({
          color: 0xffffff,
          side: DoubleSide,
          transparent: true,
          depthWrite: false,
          map: loadImage(outerGlowMapPath, tex => {
            tex.needsUpdate = true;
            resourceLoaded('globeEffectOuterGlowMap');
          })
        })
      );

      effectPlaneOuterGlow.renderOrder = 10;
      parent.add(effectPlaneOuterGlow);

      const effectPlaneOverlay = this.effectPlaneOverlay = new Mesh(
        planeGeometry,
        new MeshBasicMaterial({
          color: 0xffffff,
          side: DoubleSide,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          map: loadImage(overlayMapPath, tex => {
            tex.needsUpdate = true;
            resourceLoaded('globeEffectOverlayMap');
          })
        })
      );

      effectPlaneOverlay.renderOrder = 11;
      parent.add(effectPlaneOverlay);
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
    const l = this.getScaleFromDistance(camDistance);

    if (this.effectPlaneOverlay) {
      this.effectPlaneOverlay.scale.set(l, l, l);
    }

    if (this.effectPlaneOuterGlow) {
      this.effectPlaneOuterGlow.scale.set(l, l, l);
    }
  }

  dispose() {
    if (this.planeGeometry) {
      this.planeGeometry.dispose();
      this.planeGeometry = null;
    }
    if (this.effectPlaneOverlay) {
      this.effectPlaneOverlay.material.dispose();
      this.effectPlaneOverlay = null;
    }
    if (this.effectPlaneOuterGlow) {
      this.effectPlaneOuterGlow.material.dispose();
      this.effectPlaneOuterGlow = null;
    }
  }
}
