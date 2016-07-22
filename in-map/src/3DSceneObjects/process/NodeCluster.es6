import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import HighlightingComponent from 'in-map/src/components/process/HighlightingComponentForCylinder';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import SolidMeshComponent from 'in-map/src/components/process/SolidMeshComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import {relations$} from 'in-map/src/stores/process/nodeChildrenRelations';
import {expand, collapse} from 'in-map/src/stores/process/expandedNodes';
import Label from 'in-map/src/3DSceneObjects/process/Label';
import Node from 'in-map/src/3DSceneObjects/process/Node';


export default class NodeCluster extends Node {

  constructor(props) {
    super(props);

    const eventEmitter = this.eventEmitter;
    this.addSubscriptions([
      relations$.subscribe(relationsMap => this.setChildren(relationsMap[this.id])),

      combineLatest([
        eventEmitter.on('onNumOfChildrenChanged').distinct(),
        eventEmitter.on('onExpand').distinct()
      ]).subscribe(([numChildren, isExpanded]) => {
        eventEmitter.emit('isFullyVisible', isExpanded || numChildren === 0);
      })
    ]);

    eventEmitter.emit('onExpand', false);
  }

  init() {
    this.height = 0.25;
  }

  addComponents(components) {
    const sceneObject = this;

    // add the mesh component to handle visual representation of the entity
    components.mesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory: this.getFactory('fadeByDistanceSMF')
    });

    components.solidMesh = new SolidMeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory: this.getFactory('solidSMF')
    });

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlight = new HighlightingComponent({sceneObject});

    components.screenPosition = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPosition'
    });
  }

  setChildren(ids) {
    const numChildren = ids ? ids.size : 0;
    this.stickyNote.setChildren(ids ? ids : null);
    this.eventEmitter.emit('onNumOfChildrenChanged', numChildren);

    if (numChildren > 0 && !this.label) {
      this.label = new Label({
        id: this.id,
        parent: this,
        snapshotId: ids.getIn([0, 'id']),
        iconSize: 2.75
      });
    }
  }

  expand() {
    this.eventEmitter.emit('onExpand', true);
    expand(this.id);
  }

  collapse() {
    this.eventEmitter.emit('onExpand', false);
    collapse(this.id);
  }

  updateScreenPosition() {
    this.getComponent('screenPosition').updateScreenPosition();
  }

  positionChanged(newPos) {
    super.positionChanged(newPos);

    if (this.label) {
      this.label.getComponent('position').setPosition(newPos.x - 0.5, this.height + 0.8, newPos.z + 0.5);
    }
  }

  createSticky() {
    return new StickyNote(this);
  }

  getDragGhostGeometry() {
    return new THREE.CylinderBufferGeometry(0.5, 0.5, 0.5, 20, 20);
  }

  dispose() {
    super.dispose();

    if (this.label) {
      this.label.dispose();
      this.label = null;
    }
  }
}
