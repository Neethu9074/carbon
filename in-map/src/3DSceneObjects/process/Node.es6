import {combineLatest} from 'reactive-observables';

import {
  voteUp,
  voteDown,
  addNode,
  removeNode
} from 'in-map/src/3DSceneObjects/process/processViewStores';
import StickyNoteCluster from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/process/Node';
import eventBus from 'in-map/eventbus';

import SceneObjectWithSnapshot from 'in-map/src/3DSceneObjects/common/SceneObjectWithSnapshot';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {getColor} from 'in-sdk/color/color';


export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.isExpanded = false;
    this.edgeCount = 0;

    this.tooltip = new TooltipNode(this);

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
        parent.onZoomLevel()
      ]).subscribe(props =>
        // isVisible && zoomLevel < 500
        (props[0] && props[1] < 500) ?
          this.getOrCreateMetricSticky() :
          this.disposeMetricSticky()
      )
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

  initComponents() {
    super.initComponents();

    this.addComponents(this.components);
  }

  getOrCreateMetricSticky() {
    if (!this.stickyNoteMetric) {
      this.stickyNoteMetric = this.createMetricSticky();

      // force screen position update
      this.getComponent('screenPositionMetric').updateScreenPosition(true);
    }
  }

  createMetricSticky() {}

  disposeMetricSticky() {
    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }
  }

  onSnapshotUpdated(snapshot) {
    this.components.mesh.colorChanged(getColor(snapshot));
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
    this.getComponent('screenPositionCluster').set3DPositionToProject(newPos.x - 0.7,
                                                                      newPos.y,
                                                                      newPos.z + 0.8);

    this.getComponent('screenPositionMetric').set3DPositionToProject(newPos.x,
                                                                     this.height,
                                                                     newPos.z);
  }

  dispose() {
    removeNode(this);

    super.dispose();

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
