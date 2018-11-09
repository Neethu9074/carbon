/* global require:false */

import { LinearFilter, Texture, SphereBufferGeometry, Mesh, MeshBasicMaterial } from 'in-map/3DLibProvider';
import { findCountryConfigByLabel } from 'in-new-components/GlobeView/components/countryConfig';
import getCountryBreakdown from 'in-subscription/websiteMonitoring/getCountryBreakdown';
import { rgbToHex } from 'in-services/formatters/color';
import getHeatMapColor from 'in-services/heatMapColors';
import { timeConfig$ } from 'in-stores/time/config';

export default class HeatMapGlobe {
  constructor(scene, getTagFilters) {
    this.scene = scene;
    this.initScene();

    const heatMapColorScale = [
      { r: 0, g: 0, b: 0.011764705882352941 },
      { r: 0.2980392156862745, g: 0.09411764705882353, b: 0.4196078431372549 },
      { r: 0.9882352941176471, g: 0.984313725490196, b: 0.6588235294117647 }
    ];

    require(['in-new-components/GlobeView/textures/diffuseGrayScale.jpg'], worldDiffuseGrayScaleMapPath => {
      const image = new Image();
      image.onload = () => {
        var texture = new Texture(this.canvas);
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        this.globe.material.map = texture;

        this.data$ = timeConfig$
          .flatMap(timeConfig =>
            getCountryBreakdown({
              timeConfig,
              tagFilters: getTagFilters(),
              pagination: {
                page: 1,
                pageSize: 200
              },
              order: {
                by: 'countryName',
                direction: 'ASC'
              }
            })
          )
          .subscribe(countryBreakdownResult => {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.drawImage(image, 0, 0, 4096, 2048);
            this.ctx.globalCompositeOperation = 'screen';

            const data = countryBreakdownResult.data ? countryBreakdownResult.data.items : [];
            const maxCount = data.map(t => t.pageLoads).reduce((a, b) => (a > b ? a : b), 0);
            for (let i = 0; i < data.length; i++) {
              const { country, pageLoads } = data[i];
              const countryDefinition = findCountryConfigByLabel(country);
              if (!countryDefinition) {
                continue;
              }

              const color = getHeatMapColor(pageLoads / maxCount, heatMapColorScale);
              this.ctx.fillStyle = rgbToHex(color.r * 255, color.g * 255, color.b * 255);

              for (let i = 0; i < countryDefinition.paths.length; i++) {
                this.ctx.setTransform(2, 0, 0, 2, 0, 0);
                const p = new Path2D(countryDefinition.paths[i]);
                this.ctx.fill(p);
              }
            }
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

  dispose() {
    this.data$.dispose();
    this.data$ = null;

    this.globe.material.dispose();
    this.globe.geometry.dispose();
  }
}
