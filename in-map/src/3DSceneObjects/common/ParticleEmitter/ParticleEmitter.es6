import * as ro from 'reactive-observables';
import THREE from 'three';

import fragmentShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/fragmentShader.glsl';
import vertexShader from 'in-map/src/3DSceneObjects/common/ParticleEmitter/shader/vertexShader.glsl';
import pointShape from 'in-map/src/3DSceneObjects/common/ParticleEmitter/pointShape.png';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import AnimationController from 'in-map/src/AnimationController';


export default class ParticleEmitter extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.isRunning = false;

    this.animationController = new AnimationController({
      onUpdate: this.animationControllerUpdateCallback.bind(this),
      timeToAnimate: 5000,
      repeat: true
    });

    this.vertices = [
      0, 0, 0
    ];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
    geometry.attributes.position.needsUpdate = true;

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
        progress: {
          type: 'f',
          value: 0.0
        },
        color: {
          type: 'v3',
          value: {x: Math.random(), y: Math.random(), z: Math.random()}
        },
        distance: {
          type: 'f',
          value: 1.0
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

  setPostition(newPosition) {
    this.mesh.position.set(newPosition.x - 0.5, newPosition.y, newPosition.z + 0.5);
  }

  lookAt(target) {
    const targetPosition = new THREE.Vector3(target.x - 0.5, target.y, target.z + 0.5);
    this.mesh.lookAt(targetPosition);
    this.material.uniforms.distance.value = targetPosition.sub(this.mesh.position).length();
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

    this.isRunning = true;
  }

  animationControllerUpdateCallback(progress) {
    this.material.uniforms.progress.value = progress;
    this.scene.renderScene();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.scene.removeSceneObject(this.mesh);
    this.animationController.stop();
    this.isRunning = false;
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

    if (this.startSubscription) {
      this.startSubscription.dispose();
      this.startSubscription = null;
    }
  }
}
