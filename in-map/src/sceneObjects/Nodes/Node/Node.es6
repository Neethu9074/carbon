import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {isMatchingAllActiveFilters} from 'in-services/stores/filters';
import {getFullSnapshot} from 'in-services/snapshots';
import {level} from 'in-services/stores/zoomLevel';
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

import {PROPERTY_VALUES} from '../../../StateMachine/StateMachine';
import {longClickedSceneObject} from '../../../mapStores';
import NodeSnapshotServer from './NodeSnapshotServer';
import StickyNoteNode from '../../StickyNote/Node';
import TooltipNode from '../../Tooltips/Node';
import BaseNode from '../BaseNode';
import Label from '../../Label';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import FCP from '../../../SingleMeshFactory/ContentProvider/FrameContentProvider';

const emptyLabel = {
  isEmpty: true,
  getComponent: () => {
    return { setPosition: () => {} };
  },
  dispose: () => {}
};
const nodeBaseHeight = 1;

export default class Node extends BaseNode {

  constructor({parent, coordinates, id, connections}) {
    super({parent, id});

    this._cachedPower = 1;
    this.isOutOfView = false;
    this.isToFarAway = false;

    this.label = emptyLabel;
    this.snapshotServer = new NodeSnapshotServer(this, connections);

    this.addSubscription(getFullSnapshot(coordinates).subscribe(snapshot =>
      this.onSnapshotUpdate(snapshot))
    );

    this.addSubscription(isMatchingAllActiveFilters(coordinates).subscribe(isVisible => {
      if (isVisible) {
        this.show();
      } else {
        this.hide();
      }
    }));
  }

  onSelectedEnter() {
    super.onSelectedEnter();

    // snapshots may not yet exist yet when switching views.
    if (this.snapshot) {
      selectedSnapshot.select(this.snapshot);
    }
  }

  onSelectedHighlightEnter() {
    super.onSelectedHighlightEnter();

    selectedSnapshot.select(this.snapshot);
  }

  onSceneObjectSelected(obj) {
    super.onSceneObjectSelected(obj);

    if (obj && obj.id === this.id) {
      tracking.events.clickOnServerIn3DMap();
    }
  }

  onHiddenEnter() {
    super.onHiddenEnter();
    this.getComponent('layer').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
    this.label.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onHiddenLeave() {
    super.onHiddenLeave();
    this.getComponent('layer').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
    this.label.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
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


  initComponents() {
    super.initComponents();

    const components = this.components;
    components.ground = new MeshComponent({
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
      sceneObject: this,
      factory: this.scene.baselineFactory,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.metric = new MetricComponent({sceneObject: this});
    components.layer = new LayerComponent({sceneObject: this});
    components.ground.sizeChanged(1.5, 1, 1.5);
    components.groundLine.sizeChanged(1.5, 1, 1.5);
  }

  registerEvents() {
    super.registerEvents();

    this.addSubscription(
      highlightedSnapshot.highlightedSnapshot.subscribe(highlighted => {
        if (!highlighted) {
          this.stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.OFF);
          return;
        }
        const value = highlighted.get('id')  === this.id ?
          PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
        this.stateMachine.changeStateProperty('highlight', value);
      })
    );

    this.addSubscription(longClickedSceneObject.subscribe(so => {
      if (so && this.snapshot && so.id === this.id) {
        eventBus.emit('openDashboard', this.snapshot);
        tracking.events.openingADashboardUsingTheMap();
      }
    }));
  }

  setLayer(layer) {
    const layerComponent = this.getComponent('layer');

    layerComponent.removedVanishedLayer(layer);
    layerComponent.addLayer(layer);
  }

  onHighlight(highlighted) {
    super.onHighlight(highlighted);
    if (highlighted) {
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

  showMetrics() {
    this.stickyNote.switchToMetric();

    this.getComponent('metric').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  hideMetrics() {
    this.stickyNote.switchToIcon();
    this.tooltip = this.getNodeTooltip();

    this.getComponent('metric').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  setMetricValues(values) {
    if (this.isHidden()) {
      return;
    }

    this.getComponent('metric').setValues(values);
  }

  setWiredSnapshots(wiredSnapshots) {
    if (!wiredSnapshots) {
      return;
    }

    const parent = this.parent;
    this.wiredSnapshots = wiredSnapshots;

    wiredSnapshots.outgoing.forEach(wired => {
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

    // if the node is in the view frustum
    if (!this.isInView()) {
        this.setStateForMetricActivity({ isOutOfView: true });

        if (!this.stickyIsHidden) {
          this.stickyNote.hide();
          this.stickyIsHidden = true;
        }
    } else {
      this.setStateForMetricActivity({ isOutOfView: false });

      if (this.stickyIsHidden) {
        this.stickyNote.show();
        this.stickyIsHidden = false;
      }
      this.updateStickyNotes();
    }
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
    // disable sticky note
    this.stickyNote.hide();

    // disable metrics if the node isn't visible
    this.snapshotServer.pauseMetrics();
  }

  onSnapshotUpdate(snapshot) {
    // if the reference is equal, don't update. the reference is always equal
    // on the same snapshots because they are immutable
    if (this.snapshot === snapshot) {
      return;
    }

    this.snapshot = snapshot;
    this._cachedPower = getPower(snapshot);

    if (!this.components.health) {
      this.components.health = new HealthComponent({sceneObject: this});
    }

    if (this.stickyNote.isEmpty) {
      this.stickyNote = new StickyNoteNode(this);
    }
    this.stickyNote.onSnapshotUpdate();

    if (this.tooltip.isEmpty) {
      this.tooltip = new TooltipNode(this);
    }

    this.setupLabel();
    this.snapshotServer.onSnapshotUpdate();
  }

  setupLabel() {
    this.label.dispose();
    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 3,
      snapshot: this.snapshot,
      predicate: zoomLevel => zoomLevel !== level.near && zoomLevel !== level.nearest
    });
    const position = this.getComponent('position').getPosition();
    this.label.getComponent('position').setPosition(position.x, position.y + this.height + 0.2, position.z);
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
    super.positionChanged(x, y, z, oldPosition);

    this.label.getComponent('position').setPosition(x, y + this.height + 0.2, z);

    this.getComponent('ground').positionChanged(x, y, z);
    this.getComponent('groundLine').positionChanged(x - 0.5, y, z + 0.5);
    this.getComponent('layer').positionChanged(x, y, z);
    this.getComponent('metric').positionChanged(x, y, z);

    this.updateScreenAnchorPosition();
  }

  setHeight(height) {
    super.setHeight(height);
    this.getComponent('layer').heightChanged(height);

    const pos = this.getComponent('position').getPosition();
    this.label.getComponent('position').setPosition(pos.x, pos.y + this.height + 0.2, pos.z);
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
      ground.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      groundLine.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      this.getComponent('solidMesh').colorChanged(r + 0.1, g + 0.1, b + 0.1);

    } else {
      this.getComponent('solidMesh').colorChanged(r, g, b);
      ground.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
      groundLine.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
    }
  }

  dispose() {
    // dispose the event server to prevent updates
    this.snapshotServer.dispose();

    // dispose other subscriptions
    super.dispose();

    this.label.dispose();
    this.label = null;

    this.wiredSnapshots = null;
  }

  calculateNodeColor(hostHealth) {
    const colors = theme.map.colors;
    let color;

    if (hostHealth === health.warning) {
      color = new THREE.Color(colors.warning);
    } else if (hostHealth === health.danger) {
      color = new THREE.Color(colors.critical);
    } else {
      color = new THREE.Color(colors.cubeBasicColor);
    }
    return {r: color.r, g: color.g, b: color.b};
  }

  calculatePower() {
    return this._cachedPower;
  }
}
