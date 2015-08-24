import THREE from 'three';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';

import CollisionComponent from '../../components/CollisionObjectComponent';
import HighlightingComponent from '../../components/HighlightingComponent';

import {selectedSceneObject, currentTooltip} from '../../stores/mapStore';
import {cubeGeometry, defaultGeometryMaterial} from '../geometries';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import MeshComponent from '../../components/MeshComponent';
import TooltipLayer from '../Tooltips/Layer';
import SceneObject from '../SceneObject';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';


const margin = 0.9;

export default class Layer extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent, id: snapshot.get('id')});

    this.snapshot = snapshot;
    this.layerIndex = 0; //see this.setLayerIndex

    this.getComponent('position').setPosition(Infinity, 0, 0);

    this.temp = zoomLevel.subscribe(newLevel => {
      this.currentZoomLevel = newLevel;
      const activateCollisions = (newLevel === level.nearest && this.isActive()) ?
        PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.components.collision.stateMachine.changeStateProperty('active', activateCollisions);
    });

    this.tooltip = new TooltipLayer(this);

    this.subscriptions.push(
      selectedSnapshot.selectedSnapshot.async().subscribe(selected => {
        if(selected && this.snapshot.get('id') === selected.get('id') && !this.isSelected()) {
          selectedSceneObject.emit({sceneObject: this});
        }
      })
    );

    this.addSubscription(selectedSceneObject.subscribe(event =>
      this.onSceneObjectSelected(event.sceneObject)
    ));
  }

  onHighlightEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    //dispose the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);

    //surounds the node with a white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onSelectedHighlightEnter() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);

    //surounds the node with a white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
    //hide the border highlighting stuff
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    //dispose the white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedLeave() {
    //setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    //dispose the white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onHiddenLeave() {
    //enables all components
    super.onHiddenLeave();

    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInactiveLeave() {
    //enables all components
    super.onInactiveLeave();

    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    const activateCollisions = (this.currentZoomLevel === level.nearest) ?
      PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.getComponent('collision').stateMachine.changeStateProperty('active', activateCollisions);
  }


  initComponents() {
    super.initComponents();

    const id = this.id;
    const components = this.components;

    components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 3
    });
    // the default state for collisions on layer is inactive. collisions are only
    // active, if the layer is active and the zoomLevel is nearest so that you are
    // close to the layer with the camera
    components.collision.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    const pcm = new PCM({
      contentProvider: new SCM({
        contentProvider: new CCP()
      })
    });

    //add the mesh component to handle visual representation of the node
    components.mesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({ contentProvider: pcm }),
      id,
      factory: this.scene.layerSingleMeshFactory
    });

    //add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      id: id + '_solidMesh',
      sceneObject: this,
      contentProvider: new CMCM({ contentProvider: pcm }),
      factory: this.scene.layerHighlightingSingleMeshFactory
    });
    components.solidMesh.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    //add the highlighting component to handle the highlighting of a node
    //this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject: this});
  }

  //is called via hover event
  onHighlight(highlighted) {
    super.onHighlight(highlighted);

    currentTooltip.emit(this.tooltip);
  }

  onSceneObjectSelected(obj) {
    const isThisSelected = (obj && obj.id === this.id) ?
      PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;

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
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('solidMesh').positionChanged(x, y, z);
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
  }

  setHeight(height) {
    this.height = height;
    this.getComponent('mesh').sizeChanged(margin, height, margin);
    this.getComponent('solidMesh').sizeChanged(margin, height, margin);
    this.getComponent('collision').sizeChanged(margin, height, margin);
    this.getComponent('highlighting').sizeChanged(margin, height, margin);
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
