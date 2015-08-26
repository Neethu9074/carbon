import TWEEN from 'tween.js';
import THREE from 'three';
import _ from 'lodash';

import eventBus from 'in-services/eventbus';

import fragmentShader from './metricFragmentShader.glsl';
import vertexShader from './metricVertexShader.glsl';


// the flags mark in the fragmentsQueue weather a fragment should be added/updated or deleted
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
    this.oldHeights = []; // storing the old heights so the graphics card knows the origin
    this.newHeights = []; // storing the old heights so the graphics card knows where to animate to

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

    // setup the tween animation for updating the progress
    this.setupAnimation();
  }

  setupAnimation() {
    const from = {v: 0.0}; // 0%
    const to = {v: 1.0}; // 100%

    // updating from 0 to 1 in 500 ms
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onUpdate(v => this.progress.value = v);
    this.animation = animation;

    this.updateSubscribtion = eventBus.on('updateTween').subscribe(time =>
      this.animation.update(time)
    );
  }

  getMaterial() {
    // the global used progress for all vertices in the vertex shader
    const progress = this.progress = { type: 'f', value: 0.0 };

    // the old and new y positions for each vertex in the vertex shader
    const attributes = this.attributes = {
      oldHeight: { type: 'f' },
      newHeight: { type: 'f' }
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

  addFragment({id, contentProvider}) {
    // the fragment is either a new one or an updated if it was found inside the fragments
    let fragment = this.getFragment(id);

    if(fragment) {
      // update the old array data and replace with the new
      this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.ADD);

    } else {
      fragment = { id, contentProvider };
      this.fragments.push(fragment);
      this.queueFragment(fragment, 0, UPDATE_FLAGS.ADD);
    }

    fragment.sliceIndices =
      contentProvider // SCM
      .contentProvider // PCM
      .contentProvider.getSliceIndices();

    // old and new heights are 0 for each vertex at the beginning
    fragment.oldHeights = fragment.sliceIndices.map(() => 0);
    fragment.newHeights = fragment.oldHeights.slice();

    fragment.vertices = contentProvider.getVertices();
    fragment.colors = contentProvider.getColors();

    return fragment;
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  removeFragment(fragment) {
    // store the fragment in the queue with a REMOVE flag
    this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.REMOVE);
  }

  queueFragment(fragment, itemsToBeDeleted, mode) {
    this.fragmentQueue[fragment.id] = { fragment, itemsToBeDeleted, mode };
  }

  rebuild() {
    // iterate over all items inside the queue, items = keys of object
    const keys = Object.keys(this.fragmentQueue);
    if(keys.length === 0) {
      return;
    }

    keys.forEach(id => {
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
    // clear all array data and remove the element from the global array
    const fragment = item.fragment;
    fragment.oldHeights = [];
    fragment.newHeights = [];
    fragment.vertices = [];
    fragment.colors = [];

    this.updateGeometryByFragment(fragment, item.itemsToBeDeleted);
    _.remove(this.fragments, frag => frag.id === fragment.id);
  }

  updateGeometryByFragment(fragment, numElements = 0) {
    // numElements are the number of vertices * 3 because each vertex has 3 components
    // x, y and z but only one height informaion so 1 / 3
    const numElementsForHeights = numElements / 3;
    const fragments = this.fragments;

    // since the arrays doesnt have the same size we need two cursor storing the index
    let indexInVertices = 0;
    let indexInHeights = 0;

    for (let i = 0; i < fragments.length; i++) {
      const frag = fragments[i];
      if (frag.id === fragment.id) {
        break;
      }

      indexInVertices += frag.vertices.length;
      indexInHeights += frag.oldHeights.length;
    }

    // this is the most performant way to splice an array

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
    // first stop the animation and do all array calculation stuff before restarting
    this.animation.stop();

    const geometry = this.geometry;
    const allOld = [];
    const allNew = [];

    this.fragments.forEach(fragment => {
      // swap heights arrays so new became old
      fragment.oldHeights = fragment.newHeights;
      this.setHeightsForFragment(fragment);

      allOld.push(fragment.oldHeights);
      allNew.push(fragment.newHeights);
    });

    // this is the most performant way to cancat n arrays
    // http://jsperf.com/multi-array-concat/7
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

    // first element begins at 0 but that values is not inside the values from metrics
    // array send from websocket, so add it manually
    const values = [0].concat(fragment.values);

    // this array should contain all summed information to get a correct stacked cube
    // 0, 1, 2, 1, 5 -> 0, 1, 3, 4, 9
    const summedA = [];
    let sum = 0;

    values.forEach((value, index) => {
      if (value === undefined) {
        values[index] = 0.01;
      }
      summedA[index] = sum;
      sum += values[index];
    });

    fragment.sliceIndices
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
