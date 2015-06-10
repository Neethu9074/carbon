'use strict';

import THREE from 'three';
import _ from 'lodash';


export default class SingleMeshFactory {

  constructor({scene}) {
    this.scene = scene;

    //stores all added fragments to create the global geometry
    this.fragments = [];

    //represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();

    this.material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending
    });

    //a global mesh that stores global geometry
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.matrixAutoUpdate = false;
    mesh.rotationAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 10;
    this.mesh = mesh;

    scene.addSceneObject(mesh);
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

    } else {
      this.fragments.push({
        id,
        vertices: contentProvider.getVertices(),
        colors: contentProvider.getColors()
      });
    }
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  removeFragment(id) {
    _.remove(this.fragments, fragment => fragment.id === id);
  }

  buildGeometry() {
    let vertices = [];
    let colors = [];

    this.fragments.forEach(fragment => {
      const fragVertices = fragment.vertices;
      const fragColors = fragment.colors;

      vertices = vertices.concat(fragVertices);
      colors = colors.concat(fragColors);
    });

    this.updateGeometry({
      colors: new Float32Array(colors),
      vertices: new Float32Array(vertices)
    });
  }

  updateGeometry({colors, vertices}) {
    const geometry = this.geometry;

    geometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, 3)); //x, y, z

    geometry.addAttribute('color',
      new THREE.BufferAttribute(colors, 3)); //r, g, b

    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.fragments = null;
  }
}
