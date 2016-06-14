import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import {
  voteUp,
  voteDown,
  addNode,
  removeNode,
  nodeMetricsAreActive$
} from 'in-map/src/3DSceneObjects/process/processViewStores';
import StickyNoteCluster from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Metric';
import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/process/Node';
import {getColorPool} from 'in-services/util/ColorGenerator';
import eventBus from 'in-map/eventbus';

import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import HighlightingComponent from 'in-map/src/components/process/HighlightingComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import TopMeshComponent from 'in-map/src/components/process/TopMeshComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CPCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderPlaneContentProvider';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import SceneObjectWithSnapshot from 'in-map/src/3DSceneObjects/common/SceneObjectWithSnapshot';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import Label from 'in-map/src/3DSceneObjects/process/Label';


export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.isExpanded = false;
    this.edgeCount = 0;

    this.tooltip = new TooltipNode(this);
    this.label = new Label({
      id: this.id,
      parent: this,
      iconSize: 2.5
    });

    this.addSubscriptions([
      eventBus.on('endUpdate').subscribe(() => {
        this.getComponent('screenPositionCluster').updateScreenPosition();
        this.getComponent('screenPositionMetric').updateScreenPosition();
      }),

      this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)),

      this.eventEmitter.on('screenPositionChanged_screenPositionCluster').subscribe(screenPosition => {
        if (this.stickyNote) {
          this.stickyNote.setScreenPosition(screenPosition);
        }
      }),

      this.eventEmitter.on('isVisibleChanged_screenPositionCluster').distinct().subscribe(isVisible => {
        if (this.stickyNote) {
          isVisible ? this.stickyNote.show() : this.stickyNote.hide();
        }
      }),

      this.eventEmitter.on('screenPositionChanged_screenPositionMetric').subscribe(screenPosition => {
        if (this.stickyNoteMetric) {
          this.stickyNoteMetric.setScreenPosition(screenPosition);
        }
      }),

      combineLatest([
        this.eventEmitter.on('isVisibleChanged_screenPositionMetric').distinct(),
        nodeMetricsAreActive$
      ]).subscribe(props => {
        if (props[0] && props[1]) {
          if (!this.stickyNoteMetric) {
            this.stickyNoteMetric = new StickyNoteMetric(this);

            // force screen position update
            this.getComponent('screenPositionMetric').updateScreenPosition(true);
          }
        } else if (this.stickyNoteMetric) {
          this.stickyNoteMetric.dispose();
          this.stickyNoteMetric = null;
        }
      })
    ]);

    this.eventEmitter.emit('sizeChanged', { x: 1, y: this.height, z: 1 });

    addNode(this);
  }

  onHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }


  init() {
    this.height = 1;
  }

  initComponents() {
    super.initComponents();

    const factory = this.getFactory('transparentSMF');
    const components = this.components;
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

  onSnapshotUpdated(snapshot) {
    this.components.mesh.colorChanged(getColorPool('processes').getColorRGB(snapshot.get('plugin')));
  }

  increaseEdgeCount() {
    this.edgeCount++;
  }

  decreaseEdgeCount() {
    this.edgeCount--;
  }

  getEdgeCount() {
    return this.edgeCount;
  }

  getTooltip() {
    return this.tooltip;
  }

  expand() {
    Object.keys(this.childIds).forEach(id => voteUp(id));
  }

  collapse() {
    Object.keys(this.childIds).forEach(id => voteDown(id));
  }

  setChildIds(childIds) {
    this.childIds = childIds;
    const numChildren = Object.keys(childIds).length;
    if (numChildren === 0) {
      return;
    }

    if (!this.stickyNote) {
      this.stickyNote = new StickyNoteCluster(this);
    }

    this.stickyNote.setNumChildren(Object.keys(childIds).length);

    // TODO: if expanded, add to scene
  }

  positionChanged(newPos) {
    this.label.getComponent('position').setPosition(newPos.x - 0.5, this.height / 2, newPos.z + 0.5);

    this.getComponent('screenPositionCluster').set3DPositionToProject(newPos.x - 0.7,
                                                                      newPos.y,
                                                                      newPos.z + 0.8);

    this.getComponent('screenPositionMetric').set3DPositionToProject(newPos.x,
                                                                     this.height * 0.5,
                                                                     newPos.z);
  }

  dispose() {
    removeNode(this);

    super.dispose();

    this.label.dispose();
    this.label = null;

    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }

    if (this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }

    try {
      this.tooltip.unMount();
      this.tooltip.dispose();
    } catch (er) {
      // the tooltip is already unmounted
      this.tooltip = null;
    }

    this.height = null;
    this.children = null;
    this.isExpanded = null;
  }
}
