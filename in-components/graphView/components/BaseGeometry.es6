import THREE from 'three';


export default class BaseGeometry {

  constructor() {
    this.emptyVertices = [Number.MAX_VALUE, 0, 0, Number.MAX_VALUE, 0, 0];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;

    const shader = this.getShader();
    const material = this.material = new THREE.RawShaderMaterial({
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
    });

    this.start = Date.now();

    const mesh = this.mesh = this.getMesh(geometry, material);
    mesh.frustumCulled = false;

    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.emptyVertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  update() {
    this.material.uniforms.time.value = 0.000025 * (Date.now() - this.start);
  }

  setVertices(vertices) {
    if (vertices.length === 0) {
      vertices = this.emptyVertices;
    }

    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  setColors(colors) {
    if (colors.length === 0) {
      colors = this.emptyVertices;
    }

    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    this.geometry.attributes.color.needsUpdate = true;
  }

  setUVs(uvs) {
    if (uvs.length === 0) {
      uvs = this.emptyVertices;
    }

    this.geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    this.geometry.attributes.uv.needsUpdate = true;
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
