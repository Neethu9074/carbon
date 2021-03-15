/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import { updateAttribute } from 'in-map/services/geometryAttributes';

export default class BaseGeometry {
  constructor() {
    this.emptyVertices = [Number.MAX_VALUE, 0, 0, Number.MAX_VALUE, 0, 0];

    const geometry = (this.geometry = new BufferGeometry());
    geometry.dynamic = true;

    const shader = this.getShader();
    const material = (this.material = new RawShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        }
      }
    }));

    this.start = Date.now();

    const mesh = (this.mesh = this.getMesh(geometry, material));
    mesh.frustumCulled = false;

    updateAttribute(this.geometry, 'position', this.emptyVertices);
  }

  update() {
    this.material.uniforms.time.value = 0.000025 * (Date.now() - this.start);
  }

  setVertices(vertices) {
    if (vertices.length === 0) {
      vertices = this.emptyVertices;
    }

    updateAttribute(this.geometry, 'position', vertices);
  }

  setColors(colors) {
    if (colors.length === 0) {
      colors = this.emptyVertices;
    }

    updateAttribute(this.geometry, 'color', colors);
  }

  setUVs(uvs) {
    if (uvs.length === 0) {
      uvs = this.emptyVertices;
    }

    updateAttribute(this.geometry, 'uv', uvs, 2);
  }

  renderableGeometry() {
    return this.mesh;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    // TODO: dispose rest
  }
}
