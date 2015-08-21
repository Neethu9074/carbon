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

  constructor({scene, renderOrder = 2}) {
    this.scene = scene;

    //stores all added fragments to create the global geometry
    this.fragments = [];

    //the global arrays containing the combined stream data
    this.colors = [];
    this.vertices = [];
    this.oldHeights = [];
    this.newHeights = [];

    //stores all added fragments that needs an update on global geometry
    this.fragmentQueue = {};

    //represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = this.getMaterial();

    //a global mesh that stores global geometry
    const mesh = this.mesh = this.getMesh();
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = renderOrder;

    if(__DEV__) {
      this.numberUpdates = 0;
    }

    this.updateGeometry();
    scene.addSceneObject(mesh);

    const from = {v: 0.0};
    const to = {v: 1.0};
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onUpdate(v => this.progress.value = v);
    this.animation = animation;

    this.updateSubscribtion = eventBus.on('updateTween').subscribe((time) => {
      this.animation.update(time);
    });
  }

  getMesh() {
    return new THREE.Mesh(this.geometry, this.material);
  }

  getMaterial() {
    const progress = this.progress = {
      type: 'f',
      value: 0.0
    };
    const attributes = this.attributes = {
      oldHeight: {	type: 'f', value: 0.0 },
      newHeight: {	type: 'f', value: 1.0 }
    };
    const material = new THREE.ShaderMaterial({
      uniforms: {
        progress: progress
      },
      attributes: attributes,
      vertexColors: THREE.VertexColors,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      wireframe: true
    });

    return material;
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  addFragment(fragment = {id, contentProvider, values}) {
    const colors = fragment.contentProvider.getColors();
    const vertices = fragment.contentProvider.getVertices();
    const oldHeights = fragment.contentProvider.contentProvider.getSliceIndices().map(() => 0);
    const newHeights = fragment.contentProvider.contentProvider.getSliceIndices().map(() => 0);

    const match = this.getFragment(fragment.id);
    if(match) {
      match.oldHeights = oldHeights;
      match.newHeights = newHeights;
      match.vertices = vertices;
      match.colors = colors;

      this.queueFragment(match, match.vertices.length, UPDATE_FLAGS.ADD);

    } else {
      const newFragment = {
        id: fragment.id,
        contentProvider: fragment.contentProvider,
        oldHeights,
        newHeights,
        vertices,
        colors
      };

      this.fragments.push(newFragment);
      this.queueFragment(newFragment, 0, UPDATE_FLAGS.ADD);
    }
  }

  removeFragment(id) {
    const fragment = this.getFragment(id);
    if(!fragment) {
      return;
    }

    this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.REMOVE);
  }

  queueFragment(fragment, itemsToBeDeleted, mode) {
    this.fragmentQueue[fragment.id] = {fragment, itemsToBeDeleted, mode};
  }

  rebuild() {
    const keys = Object.keys(this.fragmentQueue);
    if(keys.length === 0) {
      return;
    }

    //update indices

    keys.forEach(id => {
      const item = this.fragmentQueue[id];
      this.fragments.forEach((frag, index) => {frag.index = index; });

      if(item.mode === UPDATE_FLAGS.ADD) {
        this.updateGeometryByFragment(item.fragment, item.itemsToBeDeleted);
      } else {
        this.removeFragmentFromGeometry(item);
      }
    });

    this.updateGeometry();
    this.scene.renderScene();

    //to clear the hole queue just create an empty object
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
    this.fragments.forEach((frag, index) => {frag.index = index; });
  }

  updateGeometryByFragment(fragment, numElements = 0) {
    let indexInVertices = 0;
    let indexInHeights = 0;
    for (let i = 0; i < fragment.index; i++) {
      indexInVertices += this.fragments[i].vertices.length;
      indexInHeights += this.fragments[i].oldHeights.length;
    }

    Array.prototype.splice.apply(
      this.oldHeights,
      [indexInHeights, numElements / 3].concat(fragment.oldHeights));

    Array.prototype.splice.apply(
      this.newHeights,
      [indexInHeights, numElements / 3].concat(fragment.newHeights));

    Array.prototype.splice.apply(
      this.vertices,
      [indexInVertices, numElements].concat(fragment.vertices));

    Array.prototype.splice.apply(
      this.colors,
      [indexInVertices, numElements].concat(fragment.colors));
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

    // swap new to old height

    // get new and set as new

    this.animation.start();
  }

  getHeightsForFragment(fragment) {
    const oldHeights = [];
    const newHeights = [];
    const values = [0].concat(fragment.values);

    const indices = fragment.contentProvider.contentProvider.getSliceIndices();
    indices.forEach(index => {
      const lastValue = index === 0 ? 0 : values[index - 1];

      let summed = 0;
      for (let i = 0; i < index; i++) {
        summed += values[i];
      }
      const newValue = summed + values[index];

      oldHeights.push(lastValue); // old value
      newHeights.push(newValue); // new value
    });

    return {oldHeights, newHeights};
  }

  dispose() {
    this.updateSubscribtion.dispose();
    this.scene.removeSceneObject(this.mesh);

    this.fragments = null;
  }
}
