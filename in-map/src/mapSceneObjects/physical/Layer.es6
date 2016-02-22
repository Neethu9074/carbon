import THREE from 'three';

import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import HighlightingComponent from '../../components/physical/HighlightingComponent';
import CollisionComponent from '../../components/common/CollisionObjectComponent';
import HealthComponent from '../../components/common/HealthComponent';
import MeshComponent from '../../components/common/MeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import {cubeGeometry, defaultGeometryMaterial} from '../common/geometries';
import SceneObjectWithSnapshot from '../common/SceneObjectWithSnapshot';
import TooltipLayer from '../../tooltips/physical/Layer';
import {currentTooltip} from '../../stores';

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

    this.addSubscription(this.eventEmitter.on('healthChanged').subscribe(this.healthChanged.bind(this)));
  }

  onHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    currentTooltip.emit(this.tooltip);
  }

  onHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    currentTooltip.emit(this.tooltip);
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInactiveLeave() {
    super.onInactiveLeave();

    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    const activateCollisions = this.currentZoomLevel === level.nearest ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
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

    // add the highlight component to handle the highlight of a node
    // this is different to solidMesh since the highlight is like a mouseOver effect
    components.highlight = new HighlightingComponent({sceneObject: this});
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
    this.eventEmitter.emit('colorChanged', this.calculateColorForHealth(newHealth));
  }

  setHeight(height) {
    this.eventEmitter.emit('sizeChanged', { x: MARGIN, y: height, z: MARGIN });
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
