import THREE from 'three';

import fragmentShader from 'in-map/singleMeshFactories/pointFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/pointVertexShader.glsl';

import {glyphTexture, config} from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';


export default class IconSingleMeshFactory extends ASingleMeshFactory {

  constructor() {
    super();
  }

  getMesh(geometry, material) {
    return new THREE.Points(geometry, material);
  }

  getMaterial() {
    return new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthTest: false,
      uniforms: {
        texture: { type: 't', value: glyphTexture },
        numColumns: { type: 'f', value: config.numElementsPerColumn }
      }
    });
  }

  rebuild() {
    super.rebuild();

    const geometry = this.mesh.geometry;
    const fragments = Object.keys(this.fragments.objects).map(key => this.fragments.objects[key]);

    const pointSizes = new Float32Array(fragments.length);

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

      pointSizes[i] = fragment.additionalParams.iconSize;

      const xy = config.LUT[fragment.additionalParams.type];
      xy
        // use right bottom UV coords to show nothing but emptiness
        ? uvCoords.push(xy.x / textureWidth, xy.y / textureWidth)
        : uvCoords.push(0, 0);
    }

    geometry.addAttribute('pointSize', new THREE.BufferAttribute(pointSizes, 1));
    geometry.attributes.pointSize.needsUpdate = true;

    geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvCoords), 2));
    geometry.attributes.uv.needsUpdate = true;
  }
}
