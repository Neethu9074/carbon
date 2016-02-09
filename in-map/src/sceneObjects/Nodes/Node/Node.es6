import THREE from 'three';

import {activeMetric} from 'in-services/stores/metrics';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';
import {getPower} from 'in-sdk/power';

import PhysicalConnectionsHandlerComponent from
  '../../../components/ConnectionsHandlerComponents/PhysicalConnectionsHandlerComponent';
import HighlightingComponent from '../../../components/HighlightingComponents/Cube';
import CollisionComponent from '../../../components/CollisionObjectComponent';
import LineMeshComponent from '../../../components/LineMeshComponent';
import HealthComponent from '../../../components/HealthComponent';
import MetricComponent from '../../../components/MetricComponent';
import LayerComponent from '../../../components/LayerComponent';
import MeshComponent from '../../../components/MeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../../StateMachine/StateMachine';
import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObjectWithSnapshot from '../../SceneObjectWithSnapshot';
import {longClickedSceneObject} from '../../../stores';
import NodeSnapshotServer from './NodeSnapshotServer';
import ConnectionGrid from '../../../ConnectionGrid';
import {currentTooltip} from '../../../stores';
import PluginLabel from '../../Label/PluginLabel';
import TooltipNode from '../../../Tooltips/Node';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import FCP from '../../../SingleMeshFactory/ContentProvider/FrameContentProvider';
import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';


const nodeBaseHeight = 1;

export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.height = nodeBaseHeight;
    this.isOutOfView = false;
    this.isToFarAway = false;
    this._cachedPower = 1;

    this.registerEvents();

    this.tooltip = new TooltipNode(this);
    this.snapshotServer = new NodeSnapshotServer(this);
    this.label = new PluginLabel({
      id: this.id,
      parent: this,
      iconSize: 3
    });
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
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.getComponent('groundLine').stateMachine.changeStateProperty(PROPERTIES.SELECTED, PROPERTY_VALUES.ON);
  }

  onIndirectHighlightLeave() {
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('groundLine').stateMachine.changeStateProperty(PROPERTIES.SELECTED, PROPERTY_VALUES.OFF);
  }

  onInactiveEnter() {
    super.onInactiveEnter();

    this.label.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.getComponent('mesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onInactiveLeave() {
    super.onInactiveLeave();

    this.label.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.highlight(false);
  }

  highlight(solid = true) {
    const value = solid ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.getComponent('solidMesh').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, value);
    this.getComponent('highlighting').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, value);
    this.getComponent('groundLine').stateMachine.changeStateProperty(PROPERTIES.SELECTED, value);

    this.getComponent('connectionsHandler').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, value);
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

    components.ground = new MeshComponent({
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
    components.groundLine = new LineMeshComponent({
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
    components.ground.sizeChanged(1.5, 1, 1.5);
    components.groundLine.sizeChanged(1.5, 1, 1.5);

    components.connectionsHandler = new PhysicalConnectionsHandlerComponent({sceneObject});
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
    this.getComponent('metric').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  hideMetrics() {
    this.getComponent('metric').stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  setMetricValues(values) {
    this.getComponent('metric').setValues(values);
  }

  update() {
    this.updateScreenPosition();

    this.setStateForMetricActivity({ isOutOfView: !this.isInView() });
  }

  setStateForMetricActivity(params) {
    if (params.isOutOfView !== undefined) {
      this.isOutOfView = params.isOutOfView;
    }
    if (params.isToFarAway !== undefined) {
      this.isToFarAway = params.isToFarAway;
    }

    if (!this.isToFarAway && !this.isOutOfView &&
        this.snapshotServer && this.snapshotServer.currentMetric) {
      if (!this.canShowMetrics) {
        this.canShowMetrics = true;
        this.snapshotServer.resumeMetrics();
        this.showMetrics();
      }
    } else {
      if (this.canShowMetrics) {
        this.canShowMetrics = false;
        this.snapshotServer.pauseMetrics();
        this.hideMetric();
      }
    }
  }

  hideMetric() {
    // disable metrics if the node isn't visible
    this.snapshotServer.pauseMetrics();
  }

  onSnapshotUpdated(snapshot) {
    this._cachedPower = getPower(snapshot);

    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }

    this.snapshotServer.onSnapshotUpdate();
  }

  updateHeight(maxPower) {
    const maxNodeHeight = 3;
    this._cachedPower = getPower(this.snapshot);
    const weightedHeight = (maxNodeHeight - nodeBaseHeight) * (this._cachedPower / maxPower);
    this.setHeight(nodeBaseHeight + weightedHeight);
  }

  getScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    return {x: pos.x - 0.2, y: pos.y + this.height + 0.75, z: pos.z + 0.25};
  }

  positionChanged(x, y, z, oldPosition) {
    this.getComponent('collision').positionChanged(x, y, z);
    this.getComponent('solidMesh').positionChanged(x, y, z);
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('highlighting').positionChanged(x, y, z);
    this.updateScreenAnchorPosition();

    ConnectionGrid.clearPosition(oldPosition);
    ConnectionGrid.blockPosition({x, y, z});

    this.label.getComponent('position').setPosition(x, y + this.height + 0.2, z);

    this.getComponent('ground').positionChanged(x, y, z);
    this.getComponent('groundLine').positionChanged(x - 0.5, y, z + 0.5);
    this.getComponent('layer').positionChanged(x, y, z);
    this.getComponent('metric').positionChanged(x, y, z);

    this.updateScreenAnchorPosition();
  }

  setHeight(height) {
    this.height = height;

    this.getComponent('collision').sizeChanged(1, height, 1);
    this.getComponent('solidMesh').sizeChanged(1, height, 1);
    this.getComponent('mesh').sizeChanged(1, height, 1);
    this.getComponent('highlighting').sizeChanged(1, height, 1);
    this.getComponent('layer').heightChanged(height);

    const pos = this.getComponent('position').getPosition();
    this.label.getComponent('position').setPosition(pos.x, pos.y + this.height + 0.2, pos.z);

    this.updateScreenAnchorPosition();
  }

  healthChanged(newHealth) {
    const groundLine = this.getComponent('groundLine');
    const ground = this.getComponent('ground');
    const color = this.calculateNodeColor(newHealth);
    const r = color.r;
    const g = color.g;
    const b = color.b;

    ground.colorChanged(r, g, b);
    groundLine.colorChanged(r, g, b);
    this.getComponent('mesh').colorChanged(r, g, b);

    if (newHealth === health.ok) {
      ground.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
      groundLine.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
      this.getComponent('solidMesh').colorChanged(r + 0.1, g + 0.1, b + 0.1);

    } else {
      this.getComponent('solidMesh').colorChanged(r, g, b);
      ground.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
      groundLine.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    }
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

  calculatePower() {
    return this._cachedPower;
  }

  dispose() {
    this.snapshotServer.dispose();

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
