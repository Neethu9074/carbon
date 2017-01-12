import {combineLatest} from 'reactive-observables';
import {remove} from 'lodash';

import fragmentShader from 'in-map/misc/ParticleEmitter/shader/fragmentShader.glsl';
import vertexShader from 'in-map/misc/ParticleEmitter/shader/vertexShader.glsl';

import {
  RawShaderMaterial,
  BufferGeometry,
  BufferAttribute,
  LinearFilter,
  DoubleSide,
  Points
} from 'in-map/3DLibProvider';
import {getMetricForFocusedMoment, getTimeWindowBasedMetricAggregation} from 'in-stores/metric';
import createPositionGenerator from 'in-map/misc/ParticleEmitter/PlaneSpawnPositionGenerator';
import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {particlesAreActive$} from 'in-map/stores/logical/particlesStore';
import {showAggregations$} from 'in-stores/metric/showAggregations';
import pointShape from 'in-map/misc/ParticleEmitter/pointShape.png';
import {requestRendering} from 'in-map/stores/renderingStore';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import {loadImage} from 'in-map/services/imageLoader';
import {focusedMoment$} from 'in-stores/timeline';
import {eventBus} from 'in-map/services/eventBus';


const START_POS = 100000;
const MAX_PARTICLES = 150;
const TIME_TO_LIFE_PER_UNIT = 0.2;

export default class ParticleEmitter {

  constructor(sceneObject) {
    this.id = sceneObject.id;

    this.setNumparticlesPerSecond(0);

    // the current index in the ringbuffer array for the next spawning particle
    this.currentIndex = 0;

    this.isRunning = false;
    this.length = 0;

    this.positionGenerationStrategy = createPositionGenerator();

    this.progresses = new Float32Array(MAX_PARTICLES);
    this.severities = new Float32Array(MAX_PARTICLES);
    this.vertices = new Float32Array(MAX_PARTICLES * 3);

    const geometry = this.geometry = new BufferGeometry();
    geometry.dynamic = true;

    this.geometry.addAttribute('position', new BufferAttribute(this.vertices, 3));
    this.geometry.addAttribute('progress', new BufferAttribute(this.progresses, 1));
    this.geometry.addAttribute('severity', new BufferAttribute(this.severities, 1));

    const texture = loadImage(pointShape, loadedTexture => loadedTexture.needsUpdate = true);
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = false;

    const material = this.material = new RawShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: {
        texture: { type: 't', value: texture },
        distance: { type: 'f', value: isWebVRActive ? 200 : 1500 }
      }
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new Points(geometry, material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 3;

    this.resetParticles();

    this.startSubscription = combineLatest([
      particlesAreActive$,
      focusedMoment$
    ]).subscribe(([particlesAreActive, focusedMoment]) => {
      this.stop();

      if (particlesAreActive) {
        if (focusedMoment) {
          this.startStatic();
        } else {
          this.start();
        }
      }
    });
  }

  setFromAndTo(fromPos, toPos) {
    this.mesh.position.set(fromPos.x, fromPos.y, fromPos.z);

    this.mesh.lookAt(toPos);

    const direction = toPos.clone().sub(this.mesh.position);
    this.length = direction.length();

    // -1 because we want the particles to break on the border of the nodes. For that we translate the particles
    // 0.5 to direction and cap them 0.5 before end which results in scale.z - 1
    this.mesh.scale.set(1, 1, this.length - 1);

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
    this.timeElapsedSinceLastError = 0;

    this.updateSubscription = eventBus.on('update').subscribe(dt => this.update(dt));

    this.isRunning = true;

    this.metricSubscription = combineLatest([
      this.getMetric('count', 'adjustedCount'),
      this.getMetric('error_rate', 'mean')
    ]).subscribe(([countMetric, errorRateMetric]) => this.setNumparticlesPerSecond(countMetric, errorRateMetric));
  }

  startStatic() {
    if (this.isRunning) {
      return;
    }

    addSceneObject(this.mesh);

    this.timeElapsedSinceLastSpawn = 0;
    this.timeElapsedSinceLastError = 0;
    this.secToNextParticle = Number.MAX_VALUE;

    this.isRunning = true;

    this.metricSubscription = combineLatest([
      this.getMetric('count', 'adjustedCount'),
      this.getMetric('error_rate', 'mean')
    ]).subscribe(([countMetric, errorRateMetric]) => {
      countMetric = Math.ceil(countMetric);
      errorRateMetric = Math.ceil(errorRateMetric);

      for (let i = 0, length = countMetric; i < length; i++) {
        this.spawnParticle(i < errorRateMetric);
      }
    });

    this.updateSubscription = eventBus.on('update').subscribe(() => this.updateStatic());
  }

  getMetric(metric, timeWindowAggregation) {
    return showAggregations$
      .flatMap(showAggregations => {
        if (!showAggregations) {
          return getMetricForFocusedMoment({snapshotId: this.id, metric})
            .map(v => v[1] == null ? 0 : v[1])
            .distinct();
        }

        return getTimeWindowBasedMetricAggregation({
            snapshotId: this.id,
            metric,
            timeWindowAggregation: timeWindowAggregation
          })
          .map(v => v == null ? 0 : v)
          .distinct();
      });
  }

  update(dt) {
    const vertices = this.vertices;
    const particles = this.particles;
    const progresses = this.progresses;
    const timeToLife = TIME_TO_LIFE_PER_UNIT * this.length;

    for (let i = 0, length = particles.length; i < length; i++) {
      const particle = particles[i];
      particle.timeLived += dt;
      particle.progress = particle.timeLived / timeToLife;
      progresses[particle.index] = Math.min(1, particle.progress);
    }

    // remove old particles
    const removed = remove(particles, particle => particle.progress >= 1);
    removed.forEach(removedParticle => {
      const index = removedParticle.index * 3;
      vertices[index] = START_POS;
      vertices[index + 1] = START_POS;
      vertices[index + 2] = START_POS;

      progresses[removedParticle.index] = 0;
      this.severities[removedParticle.index] = 0;
    });

    // spawn new particles
    let numParticlesToSpawn = this.timeElapsedSinceLastSpawn / this.secToNextParticle;
    if (numParticlesToSpawn >= 1) {
      numParticlesToSpawn = Math.floor(numParticlesToSpawn);
      this.timeElapsedSinceLastSpawn -= this.secToNextParticle * numParticlesToSpawn;

      for (let i = 0; i < numParticlesToSpawn; i++) {
        let hasError = false;
        if (this.timeElapsedSinceLastError > this.secToNextError) {
          hasError = true;
          this.timeElapsedSinceLastError -= this.secToNextError;
        }
        this.spawnParticle(hasError);
      }
    }

    this.positionNeedsUpdate();
    this.severityNeedsUpdate();
    this.progressNeedsUpdate();
    this.timeElapsedSinceLastSpawn += dt;
    this.timeElapsedSinceLastError += dt;
  }

  updateStatic() {
    const particles = this.particles;
    const progresses = this.progresses;

    for (let i = 0, length = particles.length; i < length; i++) {
      const particle = particles[i];
      particle.progress = (i + 1) / (particles.length + 1);
      progresses[particle.index] = Math.min(1, particle.progress);
    }

    this.positionNeedsUpdate();
    this.severityNeedsUpdate();
    this.progressNeedsUpdate();
  }

  spawnParticle(hasError) {
    const vertices = this.vertices;
    const position = this.positionGenerationStrategy.getPositionForParticle();
    const newIndex = this.currentIndex;
    const particle = {
      progress: 0,
      timeLived: 0,
      index: newIndex
    };

    // remove particles from list with the same index to avoid overrides
    remove(this.particles, _particle => _particle.index === newIndex);
    this.particles.push(particle);

    this.severities[newIndex] = hasError ? 1.0 : 0.0;
    this.progresses[newIndex] = 0;

    const indexInVertices = newIndex * 3;
    vertices[indexInVertices] = position.x;
    vertices[indexInVertices + 1] = position.y;
    vertices[indexInVertices + 2] = position.z;

    // make the buffer a ringbuffer
    this.currentIndex = (this.currentIndex + 1) % MAX_PARTICLES;
  }

  positionNeedsUpdate() {
    this.geometry.attributes.position.needsUpdate = true;
  }

  progressNeedsUpdate() {
    this.geometry.attributes.progress.needsUpdate = true;

    requestRendering();
  }

  severityNeedsUpdate() {
    this.geometry.attributes.severity.needsUpdate = true;
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.resetParticles();

    this.disposeSubscription(this.updateSubscription);
    this.disposeSubscription(this.metricSubscription);

    removeSceneObject(this.mesh);
    this.isRunning = false;
  }

  resetParticles() {
    this.particles = [];
    for (let i = 0; i < this.progresses.length; i++) {
      const vertexIndex = i * 3;
      this.progresses[i] = 0;
      this.severities[i] = 0;
      this.vertices[vertexIndex] = START_POS;
      this.vertices[vertexIndex + 1] = START_POS;
      this.vertices[vertexIndex + 2] = START_POS;
    }

    this.positionNeedsUpdate();
    this.progressNeedsUpdate();
  }

  setNumparticlesPerSecond(particlesPerSecond = 0, errorRate = 0) {
    // clamp number of spawning particles to max number of particles during lifetime
    particlesPerSecond = Math.min(particlesPerSecond, TIME_TO_LIFE_PER_UNIT * (MAX_PARTICLES / 3));

    this.particlesPerSecond = particlesPerSecond;
    this.secToNextParticle = (particlesPerSecond > 0) ? 1 / particlesPerSecond : Number.MAX_VALUE;
    this.secToNextError = (errorRate > 0) ? this.secToNextParticle / errorRate : Number.MAX_VALUE;
  }

  disposeSubscription(subscription) {
    if (subscription) {
      subscription.dispose();
    }
  }

  dispose() {
    this.startSubscription.dispose();
    this.startSubscription = null;

    // stop the emitter to make sure everything is disposed well
    this.stop();

    this.positionGenerationStrategy = null;
    this.timeElapsedSinceLastError = null;
    this.timeElapsedSinceLastSpawn = null;
    this.secToNextParticle = null;
    this.secToNextError = null;
    this.progresses = null;
    this.isRunning = null;
    this.particles = null;
    this.vertices = null;
    this.length = null;

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
  }
}
