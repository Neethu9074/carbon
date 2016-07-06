import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import HighlightingComponent from 'in-map/src/components/process/HighlightingComponentForCylinder';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import TopMeshComponent from 'in-map/src/components/process/TopMeshComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CPCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderPlaneContentProvider';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/node/KPI/Cluster';
import StickyNoteCluster from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import {voteUp, voteDown} from 'in-map/src/stores/process/nodesStore';
import Label from 'in-map/src/3DSceneObjects/process/Label';
import Node from 'in-map/src/3DSceneObjects/process/Node';


export default class NodeCluster extends Node {

  constructor(props) {
    super(props);

    this.addSubscriptions([
      this.eventEmitter.on('screenPositionChanged_screenPositionCluster').subscribe(screenPosition => {
        if (this.stickyNote) {
          this.stickyNote.setScreenPosition(screenPosition);
        }
      }),

      this.eventEmitter.on('screenPositionChanged_screenPositionCluster').subscribe(screenPosition => {
        if (this.stickyNote) {
          this.stickyNote.setScreenPosition(screenPosition);
        }
      }),

      combineLatest([
        this.eventEmitter.on('onNumOfChildrenChanged').distinct(),
        this.eventEmitter.on('onExpand').distinct()
      ]).subscribe(([numChildren, isExpanded]) => {
        this.eventEmitter.emit('isFullyVisible', isExpanded || numChildren === 0);
      })
    ]);

    this.eventEmitter.emit('onExpand', false);
  }

  init() {
    this.height = 0.5;

    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 2.5
    });
  }

  addComponents(components) {
    const sceneObject = this;
    const factory = this.getFactory('transparentSMF');

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
      factory
    });

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlight = new HighlightingComponent({sceneObject});

    // the topping of the cylinder
    components.topMesh = new TopMeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CPCP()
          })
        })
      }),
      factory: this.getFactory('solidSMF')
    });
    components.topMesh.sizeChanged({x: 0.9, y: 0.9, z: 0.9});

    components.screenPositionCluster = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPositionCluster'
    });

    components.screenPositionMetric = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPositionMetric'
    });
  }

  setChildIds(childIds) {
    this.childIds = Object.keys(childIds);
    this.eventEmitter.emit('onNumOfChildrenChanged', this.childIds.length);

    if (this.childIds.length === 0) {
      if (this.stickyNote) {
        this.stickyNote.dispose();
        this.stickyNote = null;
      }
      return;
    }

    if (!this.stickyNote) {
      this.stickyNote = new StickyNoteCluster(this);
    }

    this.stickyNote.setNumChildren(this.childIds.length);
  }

  expand() {
    this.eventEmitter.emit('onExpand', true);
    this.childIds.forEach(id => voteUp(id));
  }

  collapse() {
    this.eventEmitter.emit('onExpand', false);
    this.childIds.forEach(id => voteDown(id));
  }

  updateScreenPosition() {
    this.getComponent('screenPositionCluster').updateScreenPosition();
    this.getComponent('screenPositionMetric').updateScreenPosition();
  }

  positionChanged(newPos) {
    super.positionChanged(newPos);

    this.label.getComponent('position').setPosition(newPos.x - 0.5, this.height, newPos.z + 0.5);

    this.getComponent('screenPositionCluster').set3DPositionToProject(newPos.x - 0.7,
                                                                      newPos.y,
                                                                      newPos.z + 0.8);
  }

  createMetricSticky() {
    return new StickyNoteMetric(this);
  }

  getDragGhostGeometry() {
    return new THREE.CylinderBufferGeometry(0.5, 0.5, 0.5, 20, 20);
  }

  dispose() {
    super.dispose();

    if (this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }

    this.label.dispose();
    this.label = null;
  }
}
