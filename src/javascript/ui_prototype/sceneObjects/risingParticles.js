'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import vertex from '../shader/risingParticlesVertex.glsl';
import fragment from '../shader/risingParticlesFragment.glsl';

import _ from 'lodash';


class RisingParticles extends SceneObject {
  constructor(app, positions) {
    const pos = new THREE.Vector3(-10, 0, 10);
    const dim = new THREE.Vector3(1000, 0, 1000);

    //call super constructor
    super(app, 'rising particles', pos, dim);

    this.uniforms = {
      amplitude: {
        type: 'f',
        value: 1.0
      }
    };
    this.pointCloud = this.createPointCloud(this.uniforms, positions);
    this.pointCloud.position.copy(pos);

    app.scene.add(this.pointCloud);
    app.updates.push(this);
  }

  createPointCloud(uniforms, positions) {
    const geometry = new THREE.BufferGeometry();
    let geoPos = new Float32Array(positions.length * 3);

    let index = 0;
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      geoPos[index] = position.x;
      geoPos[index + 1] = Math.random() * 10;
      geoPos[index + 2] = -position.z;

      index += 3;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));

    const material = this.createMaterial(uniforms);
    const particleSystem = new THREE.PointCloud(geometry, material);
    return particleSystem;
  }

  createMaterial(uniforms) {
    const shaderMaterial =
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: uniforms,
        transparent: true
      });

    return shaderMaterial;
  }

  update(dt) {
    const dTime = dt;
    const maxHeight = 5;
    const uniforms = this.uniforms;

    uniforms.amplitude.value += dTime; // * speed
    if (uniforms.amplitude.value > maxHeight) {
      uniforms.amplitude.value = 0;
    }
  }

  dispose() {
    this.app.scene.remove(this.pointCloud);
    _.remove(this.app.updates, obj => obj === this);

    super.dispose();

    this.pointCloud.geometry.dispose();
    this.pointCloud.material.dispose();
    this.pointCloud = null;
    this.uniforms = null;
  }
}

export default RisingParticles;
