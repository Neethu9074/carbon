import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {isIdEqualShort as isIdEqual} from 'in-services/util/snapshots';
import * as tracking from 'in-services/tracking';
import eventBus from 'in-services/eventbus';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';
import {getPower} from 'in-sdk/power';

import LineMeshComponent from '../../../components/LineMeshComponent';
import HealthComponent from '../../../components/HealthComponent';
import LayerComponent from '../../../components/LayerComponent';
import MeshComponent from '../../../components/MeshComponent';

import SingleMetricPillar from './MetricPillar/SingleMetricPillar';
import MultiMetricPillar from './MetricPillar/MultiMetricPillar';
import {longClickedSceneObject} from '../../../stores/mapStore';
import NodeSnapshotServer from '../../../NodeSnapshotServer';
import StickyNoteNode from '../../StickyNote/Node';
import TooltipNode from '../../Tooltips/Node';
import BaseNode from '../BaseNode/index';

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
      factory: this.scene.lineFactory,
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

  registerEvents() {
    super.registerEvents();

    this.singleMetricPillar = new SingleMetricPillar({parent: this});
    this.multiMetricPillar = new MultiMetricPillar({parent: this});

    this.snapshotServer = new NodeSnapshotServer(this);

    this.addSubscription(
      highlightedSnapshot.highlightedSnapshot.async().subscribe(highlighted =>
        this.stateMachine.changeStateProperty('highlight', isIdEqual(highlighted, this.snapshot))
      )
    );

    this.addSubscription(
      longClickedSceneObject.subscribe((so) => {
        if(so && so.id === this.id) {
          eventBus.emit('openDashboard', this.snapshot);
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
      this.singleMetricPillar.stateMachine.changeStateProperty('active', true);
      this.multiMetricPillar.stateMachine.changeStateProperty('active', false);
    } else {
      this.multiMetricPillar.stateMachine.changeStateProperty('active', true);
      this.singleMetricPillar.stateMachine.changeStateProperty('active', false);
    }

    // const position = this.getPosition();
    // const size = {x: 0.9, y: 0.9, z: 0.9};
    // const frag = {
    //   id: this.id,
    //   contentProvider: new PCM({
    //     contentProvider: new SCM({
    //       contentProvider: new SCCP({numSlices: Math.ceil(Math.random() * 5)}),
    //       x: size.x, y: size.y, z: size.z
    //     }),
    //     x: position.x - size.x / 2, y: position.y, z: position.z + size.z / 2
    //   })
    // };
    // this.scene.singleMeshMetricFactory.addFragment(frag);
  }

  hideMetrics() {
    this.stickyNote.switchToIcon();

    this.singleMetricPillar.stateMachine.changeStateProperty('active', false);
    this.multiMetricPillar.stateMachine.changeStateProperty('active', false);

    this.tooltip = this.getNodeTooltip();
  }

  setMetricValues(values) {
    if(this.isHidden()){
      return;
    }

    if(values.length === 1) {
      this.singleMetricPillar.setMetricValue(values[0]);
    } else {
      this.multiMetricPillar.setMetricValue(values);
    }
  }

  setWiredSnapshots(wiredSnapshots) {
    const parent = this.parent;
    this.wiredSnapshots = wiredSnapshots;
    this.getWiredSnapshotsAsArray()
      .filter(node => node.get('state') === 'unmonitored')
      .forEach(node => parent.addUnknownNode(node));
  }

  getWiredSnapshotsAsArray() {
    const wiredSnapshots = this.wiredSnapshots;
    if(wiredSnapshots) {
      return wiredSnapshots.get('outgoing');
        //.concat(wiredSnapshots.get('incoming'));
    }
    return [];
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

    this.updateOfVisualComponents();
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
      ground.stateMachine.changeStateProperty('active', false);
      groundLine.stateMachine.changeStateProperty('active', false);

    } else {
      ground.stateMachine.changeStateProperty('active', true);
      groundLine.stateMachine.changeStateProperty('active', true);
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
