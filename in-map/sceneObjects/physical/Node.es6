import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';
import nodes from 'in-map/stores/physical/nodes';


export default class Node extends SceneObject {

  constructor(params) {
    super(params.id);

    this.group = params.group;
    this._cachedLabel = this.id;
  }

  init() {
    super.init();

    nodes.add(this.id);
    this.group.addNode(this.id, this);
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));
  }

  dispose() {
    super.dispose();

    nodes.remove(this.id);
    this.group.removeNode(this.id);

    this._cachedLabel = null;
    this.group = null;
  }
}
