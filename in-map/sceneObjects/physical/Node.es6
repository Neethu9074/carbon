import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
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
    this.addComponent('collision', new CollisionComponent(this, collisionDetection.predefinedCollisionObjects.Box, 0));
    this.addComponent('icon', new IconComponent(this, 3));
    this.addComponent('snapshot', new SnapshotComponent(this));
  }

  initEvents() {
    this.addSubscription(highlightedEntityId$.subscribe(id => {
      if (id === this.id) {
        console.log('THIS');
      }
    }));
  }

  dispose() {
    super.dispose();

    nodes.remove(this.id);
    this.group.removeNode(this.id);

    this._cachedLabel = null;
    this.group = null;
  }
}
