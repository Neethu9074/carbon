/* global require:false */
import {
  RawShaderMaterial,
  BufferGeometry,
  BufferAttribute,
  LinearFilter,
  DoubleSide,
  Points
} from 'in-map/3DLibProvider';
import { resourceLoaded } from 'in-components/globeView/stores/isLoadingStore';
import { loadImage } from 'in-map/services/imageLoader';

import fragmentShader from 'in-components/globeView/components/shader/starFieldFragmentShader.glsl';
import vertexShader from 'in-components/globeView/components/shader/starFieldVertexShader.glsl';

export default class StarField {
  constructor(parent) {
    require(['in-components/globeView/components/textures/star.png'], starMap => {
      this.numStars = 300;
      this.vertices = new Float32Array(this.numStars * 3);
      this.sizes = new Float32Array(this.numStars * 1);

      const texture = loadImage(starMap, loadedTexture => (loadedTexture.needsUpdate = true));
      texture.minFilter = LinearFilter;
      texture.generateMipmaps = false;
      texture.flipY = false;

      const material = (this.material = new RawShaderMaterial({
        fragmentShader,
        vertexShader,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          texture: { type: 't', value: texture }
        }
      }));

      const geometry = (this.geometry = new BufferGeometry());
      this.geometry.addAttribute('position', new BufferAttribute(this.vertices, 3));
      this.geometry.addAttribute('size', new BufferAttribute(this.sizes, 1));

      const starField = (this.starField = new Points(geometry, material));
      starField.rotationAutoUpdate = false;
      starField.matrixAutoUpdate = false;
      starField.frustumCulled = false;
      starField.renderOrder = 1;

      this.placeStars();
      parent.add(starField);
      resourceLoaded('starMap');
    });
  }

  placeStars() {
    for (let i = 0, length = this.numStars; i < length; i++) {
      const index = i * 3;
      this.vertices[index] = -0.5 + Math.random() * 1;
      this.vertices[index + 1] = -0.5 + Math.random() * 1;
      this.vertices[index + 2] = -1;

      this.sizes[i] = Math.random() * 5;
    }
  }

  dispose() {
    if (this.starField) {
      this.starField.geometry.dispose();
      this.starField.material.dispose();
      this.starField = null;
    }
  }
}
