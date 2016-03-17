import THREE from 'three';
// import find from 'lodash/find';
import remove from 'lodash/remove';


const find = (array, predicate) => {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
};


const UPDATE_FLAGS = {
  ADD: 1,
  REMOVE: 0
};

export default class SingleMeshFactory {

  constructor({scene, renderOrder = 2, params}) {
    this.scene = scene;
    this.params = params;

    // stores all added fragments to create the global geometry
    this.fragments = [];

    // the global arrays containing the combined stream data
    this.vertices = [];
    this.colors = [];

    // stores all added fragments that needs an update on global geometry
    this.fragmentQueue = {};

    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = this.getMaterial();

    // a global mesh that stores global geometry
    const mesh = this.mesh = this.getMesh();
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = renderOrder;

    if (__DEV__) {
      this.numberUpdates = 0;
    }

    this.updateGeometry();
    scene.addSceneObject(mesh);
  }

  // must be implemented by extending classes
  getMaterial() { throw new Error('PLEASE OVERRIDE METHOD'); }
  getMesh() { throw new Error('PLEASE OVERRIDE METHOD'); }

  addFragment({id, contentProvider, additionalParams}) {
    let fragment = this.getFragment(id);

    if (fragment) {
      this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.ADD);

    } else {
      fragment = { id };

      this.fragments.push(fragment);
      this.queueFragment(fragment, 0, UPDATE_FLAGS.ADD);
    }

    fragment.vertices = contentProvider.getVertices();
    fragment.colors = contentProvider.getColors();
    fragment.additionalParams = additionalParams;
  }

  getFragment(id) {
    return find(this.fragments, fragment => fragment.id === id);
  }

  removeFragment(id) {
    const fragment = this.getFragment(id);
    if (!fragment) {
      return;
    }

    this.queueFragment(fragment, fragment.vertices.length, UPDATE_FLAGS.REMOVE);
  }

  queueFragment(fragment, itemsToBeDeleted, mode) {
    this.fragmentQueue[fragment.id] = {fragment, itemsToBeDeleted, mode};
  }

  rebuild() {
    const keys = Object.keys(this.fragmentQueue);
    if (keys.length === 0) {
      return;
    }

    keys.forEach(id => {
      const item = this.fragmentQueue[id];

      if (item.mode === UPDATE_FLAGS.ADD) {
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
    fragment.vertices = [];
    fragment.colors = [];

    this.updateGeometryByFragment(fragment, item.itemsToBeDeleted);
    remove(this.fragments, frag => frag.id === fragment.id);
  }

  updateGeometryByFragment(fragment, numElements = 0) {
    let indexInVertices = 0;
    for (let i = 0; i < this.fragments.length; i++) {
      const frag = this.fragments[i];
      if (frag.id === fragment.id) {
        break;
      }
      indexInVertices += frag.vertices.length;
    }

    const args = [indexInVertices, numElements].concat(fragment.vertices);
    Array.prototype.splice.apply(this.vertices, args);

    const args2 = [indexInVertices, numElements].concat(fragment.colors);
    Array.prototype.splice.apply(this.colors, args2);

    // this.vertices.splice(indexInVertices, numElements, ...fragment.vertices);
    // this.colors.splice(indexInVertices, numElements, ...fragment.colors);
  }

  updateGeometry() {
    const geometry = this.geometry;

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    if (__DEV__) {
      this.numberUpdates++;
    }
  }

  dispose() {
    this.scene.removeSceneObject(this.mesh);

    this.geometry.dispose();
    this.material.dispose();

    this.mesh = null;
    this.scene = null;
    this.params = null;
    this.colors = null;
    this.geometry = null;
    this.material = null;
    this.vertices = null;
    this.fragments = null;
    this.fragmentQueue = null;

  }
}
