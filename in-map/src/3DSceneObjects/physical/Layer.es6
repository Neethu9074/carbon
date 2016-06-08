import THREE from 'three';

import TooltipLayer from 'in-map/src/2DSceneObjects/tooltips/physical/Layer';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {theme} from 'in-services/theme';
import eventBus from 'in-map/eventbus';

import HighlightingComponent from '../../components/physical/HighlightingComponent';
import CollisionComponent from '../../components/common/CollisionObjectComponent';
import HealthComponent from '../../components/common/HealthComponent';
import MeshComponent from '../../components/common/MeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import {cubeGeometry, defaultGeometryMaterial} from '../common/geometries';
import SceneObjectWithSnapshot from '../common/SceneObjectWithSnapshot';

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

    this.registerEvents();
  }

  onHighlightEnter() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
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
      factory: this.getFactory('layerSMF')
    });

    // add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({ contentProvider: pcm }),
      factory: this.getFactory('highlightingSMF')
    });
    components.solidMesh.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // add the highlight component to handle the highlight of a node
    // this is different to solidMesh since the highlight is like a mouseOver effect
    components.highlight = new HighlightingComponent({sceneObject: this});
  }

  registerEvents() {
    this.addSubscriptions([
      zoomLevel.subscribe(newLevel => {
        this.currentZoomLevel = newLevel;
        const activateCollisions = (newLevel === level.nearest && this.isActive()) ?
        PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
        this.components.collision.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, activateCollisions);
      }),

      this.eventEmitter.on('healthChanged').subscribe(this.healthChanged.bind(this)),

      eventBus.on('focusEntityId').subscribe(id => {
        if (this.id === id) {
          eventBus.emit('flyToEntity', this);
        }
      })
    ]);
  }

  getTooltip() {
    return this.tooltip;
  }

  onSnapshotUpdated(snapshot) {
    // health component needs the snapshot so you can create it if you have one
    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }

    this.type = snapshot.get('plugin');
    this.parent.needsUpdate = true;
  }

  healthChanged(maxSeverity) {
    const color = new THREE.Color(theme.health[Math.floor(maxSeverity)]);

    this.eventEmitter.emit('colorChanged', color);
    return color;
  }

  setHeight(height) {
    this.eventEmitter.emit('sizeChanged', { x: MARGIN, y: height, z: MARGIN });
  }

  dispose() {
    super.dispose();
  }
}
