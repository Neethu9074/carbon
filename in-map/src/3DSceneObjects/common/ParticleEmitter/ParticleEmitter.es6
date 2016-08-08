import {remove} from 'lodash';
import THREE from 'three';

import createPositionGenerator from 'in-map/src/3DSceneObjects/common/ParticleEmitter/PlaneSpawnPositionGenerator';
import fragmentShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/fragmentShader.glsl';
import vertexShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/vertexShader.glsl';
import pointShape from 'in-map/src/3DSceneObjects/common/ParticleEmitter/pointShape.png';
import {addSceneObject, removeSceneObject} from 'in-map/src/stores/sceneStore';
import {particlesAreActive$} from 'in-map/src/stores/process/particles';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import {loadImage} from 'in-map/src/services/imageLoader';
import {getDeltaTime} from 'in-map/src/timeCalculations';
import {eventBus} from 'in-map/src/services/eventBus';


const START_POS = 100000;
const TIME_TO_LIFE_PER_UNIT = 0.2;

export default class ParticleEmitter extends SceneObject {

  constructor({parent, id, config = {}}) {
    super({parent, id});

    this.maxParticles = config.maxParticles || 50;
    this.setNumparticlesPerSecond(0);

    this.isRunning = false;
    this.cursorIfNoFreeIndices = 0;
    this.length = 0;

    this.positionGenerationStrategy = createPositionGenerator();

    this.progresses = new Float32Array(this.maxParticles);
    this.vertices = new Float32Array(this.maxParticles * 3);
    this.indices = [];

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

    this.resetParticles();

    this.startSubscription = particlesAreActive$.subscribe(particlesAreActive =>
      particlesAreActive ? this.start() : this.stop()
    );
  }

  setFromAndTo(fromPos, toPos) {
    this.mesh.position.set(fromPos.x - 0.5, fromPos.y, fromPos.z + 0.5);

    const targetPosition = new THREE.Vector3(toPos.x - 0.5, toPos.y, toPos.z + 0.5);
    this.mesh.lookAt(targetPosition);

    const direction = targetPosition.sub(this.mesh.position);
    // -1 because we want the particles to break on the border of the nodes. For that we translate the particles
    // 0.5 to direction and cap them 0.5 before end which results in scale.z - 1
    this.mesh.scale.set(1, 1, direction.length() - 1);

    this.length = direction.length();

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
    const timeToLife = TIME_TO_LIFE_PER_UNIT * this.length;

    for (let i = 0, length = particles.length; i < length; i++) {
      const particle = particles[i];
      particle.timeLived += dt;
      particle.progress = Math.min(1, particle.timeLived / timeToLife);
      progresses[particle.index] = particle.progress;
    }

    // remove old particles
    const removed = remove(particles, particle => particle.progress >= 1);
    removed.forEach(removedParticles => {
      const index = removedParticles.index * 3;
      vertices[index] = START_POS;
      vertices[index + 1] = START_POS;
      vertices[index + 2] = START_POS;

      progresses[index] = 0;
      this.freeCursorPosition(index / 3);
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

    this.positionNeedsUpdate();
    this.progressNeedsUpdate();
    this.timeElapsedSinceLastSpawn += dt;
  }

  spawnParticle() {
    const vertices = this.vertices;
    const position = this.positionGenerationStrategy.getPositionForParticle();
    const newIndex = this.getNextCursorPosition();
    const particle = {
      progress: 0,
      timeLived: 0,
      index: newIndex
    };
    this.particles.push(particle);

    this.progresses[newIndex] = 0;

    const indexInVertices = newIndex * 3;
    vertices[indexInVertices] = position.x;
    vertices[indexInVertices + 1] = position.y;
    vertices[indexInVertices + 2] = position.z;
  }

  getNextCursorPosition() {
    const index = this.indices.shift();
    if (index) {
      this.cursorIfNoFreeIndices = 0;
      return index;
    }
    const nextIndex = this.cursorIfNoFreeIndices++;
    if (this.cursorIfNoFreeIndices >= this.maxParticles) {
      this.cursorIfNoFreeIndices = 0;
    }
    return nextIndex;
  }

  freeCursorPosition(value) {
    this.indices.push(value);
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

    this.resetParticles();
    this.updateSubscription.dispose();
    this.metricSubscription.dispose();

    removeSceneObject(this.mesh);
    this.isRunning = false;
  }

  resetParticles() {
    this.particles = [];
    for (let i = 0; i < this.progresses.length; i++) {
      const vertexIndex = i * 3;
      this.progresses[i] = 0;
      this.vertices[vertexIndex] = START_POS;
      this.vertices[vertexIndex + 1] = START_POS;
      this.vertices[vertexIndex + 2] = START_POS;
      this.indices[i] = i;
    }

    this.positionNeedsUpdate();
    this.progressNeedsUpdate();
  }

  setNumparticlesPerSecond(particlesPerSecond = 10) {
    // clamp number of spawning particles to max number of particles during lifetime
    particlesPerSecond = Math.min(particlesPerSecond, TIME_TO_LIFE_PER_UNIT * this.maxParticles);

    this.particlesPerSecond = particlesPerSecond;
    this.secToNextParticle = particlesPerSecond > 0 ? 1 / this.particlesPerSecond : Number.MAX_VALUE;
  }

  dispose() {
    super.dispose();

    // stop the emitter to make sure everything is disposed well
    this.stop();

    this.positionGenerationStrategy = null;
    this.cursorIfNoFreeIndices = null;
    this.progresses = null;
    this.isRunning = null;
    this.particles = null;
    this.vertices = null;
    this.indices = null;
    this.length = null;

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;

    this.numParticles = null;

    this.startSubscription.dispose();
    this.startSubscription = null;
  }
}
