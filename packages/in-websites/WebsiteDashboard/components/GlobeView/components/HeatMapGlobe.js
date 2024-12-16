/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* global require:false */
import { create } from '@instana/observables';

import countryMap from 'in-websites/WebsiteDashboard/components/GlobeView/components/countryConfig.json';
import { LinearFilter, Texture, SphereGeometry, Mesh, MeshBasicMaterial } from 'in-map/3DLibProvider';
import getHeatMapColor, { lightGreenToDarkGreenRgb } from 'in-themes/heatMapColors';
import { copyCanvasIntoShort } from 'in-components/Chart/canvas';
import { rgbToHex } from 'in-services/formatters/color';

export default class HeatMapGlobe {
  constructor(scene, getData$, getValue) {
    this.scene = scene;
    this.properties$ = create();

    this.initScene();

    // Note: Due to the way require(…) is transpiled arrow functions do not properly work here.
    // We therefore have to explicitly remember the value of 'this' :sadpanda:.
    const self = this;
    require([
      'in-websites/WebsiteDashboard/components/GlobeView/textures/diffuseGrayScale.jpg'
    ], worldDiffuseGrayScaleMapPath => {
      const image = new Image();
      image.onload = () => {
        var texture = new Texture(self.canvas);
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        self.globe.material.map = texture;

        self.data$ = self.properties$.flatMap(getData$).subscribe(countryBreakdownResult => {
          const data = countryBreakdownResult.data;
          if (!data) {
            return;
          }

          copyCanvasIntoShort(image, self.ctx, 0, 0, 4096, 2048);

          let min = null;
          let max = null;
          data.items.forEach(item => {
            const value = getValue(item);

            if (min == null) {
              min = value;
            } else {
              min = Math.min(min, value);
            }

            if (max == null) {
              max = value;
            } else {
              max = Math.max(max, value);
            }
          });

          for (let i = 0; i < data.items.length; i++) {
            const { country } = data.items[i];
            const value = getValue(data.items[i]);
            const countryDefinition = findCountryConfigByLabel(country);
            if (!countryDefinition) {
              continue;
            }

            const intensity = Math.max(1, value - min) / Math.max(1, max - min);
            const color = getHeatMapColor(intensity, lightGreenToDarkGreenRgb);
            self.ctx.fillStyle = rgbToHex(color.r * 255, color.g * 255, color.b * 255);

            for (let i = 0; i < countryDefinition.paths.length; i++) {
              self.ctx.setTransform(2, 0, 0, 2, 0, 0);
              const p = new Path2D(countryDefinition.paths[i]);
              self.ctx.fill(p);
            }
          }
          self.ctx.setTransform(1, 0, 0, 1, 0, 0);
          texture.needsUpdate = true;
          self.scene.add(self.globe);
        });
      };
      image.src = worldDiffuseGrayScaleMapPath;
    });
  }

  initScene() {
    const canvas = (this.canvas = document.createElement('canvas'));
    canvas.width = 4096;
    canvas.height = 2048;
    this.ctx = canvas.getContext('2d');

    const globe = (this.globe = new Mesh(new SphereGeometry(0.5, 75, 75), new MeshBasicMaterial({ color: 0xffffff })));
    globe.renderOrder = 2;
  }

  toggleHeatMap(enabled) {
    if (enabled) {
      this.scene.add(this.globe);
    } else {
      this.scene.remove(this.globe);
    }
  }

  updateData(props) {
    this.properties$.emit(props);
  }

  dispose() {
    if (this.data$) {
      this.data$.dispose();
      this.data$ = null;
    }

    this.globe.material.dispose();
    this.globe.geometry.dispose();
  }
}

function findCountryConfigByLabel(countryLabel) {
  const configs = Object.keys(countryMap).map(key => countryMap[key]);
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    if (config.label === countryLabel) {
      return config;
    }
  }
  return null;
}
