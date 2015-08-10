import THREE from 'three';
import _ from 'lodash';

import eventBus from 'in-services/eventbus';


export default class AbstractMeshCreationFactory {
  constructor({scene}) {

    this.scene = scene;

    //represents the geometry for all combined fragments
    this.globalGeometry = new THREE.BufferGeometry();

    //a global mesh that stores global geometry
    this.globalMesh = new THREE.Mesh(this.globalGeometry);
    this.globalMesh.matrixAutoUpdate = false;
    this.globalMesh.renderOrder = 2;
    this.globalMesh.frustumCulled = false;

    //stores all added fragments to create the global geometry
    this.fragments = [];

    this.registerEvents();
    this.rebuildGlobalMesh = false;
  }

  registerEvents() {
    this.subscription = eventBus.on('beginUpdate').subscribe(
      this.update.bind(this));
  }

  setMaterial(material) {
    this.material = material;
    this.globalMesh.material = material;
  }

  update() {
    if (this.rebuildGlobalMesh) {
      this.rebuild();
      this.rebuildGlobalMesh = false;

      this.scene.renderScene();
    }
  }

  addFragment(fragment) {
    this.fragments.push(fragment);

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }

  getFragment(id) {
    return _.find(this.fragments, fragment => fragment.id === id);
  }

  removeFragment(id) {
    _.remove(this.fragments, fragment => fragment.id === id);

    this.rebuildGlobalMesh = true;
  }

  //abstract rebuild method has to be implemented
  rebuild() {
    throw {message: 'NOT IMPLEMENTED EXCEPTION'};
  }

  //returns all registered objects which are enabled
  getLegalFragments() {
    return this.fragments.filter(item =>
      item.enabled || item.enabled === undefined);
  }

  enableFragment(id, enabled = true) {
    const match = this.getFragment(id);
    if(match && match.enabled !== enabled) {
      match.enabled = enabled;

      //set rebuild to true
      //so that the mesh will be generated on the next event
      this.rebuildGlobalMesh = true;
    }
  }
}
