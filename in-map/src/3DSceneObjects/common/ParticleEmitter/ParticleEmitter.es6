import THREE from 'three';

import fragmentShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/fragmentShader.glsl';
import vertexShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/vertexShader.glsl';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import AnimationController from 'in-map/src/AnimationController';
import {getDeltaTime} from 'in-map/src/timeCalculations';


export default class ParticleEmitter extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.animationController = new AnimationController({
      onUpdate: this.animationControllerUpdateCallback.bind(this),
      timeToAnimate: 2000,
      repeat: true
    });

    this.isRunning = false;
    this.vertices = [];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
    geometry.attributes.position.needsUpdate = true;

    const material = this.material = new THREE.RawShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        },
        progress: {
          type: 'f',
          value: 0.0
        },
        color: {
          type: 'v3',
          value: {x: 1.0, y: 0.0, z: 0.0}
        }
      }
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.Mesh(geometry, material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
  }

  setPostition(newPosition) {
    this.mesh.position.copy(newPosition);
  }

  lookAt(target) {
    this.mesh.lookAt(target);
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.scene.removeSceneObject(this.mesh);
    this.animationController.start();

    this.isRunning = true;
  }

  animationControllerUpdateCallback() {
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.scene.removeSceneObject(this.mesh);
    this.animationController.stop();
    this.isRunning = false;
  }

  update(progress) {
    const dt = getDeltaTime();
    this.material.uniforms.time.value = dt;
    this.material.uniforms.progress.value = progress;
  }

  dispose() {
    super.dispose();

    this.stop();
    this.animationController.dispose();

    this.isRunning = null;
    this.vertices = null;

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
  }
}
