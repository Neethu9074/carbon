import * as ro from 'reactive-observables';
import {remove} from 'lodash';
import THREE from 'three';

import getPositionForParticle from 'in-map/src/3DSceneObjects/common/ParticleEmitter/CubicalSpawnPositionGenerator';
import fragmentShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/fragmentShader.glsl';
import vertexShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/vertexShader.glsl';
import pointShape from 'in-map/src/3DSceneObjects/common/ParticleEmitter/pointShape.png';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import AnimationController from 'in-map/src/AnimationController';
import {getDeltaTime} from 'in-map/src/timeCalculations';
import eventBus from 'in-map/eventbus';


export default class ParticleEmitter extends SceneObject {

  constructor({parent, id, config = {}}) {
    super({parent, id});

    this.maxParticles = config.particlesPerSecond || 5;
    this.particlesPerSecond = config.particlesPerSecond || 1;
    this.timeToLife = config.timeToLife || 5;

    this.secToNextParticle = 1 / this.particlesPerSecond;
    this.isRunning = false;

    this.animationController = new AnimationController({
      onUpdate: this.animationControllerUpdateCallback.bind(this),
      timeToAnimate: this.timeToLife * 1000,
      repeat: true
    });

    this.vertices = [
      1, 0, 0,
      2, 0, 0,
      3, 0, 0,
      4, 0, 0,
      5, 0, 0
    ];
    for (let i = 0; i < this.maxParticles * 3; i++) {
      // this.vertices[i] = 100000;
    }

    this.particles = [];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;
    this.verticesNeedUpdate();

    const texture = new THREE.Texture();
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = false;
    const manager = new THREE.LoadingManager();
    const img = new THREE.ImageLoader(manager).load(pointShape, () => texture.needsUpdate = true);
    texture.image = img;

    const material = this.material = new THREE.RawShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        texture: { type: 't', value: texture },
        color: {
          type: 'v3',
          value: {x: Math.random(), y: Math.random(), z: Math.random()}
        }
      }
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.Points(geometry, material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;

    let wordsWritten = '';
    this.startSubscription = ro.on(window, 'keydown').subscribe(event => {
      wordsWritten += String.fromCharCode(event.keyCode);
      wordsWritten = wordsWritten.substring(wordsWritten.length - 9, 10);

      if (wordsWritten.toLowerCase() === 'particles') {
        console.log('FIRE SOME AWESOME PARTICLES');
        this.start();
        this.startSubscription.dispose();
        this.startSubscription = null;
      }
    });
  }

  setPosition(newPosition) {
    this.mesh.position.set(newPosition.x - 0.5, newPosition.y + 2, newPosition.z + 0.5);
  }

  lookAt(target) {
    const targetPosition = new THREE.Vector3(target.x - 0.5, target.y, target.z + 0.5);
    this.mesh.lookAt(targetPosition);
  }

  updateVertices() {
    this.mesh.updateMatrix();
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.scene.addSceneObject(this.mesh);
    this.animationController.start();

    this.timeElapsedSinceLastSpawn = 0;
    this.updateSubscription = eventBus.on('beginUpdate').subscribe(() => this.update());

    this.isRunning = true;
  }

  update() {
    const dt = getDeltaTime();

    // remove old particles
    for (let i = 0, length = this.particles.length; i < length; i++) {
      this.particles[i].timeLived += dt;
    }
    remove(this.particles, (particle, i) => {
      const isOldEnoughToGetRemoved = particle.timeLived >= this.timeToLife;

      if (isOldEnoughToGetRemoved) {
        console.log('remove particle at', i);
      }

      return isOldEnoughToGetRemoved;
    });

    // spawn new particles
    let numParticlesToSpawn = this.timeElapsedSinceLastSpawn / this.secToNextParticle;
    if (numParticlesToSpawn >= 1) {
      numParticlesToSpawn = Math.floor(numParticlesToSpawn);
      this.timeElapsedSinceLastSpawn -= this.secToNextParticle * numParticlesToSpawn;

      for (let i = 0; i < numParticlesToSpawn; i++) {
        this.spawnParticle();
      }
    }

    this.timeElapsedSinceLastSpawn += dt;
  }

  spawnParticle() {
    const position = getPositionForParticle();
    this.particles.push({timeLived: 0}) * 3;

    console.log('spawn particle at', position);
  }

  verticesNeedUpdate() {
    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  animationControllerUpdateCallback() {
    this.scene.renderScene();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.updateSubscription.dispose();

    this.scene.removeSceneObject(this.mesh);
    this.animationController.stop();
    this.isRunning = false;
  }

  dispose() {
    super.dispose();

    this.stop();
    this.animationController.dispose();

    this.isRunning = null;
    this.particles = null;
    this.vertices = null;

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;

    this.numParticles = null;

    if (this.startSubscription) {
      this.startSubscription.dispose();
      this.startSubscription = null;
    }
  }
}
