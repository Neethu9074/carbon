  import THREE from 'three';

import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/physical/Node';
import {focusEntityId$} from 'in-map/src/stores/focusEntity';
import {eventBus} from 'in-map/src/services/eventBus';
import {theme} from 'in-services/theme';

import ConnectionsHandlerComponent from 'in-map/src/components/physical/ConnectionsHandlerComponent';
import SnapshotComponent from 'in-map/src/components/common/SnapshotComponent/SnapshotComponent';
import GroundLineMeshComponent from 'in-map/src/components/physical/GroundLineMeshComponent';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import HighlightingComponent from 'in-map/src/components/physical/HighlightingComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import GroundMeshComponent from 'in-map/src/components/physical/GroundMeshComponent';
import HealthComponent from 'in-map/src/components/common/HealthComponent';
import MetricComponent from 'in-map/src/components/common/MetricComponent';
import LayerComponent from 'in-map/src/components/physical/LayerComponent';
import PowerComponent from 'in-map/src/components/physical/PowerComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from 'in-map/src/SingleMeshFactory/ContentProvider/PlaneContentProvider';
import FCP from 'in-map/src/SingleMeshFactory/ContentProvider/FrameContentProvider';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CubeContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import MetricHandler from 'in-map/src/3DSceneObjects/physical/MetricHandler';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import Label from 'in-map/src/3DSceneObjects/physical/Label';


export default class Node extends SceneObject {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    // nodes base height
    this.height = 1;

    this.tooltip = new TooltipNode(this);
    this.metricHandler = new MetricHandler(this);

    this.registerEvents();
  }

  onInitialEnter() {
    // the default state for the solid hull is off
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onHighlightEnter() {
    this.highlight();
  }

  onHighlightLeave() {
    this.highlight(false);
  }

  onSelectedEnter() {
    this.highlight();
  }

  onSelectedLeave() {
    this.highlight(false);
  }

  onSelectedHighlightEnter() {
    this.highlight();
  }

  onSelectedHighlightLeave() {
    this.highlight(false);
  }

  onIndirectHighlightEnter() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('groundLine', PROPERTIES.SELECTED, PROPERTY_VALUES.ON);
  }

  onIndirectHighlightLeave() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('groundLine', PROPERTIES.SELECTED, PROPERTY_VALUES.OFF);
  }

  onInactiveEnter() {
    super.onInactiveEnter();

    this.label.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('mesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onInactiveLeave() {
    super.onInactiveLeave();

    this.label.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.highlight(false);
  }

  highlight(solid = true) {
    const value = solid ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, value);
    this.changeComponentState('highlighting', PROPERTIES.ACTIVE, value);
    this.changeComponentState('groundLine', PROPERTIES.SELECTED, value);
    this.changeComponentState('connectionsHandler', PROPERTIES.ACTIVE, value);
  }

  init() {
    super.init();

    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 3
    });
  }

  initComponents() {
    super.initComponents();

    const sceneObject = this;
    const components = this.components;

    components.snapshot = new SnapshotComponent({sceneObject: this});

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    const pcm = new PCM({
      contentProvider: new SCM({
        contentProvider: new CCP()
      })
    });

    // add the mesh component to handle visual representation of the node
    components.mesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({contentProvider: pcm}),
      factory: this.getFactory('fadeByDistanceSMF')
    });

    // add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({contentProvider: pcm}),
      factory: this.getFactory('highlightingSMF')
    });
    components.solidMesh.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // add the highlighting component to handle the highlighting of a node
    // this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject});

    components.ground = new GroundMeshComponent({
      sceneObject,
      factory: this.getFactory('groundSMF'),
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new PCP()
          })
        })
      })
    });
    components.groundLine = new GroundLineMeshComponent({
      sceneObject,
      factory: this.getFactory('baselineSMF'),
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.metric = new MetricComponent({sceneObject});
    components.layer = new LayerComponent({sceneObject});

    components.connectionsHandler = new ConnectionsHandlerComponent({sceneObject});

    components.power = new PowerComponent({sceneObject});

    components.screenPosition = new ScreenPositionComponent({sceneObject, id: '_screenPosition'});
  }

  registerEvents() {
    this.addSubscriptions([
      eventBus.on('endUpdate').subscribe(() => this.getComponent('screenPosition').updateScreenPosition()),

      this.eventEmitter.on('snapshotChanged').subscribe(this.onSnapshotUpdated.bind(this)),
      this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)),
      this.eventEmitter.on('healthChanged').subscribe(this.healthChanged.bind(this)),
      this.eventEmitter.on('powerChanged').subscribe(this.setPower.bind(this)),

      focusEntityId$.subscribe(id => {
        if (this.id === id) {
          eventBus.emit('flyToEntity', this);
        }
      })
    ]);
  }

  getTooltip() {
    return this.tooltip;
  }

  checkLayer(hostEntity, includedIds) {
    this.setChildren(hostEntity.get('children').filter(l => includedIds.layerIds[l.get('id')]));
  }

  setChildren(entities) {
    const layerComponent = this.getComponent('layer');
    const nodeLayerIds = layerComponent.layer.map(layer => layer.id);

    let arraysAreEqual = nodeLayerIds.length === entities.size;
    for (let i = 0; i < entities.size; i++) {
      if (nodeLayerIds.indexOf(entities.getIn([i, 'id'])) < 0) {
        arraysAreEqual = false;
        break;
      }
    }

    if (!arraysAreEqual) {
      layerComponent.removedVanishedLayer(entities);
      layerComponent.addLayer(entities);
    }
    // else -> arrays are equal, so don't create them new
  }

  showMetrics() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('metric', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  hideMetrics() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('metric', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  setMetricValues(values) {
    this.getComponent('metric').setValues(values);
  }

  onSnapshotUpdated() {
    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }
  }

  positionChanged(newPosition) {
    this.label.getComponent('position').setPosition(newPosition.x, newPosition.y + this.height + 0.2, newPosition.z);

    this.updateScreenPosition();
  }

  updateScreenPosition() {
    const pos = this.getComponent('position').getPosition();
    this.getComponent('screenPosition').set3DPositionToProject(pos.x - 0.2, pos.y, pos.z + 0.25);
  }

  setPower(power) {
    this.height = power;

    this.eventEmitter.emit('sizeChanged', { x: 1, y: power, z: 1 });

    const pos = this.getComponent('position').getPosition();
    this.label.getComponent('position').setPosition(pos.x, pos.y + this.height + 0.2, pos.z);

    this.updateScreenPosition();
  }

  healthChanged(maxSeverity) {
    const color = new THREE.Color(theme.health[Math.floor(maxSeverity)]);

    this.eventEmitter.emit('colorChanged', color);
    return color;
  }

  dispose() {
    this.metricHandler.dispose();

    // dispose subscriptions so that no update fires anymore
    super.dispose();

    try {
      this.tooltip.unMount();
      this.tooltip.dispose();
    } catch (er) {
      // the tooltip is already unmounted
      this.tooltip = null;
    }

    this.label.dispose();
    this.label = null;
  }
}
