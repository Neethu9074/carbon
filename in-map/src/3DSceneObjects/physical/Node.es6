import THREE from 'three';

import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/physical/Node';
import {activeMetric} from 'in-services/stores/metrics';
import {theme} from 'in-services/theme';
import eventBus from 'in-map/eventbus';

import ConnectionsHandlerComponent from 'in-map/src/components/physical/ConnectionsHandlerComponent';
import GroundLineMeshComponent from 'in-map/src/components/physical/GroundLineMeshComponent';
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
import SceneObjectWithSnapshot from 'in-map/src/3DSceneObjects/common/SceneObjectWithSnapshot';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import MetricHandler from 'in-map/src/3DSceneObjects/physical/MetricHandler';
import Label from 'in-map/src/3DSceneObjects/physical/Label';
import ConnectionGrid from 'in-map/src/ConnectionGrid';


export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    // nodes base height
    this.height = 1;

    this.tooltip = new TooltipNode(this);
    this.metricHandler = new MetricHandler(this);
    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 3
    });

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


  initComponents() {
    super.initComponents();

    const sceneObject = this;
    const components = this.components;

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
      factory: this.scene.fadeByDistanceSMF
    });

    // add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({contentProvider: pcm}),
      factory: this.scene.highlightingSMF
    });
    components.solidMesh.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // add the highlighting component to handle the highlighting of a node
    // this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject});

    components.ground = new GroundMeshComponent({
      sceneObject,
      factory: this.scene.groundSMF,
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
      factory: this.scene.baselineSMF,
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
  }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe(data => this.update(data)));

    this.addSubscription(activeMetric.subscribe(metric => {
      this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE,
                                            metric ? PROPERTY_VALUES.OFF : PROPERTY_VALUES.ON);
    }));

    this.addSubscription(this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)));
    this.addSubscription(this.eventEmitter.on('healthChanged').subscribe(this.healthChanged.bind(this)));
    this.addSubscription(this.eventEmitter.on('powerChanged').subscribe(this.setPower.bind(this)));
  }

  getTooltip() {
    return this.tooltip;
  }

  setChildren(entities) {
    const layerComponent = this.getComponent('layer');
    const nodeLayerIds = layerComponent.layer.map(layer => layer.id);

    let arraysAreEqual = true;
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
    this.changeComponentState('metric', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  hideMetrics() {
    this.changeComponentState('metric', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  setMetricValues(values) {
    this.getComponent('metric').setValues(values);
  }

  update() {
    this.updateScreenPosition();

    if (this.metricHandler) {
      this.metricHandler.setStateForMetricActivity({ isOutOfView: !this.isInView() });
    }
  }

  onSnapshotUpdated() {
    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }
  }

  updateScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    super.setScreenPositionAnchor(pos.x - 0.2, pos.y + this.height + 0.75, pos.z + 0.25);
  }

  positionChanged({newPosition, oldPosition}) {
    this.label.getComponent('position').setPosition(newPosition.x, newPosition.y + this.height + 0.2, newPosition.z);

    ConnectionGrid.clearPosition(oldPosition);
    ConnectionGrid.blockPosition(newPosition);
    this.updateScreenAnchorPosition();
  }

  setPower(power) {
    this.height = power;

    this.eventEmitter.emit('sizeChanged', { x: 1, y: power, z: 1 });

    const pos = this.getComponent('position').getPosition();
    this.label.getComponent('position').setPosition(pos.x, pos.y + this.height + 0.2, pos.z);

    this.updateScreenAnchorPosition();
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
