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

    this.particlesPerSecond = config.particlesPerSecond || 10;
    this.maxParticles = config.maxParticles || 50;
    this.timeToLife = config.timeToLife || 5;
    this.secToNextParticle = 1 / this.particlesPerSecond;

    this.isRunning = false;

    this.animationController = new AnimationController({
      onUpdate: this.animationControllerUpdateCallback.bind(this),
      timeToAnimate: this.timeToLife * 1000,
      repeat: true
    });

    this.arrayCusor = 0;
    this.progresses = new Float32Array(this.maxParticles);
    this.vertices = new Float32Array(this.maxParticles * 3);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = 100000;
    }

    this.particles = [];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;
    this.positionNeedsUpdate();

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
    mesh.frustumCulled = false;

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
    this.mesh.position.set(newPosition.x - 0.5, newPosition.y, newPosition.z + 0.5);
  }

  lookAt(target) {
    const targetPosition = new THREE.Vector3(target.x - 0.5, target.y, target.z + 0.5);
    this.mesh.lookAt(targetPosition);

    const distance = targetPosition.sub(this.mesh.position).length();
    this.mesh.scale.set(1, 1, distance);
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

    for (let i = 0, length = this.particles.length; i < length; i++) {
      const particle = this.particles[i];
      particle.timeLived += dt;
      this.progresses[particle.index] = particle.timeLived / this.timeToLife;
    }
    // remove old particles
    remove(this.particles, particle => particle.timeLived >= this.timeToLife);

    // spawn new particles
    let numParticlesToSpawn = this.timeElapsedSinceLastSpawn / this.secToNextParticle;
    if (numParticlesToSpawn >= 1) {
      numParticlesToSpawn = Math.floor(numParticlesToSpawn);
      this.timeElapsedSinceLastSpawn -= this.secToNextParticle * numParticlesToSpawn;

      for (let i = 0; i < numParticlesToSpawn; i++) {
        this.spawnParticle();
      }
    }

    this.progressNeedsUpdate();
    this.timeElapsedSinceLastSpawn += dt;
  }

  spawnParticle() {
    const position = getPositionForParticle();
    const particle = {timeLived: 0};
    this.particles.push(particle);

    this.arrayCusor++;
    if (this.arrayCusor >= this.maxParticles) {
      this.arrayCusor -= this.maxParticles;
    }
    const newIndex = this.arrayCusor;
    particle.index = newIndex;

    // console.log('spawn particle at', index);
    this.vertices[newIndex * 3] = position.x;
    this.vertices[newIndex * 3 + 1] = position.y;
    this.vertices[newIndex * 3 + 2] = position.z;

    this.progresses[newIndex] = 0;

    this.positionNeedsUpdate();
  }

  positionNeedsUpdate() {
    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.geometry.attributes.position.needsUpdate = true;

  }

  progressNeedsUpdate() {
    this.geometry.addAttribute('progress', new THREE.BufferAttribute(this.progresses, 1));
    this.geometry.attributes.progress.needsUpdate = true;
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

    this.progresses = null;
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
