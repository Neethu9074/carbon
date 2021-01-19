/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { init as initGlyphTexture, glyphTexture, config } from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import fragmentShader from 'in-map/singleMeshFactories/pointFragmentShader.glsl';
import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';
import vertexShader from 'in-map/singleMeshFactories/pointVertexShader.glsl';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import { Points, RawShaderMaterial } from 'in-map/3DLibProvider';

export default class IconSingleMeshFactory extends ASingleMeshFactory {
  constructor(options) {
    super(options);

    initGlyphTexture();
    this.material = new RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        map: {
          type: 't',
          value: glyphTexture
        },
        numColumns: {
          type: 'f',
          value: config.numElementsPerColumn
        }
      }
    });

    this.points = new Points(this.geometry, this.material);
  }

  getMesh() {
    return this.points;
  }

  getMaterial() {
    return this.material;
  }

  build() {
    const numVertices = super.build();
    if (numVertices === 0) {
      return;
    }

    const geometry = this.mesh.geometry;

    const pointSizes = [];
    const uvCoords = [];
    const textureWidth = config.numElementsPerColumn * config.iconWidth;

    const vertices = geometry.attributes.position.array;

    let index = 0;
    let i = 0;
    this.fragments.forEach(fragment => {
      const offset = fragment.additionalParams.positionOffset;

      const fragmentVertices = fragment.contentProvider.getVertices();
      for (let j = 0, lengthV = fragmentVertices.length; j < lengthV; j += 3) {
        vertices[index] = vertices[index] + offset.x;
        vertices[index + 1] = vertices[index + 1] + offset.y;
        vertices[index + 2] = vertices[index + 2] + offset.z;

        index += 3;
      }

      pointSizes[i++] = fragment.additionalParams.iconSize;

      const xy = config.LUT[fragment.additionalParams.type];
      if (xy) {
        // use right bottom UV coords to show nothing but emptiness
        uvCoords.push(xy.x / textureWidth, xy.y / textureWidth);
      } else {
        uvCoords.push(0, 0);
      }
    });

    updateAttribute(geometry, 'pointSize', pointSizes, 1);
    updateAttribute(geometry, 'uv', uvCoords, 2);
  }
}
