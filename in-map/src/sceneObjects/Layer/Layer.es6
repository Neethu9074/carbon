import THREE from 'three';

import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import CollisionComponent from '../../components/CollisionObjectComponent';
import HighlightingComponent from '../../components/HighlightingComponent';
import HealthComponent from '../../components/HealthComponent';
import MeshComponent from '../../components/MeshComponent';

import {longClickedSceneObject, currentTooltip} from '../../mapStores';
import {cubeGeometry, defaultGeometryMaterial} from '../geometries';
import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import TooltipLayer from '../Tooltips/Layer';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';


const margin = 0.8;

export default class Layer extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.label = this.id;
    this.snapshot = undefined;

    this.getComponent('position').setPosition(0, 0, 0);

    this.temp = zoomLevel.subscribe(newLevel => {
      this.currentZoomLevel = newLevel;
      const activateCollisions = (newLevel === level.nearest && this.isActive()) ?
        PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.components.collision.stateMachine.changeStateProperty('active', activateCollisions);
    });

    this.addSubscription(longClickedSceneObject.subscribe(so => {
      if (so && this.snapshot && so.id === this.id) {
        eventBus.emit('openDashboard', this.snapshot);
        tracking.events.openingADashboardUsingTheMap();
      }
    }));
  }

  onHighlightEnter() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    // dispose the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);

    // surounds the node with a white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onSelectedHighlightEnter() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);

    // surounds the node with a white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
    // hide the border highlighting stuff
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    // dispose the white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedLeave() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    // dispose the white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onHiddenLeave() {
    // enables all components
    super.onHiddenLeave();

    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInactiveLeave() {
    // enables all components
    super.onInactiveLeave();

    this.getComponent('highlighting').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    this.getComponent('solidMesh').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    const activateCollisions = (this.currentZoomLevel === level.nearest) ?
      PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.getComponent('collision').stateMachine.changeStateProperty('active', activateCollisions);
  }


  initComponents() {
    super.initComponents();

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

    // add the mesh component to handle visual representation of the node
    components.mesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({ contentProvider: pcm }),
      factory: this.scene.layerSingleMeshFactory
    });

    // add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({ contentProvider: pcm }),
      factory: this.scene.layerHighlightingSingleMeshFactory
    });
    components.solidMesh.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    // add the highlighting component to handle the highlighting of a node
    // this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject: this});
  }

  // is called via hover event
  onHighlight(highlighted) {
    super.onHighlight(highlighted);

    currentTooltip.emit(this.tooltip);
  }

  onSnapshotUpdated() {
    // tooltip needs the snapshot so you can create it if you have one
    if (!this.tooltip) {
      this.tooltip = new TooltipLayer(this);
    }

    // health component needs the snapshot so you can create it if you have one
    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }
  }

  healthChanged(newHealth) {
    const color = this.calculateColorForHealth(newHealth);
    this.getComponent('mesh').colorChanged(color.r, color.g, color.b);
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

  calculateColorForHealth(newHealth) {
    const colors = theme.map.colors;
    let color;

    if (newHealth === health.warning) {
      color = new THREE.Color(colors.warning);
    } else if (newHealth === health.danger) {
      color = new THREE.Color(colors.critical);
    } else {
      color = new THREE.Color(colors.layerBasicColor);
    }
    return {r: color.r, g: color.g, b: color.b};
  }

  dispose() {
    super.dispose();
  }
}
