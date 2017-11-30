import fragmentShader from 'in-map/singleMeshFactories/basicFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/basicVertexShader.glsl';

import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';
import { Mesh, RawShaderMaterial, DoubleSide } from 'in-map/3DLibProvider';

export default class BasicSingleMeshFactory extends ASingleMeshFactory {
  constructor(options) {
    super(options);
  }

  getMesh(geometry, material) {
    return new Mesh(geometry, material);
  }

  getMaterial() {
    return new RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: DoubleSide,
      transparent: false,
      depthWrite: true,
      uniforms: {
        opacity: {
          type: 'f',
          value: 0.25
        }
      }
    });
  }

  dispose() {
    super.dispose();
  }
}
