import THREE from 'three';

import {getIdString} from 'in-services/util/snapshots';

import CollisionComponent from '../../components/CollisionObjectComponent';
import {cubeGeometry, defaultGeometryMaterial} from '../geometries';
import MeshComponent from '../../components/MeshComponent';
import SceneObject from '../SceneObject/index';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';


export default class Layer extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent, id: getIdString(snapshot)});

    this.snapshot = snapshot;
    this.layerIndex = 0; //see this.setLayerIndex

    this.getComponent('position').setPosition(Infinity, 0, 0);

    // this.tooltip = new Tooltip(this);
  }

  initComponents() {
    super.initComponents();

    this.components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 1
    });

    //add the mesh component to handle visual representation of the node
    this.components.mesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      id: this.id,
      factory: this.scene.layerSingleMeshFactory
    });
  }

  updateSnapshot(snapshot) {
    this.snapshot = snapshot;
  }

  positionChanged(x, y, z) {
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('mesh').positionChanged(x, y, z);
  }

  setHeight(height) {
    this.height = height;
    this.getComponent('collision').sizeChanged(1, height, 1);
    this.getComponent('mesh').sizeChanged(0.9, height, 0.9);
  }

  //this value is used to store the information of the layer of this layer
  // -----   layer 2
  // -----   layer 1
  // -----   layer 0 (bottom layer)
  setLayerIndex(index) {
    this.layerIndex = index;
  }

  dispose() {
    super.dispose();

    this.snapshot = null;
  }
}
