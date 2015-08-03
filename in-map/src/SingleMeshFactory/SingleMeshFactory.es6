'use strict';

import THREE from 'three';
import _ from 'lodash';


export default class SingleMeshFactory {

  constructor({scene, renderOrder=2}) {
    this.scene = scene;

    //stores all added fragments to create the global geometry
    this.fragments = [];

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
      match.colors = contentProvider.getColors();

      this.updateGeometryByFragment(match, match.vertices.length);

    } else {
      const fragment = {
        id,
        vertices: contentProvider.getVertices(),
        colors: contentProvider.getColors()
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
    this.colors.splice(indexInVertices, numElements, ...fragment.colors);

    this.updateGeometry({vertices: this.vertices, colors: this.colors});
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
    this.fragments.forEach((frag, index) => {frag.index = index; });
  }

  buildGeometry() {
    const vertices = [];
    const colors = [];

    this.vertices = vertices;
    this.colors = colors;

    this.updateGeometry({colors, vertices});
  }

  updateGeometry({colors, vertices}) {
    const geometry = this.geometry;

    geometry.addAttribute('position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3));

    geometry.addAttribute('color',
      new THREE.BufferAttribute(new Float32Array(colors), 3));

    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.fragments = null;
  }
}
