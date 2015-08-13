import THREE from 'three';
import _ from 'lodash';

const ADD = 1;
const REMOVE = 0;


export default class SingleMeshFactory {

  constructor({scene, renderOrder=2}) {
    this.scene = scene;

    //stores all added fragments to create the global geometry
    this.fragments = [];

    //stores all added fragments that needs an update on global geometry
    this.fragmentToUpdateQueue = {};
    this.fragmentToRemoveQueue = {};

    this.vertices = [];
    this.colors = [];

    //represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true
    });

    //a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.matrixAutoUpdate = false;
    mesh.rotationAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = renderOrder;

    if(__DEV__) {
      this.numberUpdates = 0;
    }

    this.updateGeometry();
    this.scene.addSceneObject(this.mesh);
  }

  setMaterial(material) {
    this.material = material;
    this.mesh.material = material;
  }

  addFragment({id, contentProvider}) {
    const match = this.getFragment(id);
    if(match) {
      match.vertices = contentProvider.getVertices();
      match.colors = contentProvider.getColors();

      this.queueFragment(match, match.vertices.length, ADD);

    } else {
      const fragment = {
        id,
        vertices: contentProvider.getVertices(),
        colors: contentProvider.getColors()
      };

      this.fragments.push(fragment);
      this.queueFragment(fragment, 0, ADD);
    }
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  removeFragment(id) {
    const fragment = this.getFragment(id);
    if(!fragment) {
      return;
    }

    this.queueFragment(fragment, fragment.vertices.length, REMOVE);
  }

  updateGeometryByFragment(fragment, numElements=0) {
    const vertices = this.vertices;
    const colors = this.colors;

    let indexInVertices = 0;
    for (let i = 0; i < fragment.index; i++) {
      indexInVertices += this.fragments[i].vertices.length;
    }

    vertices.splice(indexInVertices, numElements, ...fragment.vertices);
    colors.splice(indexInVertices, numElements, ...fragment.colors);
  }

  queueFragment(fragment, itemsToBeDeleted, mode) {
    if (mode === ADD) {
      this.fragmentToUpdateQueue[fragment.id] = {fragment, itemsToBeDeleted};
    } else if (mode === REMOVE) {
      this.fragmentToRemoveQueue[fragment.id] = {fragment, itemsToBeDeleted};
    }
  }

  rebuild() {
    if(_.isEmpty(this.fragmentToUpdateQueue) &&
       _.isEmpty(this.fragmentToRemoveQueue)) {
      return;
    }

    this.fragments.forEach((frag, index) => {frag.index = index; });

    this.addFragments();
    this.removeFragments();

    this.updateGeometry();
  }

  addFragments() {
    const keys = Object.keys(this.fragmentToUpdateQueue);
    if(keys.length === 0) {
      return;
    }

    keys.forEach(id => {
      const item = this.fragmentToUpdateQueue[id];
      const fragment = item.fragment;
      this.updateGeometryByFragment(fragment, item.itemsToBeDeleted);
    });

    //to clear the hole queue just create an empty object
    this.fragmentToUpdateQueue = {};
  }

  removeFragments() {
    const keys = Object.keys(this.fragmentToRemoveQueue);
    if(keys.length === 0) {
      return;
    }

    keys.forEach(id => {
      const item = this.fragmentToRemoveQueue[id];
      const fragment = item.fragment;
      fragment.vertices = [];
      fragment.colors = [];
      this.updateGeometryByFragment(fragment, item.itemsToBeDeleted);
      _.remove(this.fragments, frag => frag.id === fragment.id);
    });

    //to clear the hole queue just create an empty object
    this.fragmentToRemoveQueue = {};
  }

  updateGeometry() {
    const colors = this.colors;
    const vertices = this.vertices;
    const geometry = this.geometry;

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    if(__DEV__) {
      this.numberUpdates++;
    }
  }

  dispose() {
    this.fragments = null;
  }
}
