import THREE from 'three';

import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import HighlightingComponent from '../../components/HighlightingComponents/Cube';
import CollisionComponent from '../../components/CollisionObjectComponent';
import HealthComponent from '../../components/HealthComponent';
import MeshComponent from '../../components/MeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import {longClickedSceneObject, currentTooltip} from '../../stores';
import {cubeGeometry, defaultGeometryMaterial} from '../geometries';
import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';
import TooltipLayer from '../../Tooltips/Layer';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';


const MARGIN = 0.8;

export default class Layer extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.type = this.id;
    this.snapshot = undefined;
    this.tooltip = new TooltipLayer(this);

    zoomLevel.subscribe(newLevel => {
      this.currentZoomLevel = newLevel;
      const activateCollisions = (newLevel === level.nearest && this.isActive()) ?
        PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.components.collision.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, activateCollisions);
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
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    currentTooltip.emit(this.tooltip);
  }

  onHighlightLeave() {
    // dispose the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    // surounds the node with a white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedHighlightEnter() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    // surounds the node with a white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    currentTooltip.emit(this.tooltip);
  }

  onSelectedHighlightLeave() {
    // hide the border highlighting stuff
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // dispose the white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedLeave() {
    // setup the border highlight
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // dispose the white hull
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInactiveLeave() {
    // enables all components
    super.onInactiveLeave();

    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    const activateCollisions = (this.currentZoomLevel === level.nearest) ?
      PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.getComponent('collision').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, activateCollisions);
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
    components.collision.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

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
      factory: this.scene.highlightingSingleMeshFactory
    });
    components.solidMesh.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // add the highlighting component to handle the highlighting of a node
    // this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject: this});
  }

  onSnapshotUpdated(snapshot) {
    // health component needs the snapshot so you can create it if you have one
    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }

    this.type = snapshot.get('plugin');
    this.parent.needsUpdate = true;
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
    this.getComponent('mesh').sizeChanged(MARGIN, height, MARGIN);
    this.getComponent('solidMesh').sizeChanged(MARGIN, height, MARGIN);
    this.getComponent('collision').sizeChanged(MARGIN, height, MARGIN);
    this.getComponent('highlighting').sizeChanged(MARGIN, height, MARGIN);
  }

  calculateColorForHealth(newHealth) {
    const colors = theme.map.colors;

    if (newHealth === health.warning) {
      return new THREE.Color(colors.warning);
    } else if (newHealth === health.danger) {
      return new THREE.Color(colors.critical);
    }
    return new THREE.Color(colors.cubeBasicColor);
  }

  dispose() {
    super.dispose();
  }
}
