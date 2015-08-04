'use strict';

import _ from 'lodash';
import THREE from 'three';

import SceneObject from '../SceneObject/index';
import Node from '../Nodes/Node/index';
import UnknownNode from '../Nodes/UnknownNode/index';
import StickyNote from '../StickyNote/Ground';
/*eslint-disable max-len*/
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import VATOCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/VertexArrayToObjectContentManipulator';
/*eslint-enable max-len*/

import eventBus from 'in-services/eventbus';
import {getIdString} from 'in-services/util/snapshots';
import {getColor} from 'in-sdk/zones';
import {hexToRGBNormalized} from 'in-services/converters';

const collisionGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1, 1, 1);


export default class Group extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;
    this.children = [];
    this.size = {x: 1, y: 1, z: 1};

    this.stickyNote = new StickyNote(this);

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => {
      this.update();
    }));

    this.addCollisionPlane();

    this.geometryProvider = new VATOCM({
      contentProvider: new PCM({ //reposition
        contentProvider: new SCM({ //resize
          contentProvider: new FCP()
        })
      })
    });
  }

  onInitialEnter() {}

  onInitialLeave() {}

  addCollisionPlane() {
    const plane = this.collisionPlane = new THREE.Mesh(collisionGeometry);
    plane.rotation.x = -Math.PI / 2;
    plane.matrixAutoUpdate = false;
    plane.rotationAutoUpdate = false;

    plane.parentSceneObject = this;
  }

  update() {
    this.updateScreenPosition();

    if(this.isInView()) {
      this.stickyNote.update();
    } else {
      this.stickyNote.hide();
    }
  }

  addNode(snapshot, unknown=false) {
    const nodeId = getIdString(snapshot);

    //if there is no nodeId it's an unknown node
    if(nodeId) {
      //check if the node was already created and only needs an update
      let matchedNode = _.find(this.children, node => node.id === nodeId);

      //if the node was created in the past
      if(matchedNode) {
        matchedNode.onSnapshotUpdate(snapshot);
      } else if(unknown){
        this.children.push(new UnknownNode({parent: this, snapshot}));
      } else {
        this.children.push(new Node({parent: this, snapshot}));
      }
    }
  }

  addUnknownNode(node) {
    if(this.id === 'unmonitored') {
      this.addNode(node, true);
    } else {
      this.parent.addUnknownNode(node);
    }
  }

  addGroup(group) {
    if(this.children.indexOf(child => child.id === group.id) >= 0) {
      return;
    }

    this.children.push(group);
  }

  getDimension() {
    let width = 1;
    let depth = 1;

    this.children.forEach(child => {
      const w = child.getDimension().width;
      if(w > width) {
        width = w;
      }
    });

    width += 2;

    this.children.forEach(child => {
      depth += 1 + child.getDimension().depth;
    });

    return {width, depth};
  }

  updateOfVisualComponents() {
    const pos = this.getPosition();
    const size = this.size;
    super.setScreenPositionAnchor(pos.x, pos.y, pos.z + size.z / 2);
    this.collisionPlane.scale.set(size.x, size.z, 1);
    this.collisionPlane.position.copy(pos);

    this.refreshCollisionObject();
    this.refreshGroundGeometry();
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);

    this.updateOfVisualComponents();
  }

  setScale(x, y, z) {
    this.size = {x, y, z};

    this.updateOfVisualComponents();
  }

  refreshCollisionObject() {
    const plane = this.collisionPlane;
    plane.updateMatrix();
    plane.updateMatrixWorld();
    // this.removeCollisionObject(plane);
    // this.addCollisionObject(plane);
  }

  refreshGroundGeometry() {
    const color = hexToRGBNormalized(getColor(this.id) || 0xFFFFFF);
    const lineFactory = this.scene.lineFactory;
    const size = this.size;
    const pos = this.getPosition();
    const pcm = this.geometryProvider.contentProvider;
    const scm = pcm.contentProvider;

    pcm.position = {x: pos.x, y: pos.y, z: pos.z};
    scm.scale = {x: size.x, y: 1, z: size.z};

    const points = this.geometryProvider.getVertices();

    lineFactory.removeFragment(this.id);
    lineFactory.addFragment({id: this.id, points, color});
  }

  removeChild(child) {
    _.remove(this.children, node => node.id === child.id);

    //destroy this group if there are no children anymore
    if(this.children.length === 0) {
      //remove this from parents groups collection
      this.parent.removeChild(this);

      this.dispose();
    }
  }

  dispose() {
    super.dispose();

    this.children.forEach(node => node.dispose());
    this.children = [];

    this.scene.lineFactory.removeFragment(this.id);
    this.removeCollisionObject(this.collisionPlane);

    this.stickyNote.dispose();
    this.stickyNote = null;

    this.id = null;
  }
}
