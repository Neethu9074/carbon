import THREE from 'three';
import _ from 'lodash';


const UPDATE_FLAGS = {
  ADD: 1,
  REMOVE: 0
};

export default class SingleMeshFactory {

  constructor({scene, renderOrder = 2}) {
    this.scene = scene;

    //stores all added fragments to create the global geometry
    this.fragments = [];

    //the global arrays containing the combined stream data
    this.vertices = [];
    this.colors = [];

    //stores all added fragments that needs an update on global geometry
    this.fragmentQueue = Object.create(null);

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
  }

  // must be implemented by extending classes
  getMaterial() { throw new Error('NOT IMPLEMENTED YET'); }
  getMesh() { throw new Error('NOT IMPLEMENTED YET'); }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  addFragment({id, contentProvider}) {
    const match = this.getFragment(id);
    if(match) {
      match.vertices = contentProvider.getVertices();
      match.colors = contentProvider.getColors();

      this.queueFragment(match, match.vertices.length, UPDATE_FLAGS.ADD);

    } else {
      const fragment = {
        id,
        vertices: contentProvider.getVertices(),
        colors: contentProvider.getColors()
      };

      this.fragments.push(fragment);
      this.queueFragment(fragment, 0, UPDATE_FLAGS.ADD);
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
    this.fragments.forEach((frag, index) => {frag.index = index; });

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

    //to clear the hole queue just create an empty object
    this.fragmentQueue = Object.create(null);
  }

  removeFragmentFromGeometry(item) {
    const fragment = item.fragment;
    fragment.vertices = [];
    fragment.colors = [];

    this.updateGeometryByFragment(fragment, item.itemsToBeDeleted);
    _.remove(this.fragments, frag => frag.id === fragment.id);
    this.fragments.forEach((frag, index) => {frag.index = index; });
  }

  updateGeometryByFragment(fragment, numElements = 0) {
    let indexInVertices = 0;
    for (let i = 0; i < fragment.index; i++) {
      indexInVertices += this.fragments[i].vertices.length;
    }

    this.vertices.splice(indexInVertices, numElements, ...fragment.vertices);
    this.colors.splice(indexInVertices, numElements, ...fragment.colors);
  }

  updateGeometry() {
    const geometry = this.geometry;

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    if(__DEV__) {
      this.numberUpdates++;
    }
  }

  dispose() {
    this.scene.removeSceneObject(this.mesh);

    this.fragments = null;
  }
}
