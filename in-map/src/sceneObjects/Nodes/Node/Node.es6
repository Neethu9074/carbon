import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {isIdEqualShort as isIdEqual} from 'in-services/snapshots';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';
import {getPower} from 'in-sdk/power';

import LineMeshComponent from '../../../components/LineMeshComponent';
import HealthComponent from '../../../components/HealthComponent';
import MetricComponent from '../../../components/MetricComponent';
import LayerComponent from '../../../components/LayerComponent';
import MeshComponent from '../../../components/MeshComponent';

import SingleMetricPillar from './MetricPillar/SingleMetricPillar';
import {PROPERTY_VALUES} from '../../../StateMachine/StateMachine';
import MultiMetricPillar from './MetricPillar/MultiMetricPillar';
import {longClickedSceneObject} from '../../../stores/mapStore';
import NodeSnapshotServer from '../../../NodeSnapshotServer';
import StickyNoteNode from '../../StickyNote/Node';
import TooltipNode from '../../Tooltips/Node';
import BaseNode from '../BaseNode';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import FCP from '../../../SingleMeshFactory/ContentProvider/FrameContentProvider';


export default class Node extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    const id = this.id + '_ground';
    const components = this.components;
    components.metric = new MetricComponent({sceneObject: this});
    components.ground = new MeshComponent({
      id,
      sceneObject: this,
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
      id,
      sceneObject: this,
      factory: this.scene.baselineFactory,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.health = new HealthComponent({sceneObject: this});
    components.layer = new LayerComponent({sceneObject: this});
    components.ground.sizeChanged(1.5, 1, 1.5);
    components.groundLine.sizeChanged(1.5, 1, 1.5);

    this.stickyNote = new StickyNoteNode(this);
    this.snapshotServer = new NodeSnapshotServer(this);
  }

  onSelectedEnter() {
    super.onSelectedEnter();

    selectedSnapshot.select(this.snapshot);
  }

  onSelectedHighlightEnter() {
    super.onSelectedHighlightEnter();

    selectedSnapshot.select(this.snapshot);
  }

  onSceneObjectSelected(obj) {
    super.onSceneObjectSelected(obj);

    if (obj && obj.id === this.id) {
      tracking.trackEvent(tracking.events.clickOnServerIn3DMap);
    }
  }

  onIndirectHighlightEnter() {
    super.onIndirectHighlightEnter();

    this.getComponent('groundLine').stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON);
  }

  onIndirectHighlightLeave() {
    super.onIndirectHighlightLeave();

    this.getComponent('groundLine').stateMachine.changeStateProperty('selected', PROPERTY_VALUES.OFF);
  }

  highlight(solid = true) {
    super.highlight(solid);

    const value = solid ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.getComponent('groundLine').stateMachine.changeStateProperty('selected', value);
  }


  registerEvents() {
    super.registerEvents();

    this.singleMetricPillar = new SingleMetricPillar({parent: this});
    this.multiMetricPillar = new MultiMetricPillar({parent: this});

    this.addSubscription(
      highlightedSnapshot.highlightedSnapshot.async().subscribe(highlighted => {
        const value = isIdEqual(highlighted, this.snapshot) ?
          PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
        this.stateMachine.changeStateProperty('highlight', value);
      })
    );

    this.addSubscription(
      longClickedSceneObject.subscribe((so) => {
        if(so && so.id === this.id) {
          eventBus.emit('openDashboard', this.snapshot);

          //double or long clicked
          tracking.trackEvent(tracking.events.openingADashboardUsingTheMap);
        }
      })
    );
  }

  addLayer(layer) {
    const layerComponent = this.getComponent('layer');
    if(layerComponent) {
      layerComponent.addLayer(layer);
    }
  }

  onHighlight(highlighted) {
    super.onHighlight(highlighted);
    if(highlighted) {
      highlightedSnapshot.select(this.snapshot);
    } else {
      highlightedSnapshot.clear();
    }
  }

  getTooltipSticky() {
    return this.getNodeTooltip();
  }

  getNodeTooltip() {
    return new TooltipNode(this);
  }

  showMetrics(currentMetric) {
    this.stickyNote.switchToMetric();

    if(currentMetric.size === 1) {
      this.singleMetricPillar.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
      this.multiMetricPillar.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    } else {
      this.multiMetricPillar.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
      this.singleMetricPillar.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    }

    this.getComponent('metric').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  hideMetrics() {
    this.stickyNote.switchToIcon();

    this.singleMetricPillar.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    this.multiMetricPillar.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    this.tooltip = this.getNodeTooltip();

    this.getComponent('metric').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  setMetricValues(values) {
    if(this.isHidden()){
      return;
    }

    this.getComponent('metric').setValues(values);

    if(values.length === 1) {
      this.singleMetricPillar.setMetricValue(values[0]);
    } else {
      this.multiMetricPillar.setMetricValue(values);
    }
  }

  setWiredSnapshots(wiredSnapshots) {
    const parent = this.parent;
    this.wiredSnapshots = wiredSnapshots;

    wiredSnapshots.get('outgoing').forEach(wired => {
      if (wired.get('state') !== 'unmonitored') {
        return;
      }
      parent.addUnknownNode(wired);
    });
  }

  getWiredSnapshots() {
    return this.wiredSnapshots;
  }

  update() {
    super.update();

    //if the node is near enough or is in the view frustum
    if(!this.isInView()) {
      //trigger the hide method just once
      if(!this.outsideViewFrustum) {
        this.hideMetric();
        this.outsideViewFrustum = true;
      }
    } else {
      //trigger the show method just once
      if(this.outsideViewFrustum) {
        this.snapshotServer.resumeMetrics();
        this.outsideViewFrustum = false;
      }
      this.updateStickyNotes();
    }
  }

  hideMetric() {
    //disable sticky note
    this.stickyNote.hide();

    //disable metrics if the node isn't visible
    this.snapshotServer.pauseMetrics();
  }

  onSnapshotUpdate(snapshot) {
    //if the reference is equal, don't update. the reference is always equal
    //on the same snapshots because they are immutable
    if(this.snapshot === snapshot) {
      return;
    }

    this.snapshot = snapshot;
    this.snapshotServer.onSnapshotUpdate();
  }

  getScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    return {x: pos.x - 0.25, y: pos.y + this.height, z: pos.z + 0.25};
  }

  positionChanged(x, y, z) {
    super.positionChanged(x, y, z);

    this.singleMetricPillar.getComponent('position').setPosition(x, y, z);
    this.multiMetricPillar.getComponent('position').setPosition(x, y, z);
    this.getComponent('ground').positionChanged(x, y, z);
    this.getComponent('groundLine').positionChanged(x - 0.5, y, z + 0.5);
    this.getComponent('layer').positionChanged(x, y, z);
    this.getComponent('metric').positionChanged(x, y, z);

    this.updateScreenAnchorPosition();
  }

  setHeight(height) {
    super.setHeight(height);
    this.getComponent('layer').heightChanged(height);
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

    if(newHealth === health.ok) {
      ground.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      groundLine.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      this.getComponent('solidMesh').colorChanged(r + 0.2, g + 0.2, b + 0.2);

    } else {
      this.getComponent('solidMesh').colorChanged(r, g, b);
      ground.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
      groundLine.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
    }
  }

  dispose() {
    // dispose the event server to prevent updates
    this.snapshotServer.dispose();

    //dispose other subscriptions
    super.dispose();

    this.singleMetricPillar.dispose();
    this.multiMetricPillar.dispose();

    this.wiredSnapshots = undefined;
  }

  calculateNodeColor(hostHealth) {
    const colors = theme.map.colors;
    let color;

    if(!hostHealth) {
      color = new THREE.Color(colors.default);
      return {r: color.r, g: color.g, b: color.b};
    }

    if(hostHealth === health.warning) {
      color = new THREE.Color(colors.warning);
    } else if(hostHealth === health.danger) {
      color = new THREE.Color(colors.critical);
    } else {
      color = new THREE.Color(colors.default);
    }
    return {r: color.r, g: color.g, b: color.b};
  }

  calculatePower() {
    try {
      return getPower(this.snapshot);
    } catch (err) {
      return super.calculatePower();
    }
  }
}
