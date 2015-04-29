'use strict';

import THREE from 'three';

import _ from 'lodash';


export default class AbstractMeshCreationFactory {
  constructor({scene}) {

    this.scene = scene;

    //represents the geometry for all combined fragments
    this.globalGeometry = new THREE.Geometry();

    //a global mesh that stores global geometry
    this.globalMesh = new THREE.Mesh();

    //stores all added fragments to create the global geometry
    this.fragments = [];

    //bind methods
    this.update = this.update.bind(this);

    this.registerEvents();
    this.rebuildGlobalMesh = false;
  }

  registerEvents() {
    const update = this.update;
    this.subscription = this.scene.emitter.on('beginUpdate').subscribe(
      //onEmit
      function() {
        update();
      }
    );
  }

  update() {
    if (this.rebuildGlobalMesh) {
      this.rebuild();
      this.rebuildGlobalMesh = false;
    }
  }

  addFragment() {
    throw {message: 'NOT IMPLEMENTED EXCEPTION'};
  }

  removeFragment(id) {
    _.remove(this.fragments, fragment => fragment.id === id);
  }

  //abstract rebuild method has to be implemented
  rebuild() {
    throw {message: 'NOT IMPLEMENTED EXCEPTION'};
  }

  //returns all registered objects which are enabled
  getLegalFragments() {
    return this.fragments.filter(item => item.enabled);
  }

  disableFragment(id) {
    this.fragments.find(item => item.id === id).enabled = false;

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }

  enableFragment(id) {
    this.fragments.find(item => item.id === id).enabled = true;

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }
}
