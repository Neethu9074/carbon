import THREE from 'three';
import _ from 'lodash';


export default class SingleMeshMetricFactory {

  constructor({scene, renderOrder=2}) {
    this.scene = scene;

    //stores all added fragments to create the global geometry
    this.fragments = [];

    //represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      wireframe: true
    });

    //a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.matrixAutoUpdate = false;
    mesh.rotationAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = renderOrder;

    this.buildGeometry();
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

      this.updateGeometryByFragment(match, match.vertices.length);

    } else {
      const fragment = {
        id,
        vertices: contentProvider.getVertices()
      };

      this.fragments.push(fragment);

      //calculate the index of the fragment where it was inserted
      fragment.index = this.fragments.indexOf(fragment);

      this.updateGeometryByFragment(fragment, 0);
    }
  }

  updateGeometryByFragment(fragment, numElements = 0) {
    let indexInVertices = 0;
    const till = this.fragments.indexOf(fragment);
    for (let i = 0; i < till; i++) {
      indexInVertices += this.fragments[i].vertices.length;
    }

    this.vertices.splice(indexInVertices, numElements, ...fragment.vertices);
    this.updateGeometry({vertices: this.vertices});
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  removeFragment(id) {
    const fragment = this.getFragment(id);
    if(!fragment) {
      return;
    }

    const numElementsToBeDeleted = fragment.vertices.length;
    fragment.vertices = [];
    fragment.colors = [];
    this.updateGeometryByFragment(fragment, numElementsToBeDeleted);

    _.remove(this.fragments, frag => frag.id === id);
  }

  buildGeometry() {
    const vertices = [];

    this.vertices = vertices;
    this.updateGeometry({vertices});
  }

  updateGeometry({vertices}) {
    const geometry = this.geometry;

    geometry.addAttribute('position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3));

    geometry.attributes.position.needsUpdate = true;
  }

  setMetricValues(id, values) {
    const fragment = this.getFragment(id);
    if(!fragment) {
      return;
    }

    fragment.values = values;
  }

  //is ticked per time
  updateHeights() {
    const frags = this.fragments;
    const numCubes = frags.length;
    const numElementsPerUv = 2; //u & v
    const uvs = [];

    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      const values = fragment.values;
      const vertices = fragment.vertices;

      for (let iSlice = 0; iSlice < vertices.length; iSlice += 54) {
        const sliceStart = vertices[iSlice];
        for (let iY = 1; iY < 54; iY += 3) {
          vertices[sliceStart + iY] = values[0];
        }
      }
    }

    this.geometry.addAttribute('uv',
      new THREE.BufferAttribute(new Float32Array(uvs), numElementsPerUv));
  }

  dispose() {
    this.fragments = null;
  }
}
