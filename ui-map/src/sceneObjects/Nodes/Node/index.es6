'use strict';

/*eslint-disable max-len*/
import THREE from 'three';

import eventBus from 'instana-ui-services/eventbus';
import {theme} from 'instana-ui-services/theme';
import {getPower} from 'instana-ui-sdk/power';
import {health} from 'instana-ui-services/health';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {longClickedSceneObject} from '../../../stores/mapStore';
import * as highlightedSnapshot from 'instana-ui-services/stores/highlightedSnapshot';

import BaseNode from '../BaseNode/index';
import SingleMetricPillar from './MetricPillar/SingleMetricPillar';
import MultiMetricPillar from './MetricPillar/MultiMetricPillar';
import Layer from '../../Layer';
import NodeSnapshotServer from '../../../NodeSnapshotServer';
import StickyNoteNode from '../../StickyNote/Node';
import StickyNoteLayer from '../../StickyNote/Layer';
import TooltipNode from '../../Tooltips/Node';

import PCP from '../../../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import VATOCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/VertexArrayToObjectContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../../SingleMeshFactory/ContentProvider/FrameContentProvider';
// import SCCP from '../../../SingleMeshFactory/ContentProvider/SlicedCubeContentProvider';
/*eslint-enable max-len*/

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
let incrementId = 0;


export default class Node extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.incrementId = ++incrementId;
    this.stickyNote = new StickyNoteNode(this);

    this.health = this.health || health.ok;
    this.layer = [];
  }

  onInactiveEnter() {
    this.removeCollisionObject(this.cube, 1);

    //save the current health, set health to ok, block the coloring for cube
    //and reset to old health
    const healthBackup = this.health;
    this.setHealth(health.ok);
    this.blockCubeHealth(true);
    this.setHealth(healthBackup);
  }

  onInactiveLeave() {
    this.addCollisionObject(this.cube, 1);

    //unblock the coloring for cube and reset the current health
    this.blockCubeHealth(false);
    this.setHealth(this.health, true);
  }

  onHiddenEnter() {
    super.onHiddenEnter();

    this.singleMetricPillar.hide();
    // this.multiMetricPillar.hide();
  }

  onHiddenLeave() {
    super.onHiddenLeave();

    this.singleMetricPillar.show();
    // this.multiMetricPillar.show();
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
        this.changeStateProperty('mouseOver', isIdEqual(highlighted, this.snapshot))
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
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    //adding a existing fragment will penetrate an update
    const color = this.calculateNodeColor();
    const position = pos;
    const size = dim.clone().multiplyScalar(1.5);
    const cmcmGround = this.geometryProviderGround;
    const pcmGround = cmcmGround.contentProvider;

    pcmGround.position = {x: position.x, y: position.y, z: position.z};
    pcmGround.contentProvider.scale = {x: size.x, y: 1, z: size.z};
    cmcmGround.color = {r: color.r, g: color.g, b: color.b};

    this.scene.groundSingleMeshFactory.addFragment({
      id: id,
      contentProvider: cmcmGround
    });

    const vatocmGroundLine = this.geometryProviderGroundLine;
    const pcmGroundLine = vatocmGroundLine.contentProvider;
    pcmGroundLine.contentProvider.scale = pcmGround.contentProvider.scale;
    pcmGroundLine.position = {x: pos.x, y: pos.y + 0.025, z: pos.z};
    pcmGroundLine.contentProvider.scale = {x: size.x, y: 1, z: size.z};

    const points = vatocmGroundLine.getVertices();

    this.scene.lineFactory.addFragment({id: this.id + 'ground', points, color});
  }

  removeFromGroundFactory() {
    const scene = this.scene;
    const id = this.id;
    scene.groundSingleMeshFactory.removeFragment(id);
    scene.lineFactory.removeFragment(id + 'ground');
  }

  getTooltipSticky() {
    return new TooltipNode(this);
  }

  onHighlight(highlighted) {
    super.onHighlight(highlighted);
    if(highlighted) {
      highlightedSnapshot.select(this.snapshot);
    } else {
      highlightedSnapshot.clear();
    }
  }

  showMetrics(currentMetric) {
    this.stickyNote.switchToMetric();

    if(currentMetric.size === 1) {
      this.singleMetricPillar.changeStateProperty('active', true);
      this.multiMetricPillar.changeStateProperty('active', false);
    } else {
      this.singleMetricPillar.changeStateProperty('active', false);
      this.multiMetricPillar.changeStateProperty('active', true);
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

    this.singleMetricPillar.changeStateProperty('active', false);
    this.multiMetricPillar.changeStateProperty('active', false);
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

    this.updateOnWiredSnapshots = true;
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

    const pos = this.getPosition();

    this.cube.scale.y = this.height;
    this.layer.forEach(p => p.setPosition(pos.x, p.getPosition().y, pos.z));

    this.singleMetricPillar.updateOfVisualComponents(pos);
    this.multiMetricPillar.updateOfVisualComponents(pos);

    this.removeFromGroundFactory();
    this.addToGroundFactory();
  }

  getScreenAnchorPosition() {
    const pos = this.getPosition();
    return {x: pos.x - 0.25, y: pos.y + this.height, z: pos.z + 0.25};
  }

  setPosition(x, y, z) {
    const position = this.getPosition();
    if(x === position.x && y === position.y && z === position.z) {
      return;
    }

    super.setPosition(x, y, z);
    this.updateOfVisualComponents();
  }

  setHeight(height) {
    if(height === this.height) {
      return;
    }

    super.setHeight(height);
    this.updateOfVisualComponents();
  }

  blockCubeHealth(block) {
    this.cubeHealthBlocked = block;
  }

  setHealth(newHealth, force) {
    if(!force && (newHealth === this.health || this.healthBlocked)) {
      return;
    }
    this.health = newHealth;

    //if this node is hidden by filter, dont add the changes to factories
    if(this.isHidden()) {return; }

    //the ground plate is always updated
    this.addToGroundFactory();

    if(!this.cubeHealthBlocked) {
      this.refreshFragment();
      this.updateSolidGeometry();
    }
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
    //dont create a layer if its still there
    if(this.layer.indexOf(layer => snapshot === layer.snapshot) >= 0) {
      return;
    }

    const layer = new Layer({parent: this, snapshot});
    layer.setLayerIndex(this.layer.length);
    this.layer.push(layer);

    this.arrangeChildren();
  }

  arrangeChildren() {
    const layer = this.layer;
    const heightOfEachChild = this.height / layer.length;

    let index = 0;

    layer.forEach(child => {
      const pos = child.getPosition();
      child.setPosition(pos.x, index++ * heightOfEachChild, pos.z);
      child.setHeight(heightOfEachChild);
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
    this.disposeSubscriptions();

    this.singleMetricPillar.dispose();
    this.multiMetricPillar.dispose();

    this.snapshotServer.dispose();
    this.clearLayer();
    this.removeFromGroundFactory();

    super.dispose();

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
