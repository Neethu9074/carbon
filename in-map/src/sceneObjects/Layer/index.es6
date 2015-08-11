import THREE from 'three';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {getIdString} from 'in-services/util/snapshots';

import CollisionComponent from '../../components/CollisionObjectComponent';
import HighlightingComponent from '../../components/HighlightingComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../geometries';
import MeshComponent from '../../components/MeshComponent';
import {selectedSceneObject, currentTooltip} from '../../stores/mapStore';
import SceneObject from '../SceneObject/index';
// import TooltipLayer from '../Tooltips/Layer';

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

    this.temp = zoomLevel.subscribe(newLevel => {
      const activateCollisions = newLevel === level.nearest && this.isActive();
      this.components.collision.stateMachine.changeStateProperty('active', activateCollisions);
    });

    // this.tooltip = new TooltipLayer(this);

    this.addSubscription(selectedSceneObject.subscribe(so =>
      this.onSceneObjectSelected(so)
    ));
  }

  onHighlightEnter() {

    //set the selected snapshot store
    if(this.isThisSelected) {
      selectedSnapshot.select(this.snapshot);
    }
    //show the tooltip on hover
    currentTooltip.emit(null);

    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', true);
  }

  onHighlightLeave() {
    //dispose the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', false);
  }

  onSelectedEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', true);
  }

  onSelectedHighlightEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', true);
  }

  onSelectedHighlightLeave() {
    //hide the border highlighting stuff
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', false);
  }

  onSelectedLeave() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', false);
  }


  initComponents() {
    super.initComponents();

    this.components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 3
    });
    // the default state for collisions on layer is inactive. collisions are only
    // active, if the layer is active and the zoomLevel is nearest so that you are
    // close to the layer with the camera
    this.components.collision.stateMachine.changeStateProperty('active', false);

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

    //add the highlighting component to handle the highlighting of a node
    //this is different to solidMesh since the highlighting is like a mouseOver effect
    this.components.highlighting = new HighlightingComponent({sceneObject: this});
    this.components.highlighting.stateMachine.changeStateProperty('active', false);
  }

  onSceneObjectSelected(obj) {
    const isThisSelected = (obj && obj.id === this.id) ?
      true : false;

    this.stateMachine.changeStateProperty('selected', isThisSelected);

    //set the selected snapshot store
    if(isThisSelected) {
      selectedSnapshot.select(this.snapshot);
    }
  }

  updateSnapshot(snapshot) {
    this.snapshot = snapshot;
  }

  positionChanged(x, y, z) {
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
  }

  setHeight(height) {
    this.height = height;
    this.getComponent('collision').sizeChanged(0.9, height, 0.9);
    this.getComponent('mesh').sizeChanged(0.9, height, 0.9);
    this.getComponent('highlighting').sizeChanged(0.9, height, 0.9);
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
