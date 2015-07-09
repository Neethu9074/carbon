'use strict';

/*eslint-disable max-len*/
import THREE from 'three';

import eventBus from 'instana-ui-services/eventbus';
import {theme} from 'instana-ui-services/theme';
import {getPower} from 'instana-ui-sdk/power';
import {health} from 'instana-ui-services/health';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import * as selectedSnapshot from 'instana-ui-services/stores/selectedSnapshot';
import * as highlightedSnapshot from 'instana-ui-services/stores/highlightedSnapshot';

import BaseNode from '../BaseNode/index';
import Layer from '../../Layer';
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

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
let incrementId = 0;


export default class Node extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.incrementId = ++incrementId;
    this.stickyNote = new StickyNoteNode(this);
    this.createMetricCollisionObject();

    this.health = this.health || health.ok;

    this.layer = [];
  }

  registerEvents() {
    super.registerEvents();

    this.snapshotServer = new NodeSnapshotServer(this);

    this.addSubscription(
      highlightedSnapshot.highlightedSnapshot.async().subscribe(highlighted =>
        this.changeStateProperty('mouseOver', isIdEqual(highlighted, this.snapshot))
      )
    );

    this.addSubscription(
      selectedSnapshot.selectedSnapshot.async().subscribe(selected =>
        this.changeStateProperty('selected', isIdEqual(selected, this.snapshot))
      )
    );
  }

  onInactiveEnter() {
    this.removeCollisionObject(this.cube, 1);
    this.addCollisionObject(this.metricCube, 2);

    //save the current health, set health to ok, block the coloring for cube
    //and reset to old health
    const healthBackup = this.health;
    this.setHealth(health.ok);
    this.blockCubeHealth(true);
    this.setHealth(healthBackup);
  }

  onInactiveLeave() {
    this.removeCollisionObject(this.metricCube, 2);
    this.addCollisionObject(this.cube, 1);

    //unblock the coloring for cube and reset the current health
    this.blockCubeHealth(false);
    this.setHealth(this.health, true);
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.addToGroundFactory(id, pos, dim);
    this.addToMultiMetricFactory(id, pos, dim);
    this.addToSingleMetricFactory(id, pos, dim);
  }

  //for the multi metric pillars
  addToMultiMetricFactory(id, pos, dim) {
    const tiles = [];
    for (let i = 0; i < this.scene.numTiles; i++) {
      tiles[i] = {
        old: {from: 0, to: 0},
        new: {from: 0, to: 0}
      };
    }
    const fragment = {id, pos, dim, tiles};

    this.scene.multiMetricFactory.addFragment(fragment);
  }

  //for the single metric pillar
  addToSingleMetricFactory(id, pos, dim) {
    this.scene.singleMetricFactory.addFragment({
      id, pos, dim, newHeight: 0
    });
  }

  //this is not the group where nodes are on!
  //it's the health ground group of each node
  addToGroundFactory(id, pos, dim) {
    this.removeFromGroundFactory();
    if(!this.health || this.health === health.ok) {
      return;
    }

    //adding a existing fragment will penetrate an update
    const color = this.calculateNodeColor();
    const position = pos;
    const size = dim.clone().multiplyScalar(1.5);
    this.scene.groundSingleMeshFactory.addFragment({
      id: id,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new PCP(),
            x: size.x, y: 1, z: size.z
          }),
          x: position.x, y: position.y, z: position.z
        }),
        r: color.r, g: color.g, b: color.b
      })
    });

    const points = new VATOCM({
      contentProvider: new PCM({ //reposition
        contentProvider: new SCM({ //resize
          contentProvider: new FCP(), //get frame
          x: size.x, y: 1, z: size.z
        }),
        x: pos.x, y: pos.y + 0.025, z: pos.z
      })
    }).getVertices();

    this.scene.lineFactory.addFragment({id: this.id + 'ground', points, color});
  }

  removeFromGroundFactory() {
    const scene = this.scene;
    const id = this.id;
    scene.groundSingleMeshFactory.removeFragment(id);
    scene.lineFactory.removeFragment(id + 'ground');
  }

  createMetricCollisionObject() {
    const parent = this;
    let cube;
    this.metricCube = cube = new THREE.Mesh(cubeGeometry);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.position.copy(this.getPosition());
    cube.updateMatrix();
    cube.updateMatrixWorld();

    cube.parentSceneObject = {
      //dummy scene object to serve the mouseover event
      onHighlight(highlighted) {

        //onmouseover
        if(highlighted) {
          this.tooltip = new TooltipMetric({
            getHtmlContainer() {
              return parent.getHtmlContainer();
            },
            snapshot: parent.snapshot
          });

        //onmouseoff
        } else {
          this.tooltip.dispose();
          this.tooltip = undefined;
        }
      }
    };
  }

  updateMetricCollisionObject(newHeight) {
    if(this.metricCube && !this.hidden) {
      const cube = this.metricCube;
      cube.position.copy(this.getPosition());
      const cubeHeight = newHeight * this.height;
      cube.scale.y = cubeHeight < 0.0001 ? 0.001 : cubeHeight;
      cube.updateMatrix();
      cube.updateMatrixWorld();
    }
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

  onSceneObjectSelected(obj) {
    if(obj && obj.id === this.id && this.isSelected()) {
      //if the node was clicked and is still selected ->
      //dont setup state again, but open dashboard
      eventBus.emit('openDashboard', this.snapshot);
    }

    super.onSceneObjectSelected(obj);
  }

  showMetrics() {
    this.changeStateProperty('active', false);

    this.stickyNote.switchToMetric();

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
    this.changeStateProperty('active', true);

    this.stickyNote.switchToIcon();
    // this.scene.singleMeshMetricFactory.removeFragment(this.id);
  }

  setMetricValues(values) {
    if(this.hidden){
      return;
    }

    if(values.length === 1) {
      this.setSingleMetricValue(values[0]);
    } else {
      this.setMultiMetricValues(values);
    }
  }

  setSingleMetricValue(value) {
    const fragment = this.scene.singleMetricFactory.getFragment(this.id );
    if(fragment) {
      fragment.newHeight = value;

      //scale the collision cube to the max pillar size
      this.updateMetricCollisionObject(value);
      this.updateFactoryValues([value]);
    }
  }

  setMultiMetricValues(values) {
    this.newMetricValues = values;

    //set the value to the total node height for better mouseover
    this.updateMetricCollisionObject(this.height);
    this.updateFactoryValues(values);
  }

  updateFactoryValues() {
    // this.scene.singleMeshMetricFactory.setMetricValues(this.id, values);
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

  setWiredStickiesActive() {
    this.getWiredSnapshotsAsArray().forEach((node) => {
      const other = this.findNodeBySnapshot(node);
      other.stickyNote.setInactive(false);
    });
  }

  updateMetricHeight() {
    const frag = this.scene.multiMetricFactory.getFragment(this.id);
    if(this.hidden || !frag) {return; }

    const tiles = frag.tiles;
    let values = [];

    //if there are no new metric values available
    let useOldPos = (this.newMetricValues === undefined);
    if(!useOldPos) {
      values = this.newMetricValues;
      this.newMetricValues = undefined;
    } else {
      //use the "old" to value as the new to value
      values = tiles.map((t) => { return t.new.to; });
    }

    tiles[0] = {
      old: {from: tiles[0].new.from, to: tiles[0].new.to},
      new: {from: 0, to: values[0]}
    };
    for (let i = 1; i < values.length; i++) {
      tiles[i] = {
        old: {from: tiles[i].new.from, to: tiles[i].new.to},
        new: {from: tiles[i - 1].new.to,
          to: useOldPos ? values[i] : tiles[i - 1].new.to + values[i]}
      };
    }
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

    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.health = newHealth;

    //if this node is hidden by filter, dont add the changes to factories
    if(this.hidden) {return; }

    this.addToGroundFactory(id, pos, dim);
    this.updateSolidGeometry();

    if(!this.cubeHealthBlocked) {
      this.refreshFragment();
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

    const scene = this.scene;
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;
    scene.multiMetricFactory.enableFragment(id, enabled);
    scene.singleMetricFactory.enableFragment(id, enabled);

    if(enabled) {
      this.addToGroundFactory(id, pos, dim);
    } else {
      this.removeFromGroundFactory();
    }
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
    scene.multiMetricFactory.removeFragment(id);
    scene.singleMetricFactory.removeFragment(id);
  }

  clearLayer() {
    this.layer.forEach(p => p.dispose());
    this.layer = [];
  }

  dispose() {
    this.snapshotServer.dispose();
    this.clearLayer();
    this.removeFromGroundFactory();

    super.dispose();

    this.layer = [];
    this.wiredSnapshots = undefined;

    this.snapshot = null;
    this.health = null;
    this.metricCube = null;
  }

  calculateNodeColor() {
    const hostHealth = this.health;
    let color;
    if(hostHealth === health.warning) {
      color = new THREE.Color(theme.map.colors.warning);
    } else if(hostHealth === health.danger) {
      color = new THREE.Color(theme.map.colors.critical);
    } else {
      color = new THREE.Color(theme.map.colors.default);
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
