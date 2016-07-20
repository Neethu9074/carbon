import * as ro from 'reactive-observables';
import {remove} from 'lodash';
import THREE from 'three';

import {getMetricForFocusedMoment} from 'in-stores/metric';
import {loadImage} from 'in-map/src/services/imageLoader';

import createPositionGenerator from 'in-map/src/3DSceneObjects/common/ParticleEmitter/PlaneSpawnPositionGenerator';
import fragmentShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/fragmentShader.glsl';
import vertexShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/vertexShader.glsl';
import pointShape from 'in-map/src/3DSceneObjects/common/ParticleEmitter/pointShape.png';
import {addSceneObject, removeSceneObject} from 'in-map/src/stores/sceneStore';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import {getDeltaTime} from 'in-map/src/timeCalculations';
import {eventBus} from 'in-map/src/services/eventBus';


const START_POS = 100000;

export default class ParticleEmitter extends SceneObject {

  constructor({parent, id, config = {}}) {
    super({parent, id});

    this.maxParticles = config.maxParticles || 50;
    this.timeToLife = 3;
    this.setNumparticlesPerSecond(config.particlesPerSecond);

    this.isRunning = false;

    this.positionGenerationStrategy = createPositionGenerator();

    this.arrayCusor = 0;
    this.progresses = new Float32Array(this.maxParticles);
    this.vertices = new Float32Array(this.maxParticles * 3);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = START_POS;
    }

    this.particles = [];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;
    this.positionNeedsUpdate();

    const texture = loadImage(pointShape, loadedTexture => loadedTexture.needsUpdate = true);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = false;

    const material = this.material = new THREE.RawShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        texture: { type: 't', value: texture }
      }
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.Points(geometry, material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;

    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.geometry.addAttribute('progress', new THREE.BufferAttribute(this.progresses, 1));

    let wordsWritten = '';
    this.startSubscription = ro.on(window, 'keydown').subscribe(event => {
      wordsWritten += String.fromCharCode(event.keyCode);
      wordsWritten = wordsWritten.substring(wordsWritten.length - 9, 10);

      if (wordsWritten.toLowerCase() === 'particles') {
        this.start();
      } else if (wordsWritten.toLowerCase() === 'selcitrap') {
        this.stop();
      }
    });
  }

  setFromAndTo(fromPos, toPos) {
    this.mesh.position.set(fromPos.x - 0.5, fromPos.y, fromPos.z + 0.5);

    const targetPosition = new THREE.Vector3(toPos.x - 0.5, toPos.y, toPos.z + 0.5);
    this.mesh.lookAt(targetPosition);

    const direction = targetPosition.sub(this.mesh.position);
    // -1 because we want the particles to break on the border of the nodes. For that we translate the particles
    // 0.5 to direction and cap them 0.5 before end which results in scale.z - 1
    this.mesh.scale.set(1, 1, direction.length() - 1);

    this.mesh.position.add(direction.normalize().multiplyScalar(0.5));
  }

  updateVertices() {
    this.mesh.updateMatrix();
  }

  start() {
    if (this.isRunning) {
      return;
    }

    addSceneObject(this.mesh);

    this.timeElapsedSinceLastSpawn = 0;
    this.updateSubscription = eventBus.on('beginUpdate').subscribe(() => this.update());

    this.isRunning = true;

    this.metricSubscription = getMetricForFocusedMoment({
      snapshotId: this.parent.id,
      metric: 'count'
    }).subscribe(metric => {
      const numCalls = metric[1];
      // TODO: we have defined a maximum number of particles. If numCalls gets to big, older particles will be used
      // and resetted before they are finished. Solutions: Increase maxParticles or cap numCalls or map numCalls to
      // another value pursuing to a max value (log, whatever)
      this.setNumparticlesPerSecond(numCalls);
    });
  }

  update() {
    const dt = getDeltaTime();
    const vertices = this.vertices;
    const particles = this.particles;
    const progresses = this.progresses;

    for (let i = 0, length = particles.length; i < length; i++) {
      const particle = particles[i];
      particle.timeLived += dt;
      particle.progress = Math.min(1, particle.timeLived / particle.timeToLife);
      progresses[particle.index] = particle.progress;
    }

    // remove old particles
    const removed = remove(particles, particle => particle.progress === 1);
    for (let i = 0; i < removed.length; i++) {
      const index = removed[i].index * 3;
      vertices[index] = START_POS;
      vertices[index + 1] = START_POS;
      vertices[index + 2] = START_POS;

      progresses[index] = 0;
    }

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
    const position = this.positionGenerationStrategy.getPositionForParticle();
    const particle = {
      progress: 0,
      timeLived: 0,
      timeToLife: this.timeToLife
    };
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

    requestRendering();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.updateSubscription.dispose();
    this.metricSubscription.dispose();

    removeSceneObject(this.mesh);
    this.isRunning = false;
  }

  setNumparticlesPerSecond(particlesPerSecond = 10) {
    this.particlesPerSecond = particlesPerSecond;
    this.secToNextParticle = 1 / this.particlesPerSecond;
  }

  dispose() {
    super.dispose();

    // stop the emitter to make sure everything is disposed well
    this.stop();

    this.positionGenerationStrategy = null;
    this.progresses = null;
    this.isRunning = null;
    this.particles = null;
    this.vertices = null;

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;

    this.numParticles = null;

    this.startSubscription.dispose();
    this.startSubscription = null;
  }
}
