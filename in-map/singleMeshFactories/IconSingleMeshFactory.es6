import fragmentShader from 'in-map/singleMeshFactories/pointFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/pointVertexShader.glsl';

import {glyphTexture, config} from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';
import {updateAttribute} from 'in-map/services/geometryAttributes';
import {Points, RawShaderMaterial} from 'in-map/3DLibProvider';
import {isWebVRActive} from 'in-map/stores/webVRStore';


export default class IconSingleMeshFactory extends ASingleMeshFactory {

  constructor(options) {
    super(options);
  }

  getMesh(geometry, material) {
    return new Points(geometry, material);
  }

  getMaterial() {
    return new RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        texture: {
          type: 't',
          value: glyphTexture
        },
        numColumns: {
          type: 'f',
          value: config.numElementsPerColumn
        },
        distance: {
          type: 'f',
          value: isWebVRActive ? 200 : 1000
        }
      }
    });
  }

  rebuild() {
    super.rebuild();

    const iconSizeMultiplier = isWebVRActive ? 0.2 : 1;
    const geometry = this.mesh.geometry;
    const fragments = Object.keys(this.fragments.objects).map(key => this.fragments.objects[key]);

    const pointSizes = [];
    const uvCoords = [];
    const textureWidth = config.numElementsPerColumn * config.iconWidth;

    const vertices = geometry.attributes.position.array;

    let index = 0;
    for (let i = 0, length = fragments.length; i < length; i++) {
      const fragment = fragments[i];
      const offset = fragment.additionalParams.positionOffset;

      const fragmentVertices = fragment.contentProvider.getVertices();
      for (let j = 0, numVertices = fragmentVertices.length; j < numVertices; j += 3) {
        vertices[index] = vertices[index] + offset.x;
        vertices[index + 1] = vertices[index + 1] + offset.y;
        vertices[index + 2] = vertices[index + 2] + offset.z;

        index += 3;
      }

      pointSizes[i] = fragment.additionalParams.iconSize * iconSizeMultiplier;

      const xy = config.LUT[fragment.additionalParams.type];
      xy
        // use right bottom UV coords to show nothing but emptiness
        ? uvCoords.push(xy.x / textureWidth, xy.y / textureWidth)
        : uvCoords.push(0, 0);
    }

    updateAttribute(geometry, 'pointSize', pointSizes, 1);
    updateAttribute(geometry, 'uv', uvCoords, 2);
  }
}
