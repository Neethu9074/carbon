import THREE from 'three';

import {activeMetric} from 'in-services/stores/metrics';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import ConnectionsHandlerComponent from '../../components/physical/ConnectionsHandlerComponent';
import GroundLineMeshComponent from '../../components/physical/GroundLineMeshComponent';
import HighlightingComponent from '../../components/physical/HighlightingComponent';
import CollisionComponent from '../../components/common/CollisionObjectComponent';
import GroundMeshComponent from '../../components/physical/GroundMeshComponent';
import HealthComponent from '../../components/common/HealthComponent';
import MetricComponent from '../../components/common/MetricComponent';
import LayerComponent from '../../components/physical/LayerComponent';
import PowerComponent from '../../components/physical/PowerComponent';
import MeshComponent from '../../components/common/MeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import {cubeGeometry, defaultGeometryMaterial} from '../common/geometries';
import SceneObjectWithSnapshot from '../common/SceneObjectWithSnapshot';
import {longClickedSceneObject} from '../../stores';
import ConnectionGrid from '../../ConnectionGrid';
import TooltipNode from '../../Tooltips/Node';
import {currentTooltip} from '../../stores';
import MetricHandler from './MetricHandler';
import Label from './Label';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';
import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';


const NODE_BASE_HEIGHT = 1;

export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.height = NODE_BASE_HEIGHT;

    this.registerEvents();

    this.tooltip = new TooltipNode(this);
    this.metricHandler = new MetricHandler(this);
    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 3
    });

    this.addSubscription(this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)));
    this.addSubscription(this.eventEmitter.on('powerChanged').subscribe(this.setPower.bind(this)));
    this.addSubscription(this.eventEmitter.on('healthChanged').subscribe(this.healthChanged.bind(this)));
  }

  onInitialEnter() {
    // the default state for the solid hull is off
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onHighlightEnter() {
    this.highlight();

    currentTooltip.emit(this.tooltip);
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

    currentTooltip.emit(this.tooltip);
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
      factory: this.scene.singleMeshFactory
    });
    const color = this.calculateNodeColor();
    this.getComponent('mesh').colorChanged(color.r, color.g, color.b);

    // add the solidMesh component to handle the solid fill color of a node
    components.solidMesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({contentProvider: pcm}),
      factory: this.scene.highlightingSingleMeshFactory
    });
    components.solidMesh.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    // add the highlighting component to handle the highlighting of a node
    // this is different to solidMesh since the highlighting is like a mouseOver effect
    components.highlighting = new HighlightingComponent({sceneObject});

    components.ground = new GroundMeshComponent({
      sceneObject,
      factory: this.scene.groundSingleMeshFactory,
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
      factory: this.scene.baselineFactory,
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

    this.addSubscription(activeMetric.subscribe(metric => this.onActiveMetric(metric)));

    this.addSubscription(longClickedSceneObject.subscribe(so => {
      if (so && so.id === this.id && this.snapshot) {
        eventBus.emit('openDashboard', this.snapshot);
        tracking.events.openingADashboardUsingTheMap();
      }
    }));
  }

  onActiveMetric(metric) {
    this.currentMetric = metric;

    const value = metric ? PROPERTY_VALUES.OFF : PROPERTY_VALUES.ON;
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, value);
  }

  setChildren(entities) {
    const layerComponent = this.getComponent('layer');

    layerComponent.removedVanishedLayer(entities);
    layerComponent.addLayer(entities);
  }

  updateScreenAnchorPosition() {
    const anchor = this.getScreenAnchorPosition();
    super.setScreenPositionAnchor(anchor.x, anchor.y, anchor.z);
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

  getScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    return {x: pos.x - 0.2, y: pos.y + this.height + 0.75, z: pos.z + 0.25};
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

  healthChanged(newHealth) {
    this.eventEmitter.emit('colorChanged', this.calculateNodeColor(newHealth));
  }

  calculateNodeColor(hostHealth) {
    const colors = theme.map.colors;

    if (hostHealth === health.warning) {
      return new THREE.Color(colors.warning);
    } else if (hostHealth === health.danger) {
      return new THREE.Color(colors.critical);
    }
    return new THREE.Color(colors.cubeBasicColor);
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
