/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';

export default class LayerPlaceHolder extends SceneObject {
  constructor(params) {
    super(params);

    this.node = params.node;
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'layer'));

    this.node.addLayer(this.id, this);
  }

  dispose() {
    super.dispose();

    this.node.removeLayer(this.id);
    this.node = null;
  }
}
