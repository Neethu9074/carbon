/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* global require:false */
import { PlaneBufferGeometry, Mesh, DoubleSide, MeshBasicMaterial } from 'in-map/3DLibProvider';
import { loadImage } from 'in-map/services/imageLoader';

export default class Effects {
  constructor(parent) {
    // Note: Due to the way require(…) is transpiled arrow functions do not properly work here.
    // We therefore have to explicitly remember the value of 'this' :sadpanda:.
    const self = this;
    require([
      'in-websites/WebsiteDashboard/components/GlobeView/textures/globeOverlayEffectMap.png',
      'in-websites/WebsiteDashboard/components/GlobeView/textures/globeOuterGlowEffectMap.png'
    ], (overlayMapPath, outerGlowMapPath) => {
      const planeGeometry = (self.planeGeometry = new PlaneBufferGeometry(1.2929, 1.2929, 1, 1));

      const effectPlaneOuterGlow = (self.effectPlaneOuterGlow = new Mesh(
        planeGeometry,
        new MeshBasicMaterial({
          color: 0xffffff,
          side: DoubleSide,
          transparent: true,
          depthWrite: false,
          map: loadImage(outerGlowMapPath, tex => {
            tex.needsUpdate = true;
          })
        })
      ));

      effectPlaneOuterGlow.renderOrder = 10;
      parent.add(effectPlaneOuterGlow);

      const effectPlaneOverlay = (self.effectPlaneOverlay = new Mesh(
        planeGeometry,
        new MeshBasicMaterial({
          color: 0xffffff,
          side: DoubleSide,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          map: loadImage(overlayMapPath, tex => {
            tex.needsUpdate = true;
          })
        })
      ));

      effectPlaneOverlay.renderOrder = 11;
      parent.add(effectPlaneOverlay);
    });
  }

  // polynomal function, calculated by discrete point observations with an error of 10^-5
  getScaleFromDistance(x) {
    const x2 = x * x;
    const x3 = x2 * x;
    return 0.1602564088 * x3 * x - 1.130730373 * x3 + 3.043502314 * x2 - 3.764695004 * x + 3.075177139;
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
