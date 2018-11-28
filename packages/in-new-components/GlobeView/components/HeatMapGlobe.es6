/* global require:false */
import { create } from 'reactive-observables';

import { LinearFilter, Texture, SphereBufferGeometry, Mesh, MeshBasicMaterial } from 'in-map/3DLibProvider';
import { findCountryConfigByLabel } from 'in-new-components/GlobeView/components/countryConfig';
import { heatMapColorScaleRgb } from 'in-new-components/GlobeView/components/heatMapConfig';
import { rgbToHex } from 'in-services/formatters/color';
import getHeatMapColor from 'in-services/heatMapColors';

export default class HeatMapGlobe {
  constructor(scene, getData$) {
    this.scene = scene;
    this.properties$ = create();

    this.initScene();

    require(['in-new-components/GlobeView/textures/diffuseGrayScale.jpg'], worldDiffuseGrayScaleMapPath => {
      const image = new Image();
      image.onload = () => {
        var texture = new Texture(this.canvas);
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        this.globe.material.map = texture;
        let drawn = false;

        this.data$ = this.properties$.flatMap(getData$).subscribe(countryBreakdownResult => {
          const data = countryBreakdownResult.data;
          if (!data) {
            return;
          }

          if (drawn) {
            this.ctx.drawImage(image, 0, 0, 2048, 1024);
          } else {
            this.ctx.drawImage(image, 0, 0, 4096, 2048);
          }
          drawn = true;

          const maxCount = data.items.map(t => t.pageLoads).reduce((a, b) => (a > b ? a : b), 0);
          for (let i = 0; i < data.items.length; i++) {
            const { country, pageLoads } = data.items[i];
            const countryDefinition = findCountryConfigByLabel(country);
            if (!countryDefinition) {
              continue;
            }

            const color = getHeatMapColor(pageLoads / maxCount, heatMapColorScaleRgb);
            this.ctx.fillStyle = rgbToHex(color.r * 255, color.g * 255, color.b * 255);

            for (let i = 0; i < countryDefinition.paths.length; i++) {
              this.ctx.setTransform(2, 0, 0, 2, 0, 0);
              const p = new Path2D(countryDefinition.paths[i]);
              this.ctx.fill(p);
            }
          }
          texture.needsUpdate = true;
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

    const globe = (this.globe = new Mesh(
      new SphereBufferGeometry(0.5, 75, 75),
      new MeshBasicMaterial({ color: 0xffffff })
    ));
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
