import THREE from 'three';
import TWEEN from 'tween.js';

import eventBus from 'in-services/eventbus';

import fragmentShader from './metricFragmentShader.glsl';
import vertexShader from './metricVertexShader.glsl';


const UPDATE_FLAGS = {
  ADD: 1,
  REMOVE: 0
};

export default class SingleMeshMetricFactory {

  constructor({scene}) {
    this.scene = scene;

    // stores all added fragments to create the global geometry
    this.fragments = [];

    // the global arrays containing the combined stream data
    this.colors = [];
    this.vertices = [];
    this.oldHeights = [];
    this.newHeights = [];

    // stores all added fragments that needs an update on global geometry
    this.fragmentQueue = {};

    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = this.getMaterial();

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;

    if(__DEV__) {
      this.numberUpdates = 0;
    }

    this.updateGeometry();
    scene.addSceneObject(mesh);

    this.setupAnimation();
  }

  setupAnimation() {
    const from = {v: 0.0};
    const to = {v: 1.0};
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onUpdate(v => this.progress.value = v);
    this.animation = animation;

    this.updateSubscribtion = eventBus.on('updateTween').subscribe(time =>
      this.animation.update(time)
    );
  }

  getMaterial() {
    const progress = this.progress = { type: 'f', value: 0.0 };

    const attributes = this.attributes = {
      oldHeight: { type: 'f', value: 0.0 },
      newHeight: { type: 'f', value: 1.0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      attributes: attributes,
      uniforms: { progress }
    });

    return material;
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  addFragment({id, contentProvider}) {
    let fragment = this.getFragment(id);
    if(fragment) {
      this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.ADD);
    } else {
      fragment = { id, contentProvider };
      this.fragments.push(fragment);
      this.queueFragment(fragment, 0, UPDATE_FLAGS.ADD);
    }

    fragment.oldHeights =
      contentProvider // SCM
      .contentProvider // PCM
      .contentProvider.getSliceIndices().map(() => 0);
    fragment.newHeights = fragment.oldHeights.slice();
    fragment.vertices = contentProvider.getVertices();
    fragment.colors = contentProvider.getColors();

    return fragment;
  }

  removeFragment(fragment) {
    this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.REMOVE);
  }

  queueFragment(fragment, itemsToBeDeleted, mode) {
    this.fragmentQueue[fragment.id] = { fragment, itemsToBeDeleted, mode };
  }

  rebuild() {
    const keys = Object.keys(this.fragmentQueue);
    if(keys.length === 0) {
      return;
    }

    keys.forEach(id => {
      // update indices
      this.fragments.forEach((frag, index) => { frag.index = index; });

      const item = this.fragmentQueue[id];
      if(item.mode === UPDATE_FLAGS.ADD) {
        this.updateGeometryByFragment(item.fragment, item.itemsToBeDeleted);
      } else {
        this.removeFragmentFromGeometry(item);
      }
    });

    this.updateGeometry();
    this.scene.renderScene();

    // to clear the hole queue just create an empty object
    this.fragmentQueue = {};
  }

  removeFragmentFromGeometry(item) {
    const fragment = item.fragment;
    fragment.oldHeights = [];
    fragment.newHeights = [];
    fragment.vertices = [];
    fragment.colors = [];

    this.updateGeometryByFragment(fragment, item.itemsToBeDeleted);
    _.remove(this.fragments, frag => frag.id === fragment.id);
  }

  updateGeometryByFragment(fragment, numElements = 0) {
    const numElementsForHeights = numElements / 3;

    let indexInVertices = 0;
    let indexInHeights = 0;
    for (let i = 0; i < fragment.index; i++) {
      const frag = this.fragments[i];
      indexInVertices += frag.vertices.length;
      indexInHeights += frag.oldHeights.length;
    }

    const headingForHeights = [indexInHeights, numElementsForHeights];
    const headingForVertices = [indexInVertices, numElements];

    Array.prototype.splice.apply(this.oldHeights, headingForHeights.slice().concat(fragment.oldHeights));
    Array.prototype.splice.apply(this.newHeights, headingForHeights.slice().concat(fragment.newHeights));
    Array.prototype.splice.apply(this.vertices, headingForVertices.slice().concat(fragment.vertices));
    Array.prototype.splice.apply(this.colors, headingForVertices.slice().concat(fragment.colors));
  }

  updateGeometry() {
    const geometry = this.geometry;

    geometry.addAttribute('oldHeight', new THREE.BufferAttribute(new Float32Array(this.oldHeights), 1));
    geometry.addAttribute('newHeight', new THREE.BufferAttribute(new Float32Array(this.newHeights), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));

    geometry.attributes.oldHeight.needsUpdate = true;
    geometry.attributes.newHeight.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    if(__DEV__) {
      this.numberUpdates++;
    }
  }

  updateHeights() {
    this.animation.stop();

    const geometry = this.geometry;
    const allOld = [];
    const allNew = [];

    this.fragments.forEach(fragment => {
      // swap heights arrays new -> old
      fragment.oldHeights = fragment.newHeights;
      this.setHeightsForFragment(fragment);

      allOld.push(fragment.oldHeights);
      allNew.push(fragment.newHeights);
    });

    this.oldHeights = [].concat.apply([], allOld);
    this.newHeights = [].concat.apply([], allNew);

    geometry.addAttribute('oldHeight', new THREE.BufferAttribute(new Float32Array(this.oldHeights), 1));
    geometry.addAttribute('newHeight', new THREE.BufferAttribute(new Float32Array(this.newHeights), 1));

    geometry.attributes.oldHeight.needsUpdate = true;
    geometry.attributes.newHeight.needsUpdate = true;

    this.animation.start();
  }

  setHeightsForFragment(fragment) {
    fragment.newHeights = [];

    const values = [0].concat(fragment.values); // first element begins at 0
    const summedA = [];
    let sum = 0;

    // 0, 1, 2, 1, 5 -> 0, 1, 3, 4, 9
    values.forEach((value, index) => {
      if (!value) {
        values[index] = 0.01;
      }
      summedA[index] = sum;
      sum += values[index];
    });

    fragment
      .contentProvider // SCM
      .contentProvider // PCM
      .contentProvider // SCCP
      .getSliceIndices()
      .forEach((sliceIndex, index) => {
        fragment.newHeights[index] = summedA[sliceIndex] + values[sliceIndex];
      }
    );
  }

  dispose() {
    this.updateSubscribtion.dispose();
    this.scene.removeSceneObject(this.mesh);

    this.fragments = null;
  }
}
