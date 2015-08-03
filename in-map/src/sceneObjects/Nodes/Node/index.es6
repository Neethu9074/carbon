'use strict';

/*eslint-disable max-len*/
import THREE from 'three';

//components
import HealthComponent from '../../../components/HealthComponent';

import _ from 'lodash';
import eventBus from 'in-services/eventbus';
import {theme} from 'in-services/theme';
import {getPower} from 'in-sdk/power';
import {health} from 'in-services/health';
import {isIdEqual} from 'in-services/util/snapshots';
import {longClickedSceneObject} from '../../../stores/mapStore';
import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';

import BaseNode from '../BaseNode/index';
import SingleMetricPillar from './MetricPillar/SingleMetricPillar';
import MultiMetricPillar from './MetricPillar/MultiMetricPillar';
import Layer from '../../Layer/index';
import NodeSnapshotServer from '../../../NodeSnapshotServer';
import StickyNoteNode from '../../StickyNote/Node';
import StickyNoteLayer from '../../StickyNote/Layer';
import TooltipNode from '../../Tooltips/Node';
import TooltipMetric from '../../Tooltips/Metric';

import PCP from '../../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import VATOCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/VertexArrayToObjectContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../../SingleMeshFactory/ContentProvider/FrameContentProvider';
// import SCCP from '../../../SingleMeshFactory/ContentProvider/SlicedCubeContentProvider';
/*eslint-enable max-len*/

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);


export default class Node extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.components.health = new HealthComponent({sceneObject: this});
    this.stickyNote = new StickyNoteNode(this);

    this.health = health.ok;
    this.layer = [];
  }

  onInactiveEnter() {
    super.onInactiveEnter();

    if(this.layer) {
      this.layer.forEach(layer => layer.changeStateProperty('active', false));
    }
  }

  onInactiveLeave() {
    super.onInactiveLeave();

    if(this.layer) {
      this.layer.forEach(layer => layer.changeStateProperty('active', true));
    }
  }

  onHiddenEnter() {
    super.onHiddenEnter();
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty('hidden', true));
  }

  onHiddenLeave() {
    super.onHiddenLeave();
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty('hidden', false));
  }

  onSelectedEnter() {
    selectedSnapshot.select(this.snapshot);
    super.onSelectedEnter();
  }


  //will be called in super contructor at beginning
  init() {
    this.geometryProviderGroundLine = new VATOCM({
      contentProvider: new PCM({ //reposition
        contentProvider: new SCM({ //resize
          contentProvider: new FCP()
        })
      })
    });

    this.geometryProviderGround = new CMCM({
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new PCP()
        })
      })
    });
  }

  registerEvents() {
    super.registerEvents();

    this.singleMetricPillar = new SingleMetricPillar({parent: this});
    this.multiMetricPillar = new MultiMetricPillar({parent: this});

    this.snapshotServer = new NodeSnapshotServer(this);

    this.addSubscription(
      highlightedSnapshot.highlightedSnapshot.async().subscribe(highlighted =>
        this.stateMachine.changeStateProperty('mouseOver', isIdEqual(highlighted, this.snapshot))
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

  addToGlobalGeometry() {
    this.addToGroundFactory();
  }

  removeFromGlobalGeometry() {
    super.removeFromGlobalGeometry();
    this.removeFromGroundFactory();
  }

  //this is not the group where nodes are on!
  //it's the health ground group of each node
  addToGroundFactory() {
    this.removeFromGroundFactory();
    if(!this.health || this.health === health.ok) {
      return;
    }

    const id = this.id;
    const pos = this.getComponent('position')
      .getPosition()
      .clone()
      .add(cubePosition);

    //adding a existing fragment will penetrate an update
    const color = this.calculateNodeColor();
    const cmcmGround = this.geometryProviderGround;
    const pcmGround = cmcmGround.contentProvider;

    pcmGround.position = {x: pos.x, y: pos.y, z: pos.z};
    pcmGround.contentProvider.scale = {x: 1.5, y: 1, z: 1.5};
    cmcmGround.color = {r: color.r, g: color.g, b: color.b};

    this.scene.groundSingleMeshFactory.addFragment({
      id: id,
      contentProvider: cmcmGround
    });

    const vatocmGroundLine = this.geometryProviderGroundLine;
    const pcmGroundLine = vatocmGroundLine.contentProvider;
    pcmGroundLine.contentProvider.scale = pcmGround.contentProvider.scale;
    pcmGroundLine.position = {x: pos.x, y: pos.y + 0.025, z: pos.z};
    pcmGroundLine.contentProvider.scale = {x: 1.5, y: 1, z: 1.5};

    const points = vatocmGroundLine.getVertices();

    this.scene.lineFactory.addFragment({id: this.id + 'ground', points, color});
  }

  removeFromGroundFactory() {
    const scene = this.scene;
    const id = this.id;
    scene.groundSingleMeshFactory.removeFragment(id);
    scene.lineFactory.removeFragment(id + 'ground');
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

  getNodeMetricTooltip() {
    return new TooltipMetric(this);
  }

  showMetrics(currentMetric) {
    this.stickyNote.switchToMetric();
    this.tooltip = this.getNodeMetricTooltip();

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
    this.stickyNote.render();
  }

  updateOfVisualComponents() {
    super.updateOfVisualComponents();

    const pos = this.getComponent('position').getPosition();

    this.layer.forEach(p =>
      p.getComponent('position').setPosition(pos.x, p.getComponent('position').getPosition().y, pos.z));

    this.removeFromGroundFactory();
    this.addToGroundFactory();
  }

  getScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    return {x: pos.x - 0.25, y: pos.y + this.height, z: pos.z + 0.25};
  }

  positionChanged(x, y, z) {
    super.positionChanged(x, y, z);

    this.singleMetricPillar.getComponent('position').setPosition(x, y, z);
    this.multiMetricPillar.getComponent('position').setPosition(x, y, z);

    this.updateOfVisualComponents();
    this.arrangeChildren();
  }

  setHeight(height) {
    if(height === this.height) {
      return;
    }

    super.setHeight(height);
    this.arrangeChildren();
  }

  healthChanged(newHealth) {
    this.health = newHealth;

    this.refreshFragment();
    this.updateSolidGeometry();

    //the ground plate is always updated
    this.addToGroundFactory();
  }

  refreshFragment() {
    this.highlighting.refresh();

    super.refreshFragment();
  }

  changeColorInFactory(id, newHealth, factory) {
    const fragment = factory.getFragment(this.id);
    fragment.health = newHealth;

    factory.changeColorOfFragment(fragment,
      factory.getColorArrayForFragment(fragment));
  }

  addLayer(snapshot) {
    //don't create a layer if its still there
    const match = _.find(this.layer, layer => isIdEqual(layer.snapshot, snapshot));

    if(match) {
      match.updateSnapshot(snapshot);
      return;
    }

    const newLayer = new Layer({parent: this, snapshot});
    newLayer.setLayerIndex(this.layer.length);
    this.layer.push(newLayer);

    this.arrangeChildren();
  }

  arrangeChildren() {
    const layer = this.layer;
    const heightOfEachChild = this.height / layer.length;

    layer.forEach((child, index) => {
      child.setHeight(heightOfEachChild);
      const positionComponent = child.getComponent('position');
      const pos = positionComponent.getPosition();
      positionComponent.setPosition(pos.x, index * heightOfEachChild, pos.z);
    });
  }

  addStickyNoteForLayer() {
    //only one sticky layer sticky for each node
    if(this.stickyNoteLayer) {
      return;
    }

    this.stickyNoteLayer = new StickyNoteLayer(this);
  }

  enableFragments(enabled) {
    super.enableFragments(enabled);

    if(enabled) {
      this.addToGroundFactory();
    } else {
      this.removeFromGroundFactory();
    }
  }

  clearLayer() {
    this.layer.forEach(p => p.dispose());
    this.layer = [];
  }

  dispose() {
    super.dispose();

    this.singleMetricPillar.dispose();
    this.multiMetricPillar.dispose();

    this.snapshotServer.dispose();
    this.clearLayer();
    this.removeFromGroundFactory();

    this.layer = [];
    this.wiredSnapshots = undefined;

    this.snapshot = null;
    this.health = null;
  }

  calculateNodeColor() {
    const hostHealth = this.health;
    const colors = theme.map.colors;
    let color;
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
