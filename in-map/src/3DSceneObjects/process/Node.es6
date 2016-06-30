import {combineLatest} from 'reactive-observables';

import SnapshotComponent from 'in-map/src/components/common/SnapshotComponent/SnapshotComponent';
import HealthComponent from 'in-map/src/components/common/HealthComponent/HealthComponent';
import {voteUp, voteDown, addNode, removeNode} from 'in-map/src/stores/process/nodesStore';
import StickyNoteCluster from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import TooltipNode from 'in-map/src/2DSceneObjects/tooltips/process/Node';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import DragGhost from 'in-map/src/3DSceneObjects/process/DragGhost';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {getColor} from 'in-sdk/color/color';
import eventBus from 'in-map/src/eventbus';
import {theme} from 'in-services/theme';


export default class Node extends SceneObject {

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

      eventBus.on('dragObjectStart').subscribe(id => {
        if (this.id === id) {
          this.dragGhost = new DragGhost(this);
        }
      }),

      eventBus.on('dragObjectStop').subscribe(() => {
        if (this.dragGhost) {
          this.dragGhost.dispose();
          this.dragGhost = null;
        }
      }),

      combineLatest([
        this.eventEmitter.on('snapshotChanged'),
        this.eventEmitter.on('healthChanged')
      ]).subscribe(props => this.setColor(props[0], props[1])),

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

    const components = this.components;
    const sceneObject = this;

    components.snapshot = new SnapshotComponent({sceneObject});

    components.health = new HealthComponent({sceneObject});

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
    this.childIds.forEach(id => voteUp(id));
    this.isExpanded = true;
  }

  collapse() {
    this.childIds.forEach(id => voteDown(id));
    this.isExpanded = false;
  }

  setChildIds(childIds) {
    this.childIds = Object.keys(childIds);
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

  positionChanged(newPos) {
    this.getComponent('screenPositionCluster').set3DPositionToProject(newPos.x - 0.7,
                                                                      newPos.y,
                                                                      newPos.z + 0.8);

    this.getComponent('screenPositionMetric').set3DPositionToProject(newPos.x,
                                                                     this.height,
                                                                     newPos.z);
  }

  setColor(snapshot, maxSeverity) {
    if (maxSeverity === 0 && snapshot) {
      this.eventEmitter.emit('colorChanged', getColor(snapshot));
    } else if (maxSeverity > 0) {
      this.eventEmitter.emit('colorChanged', hexToRGBNormalized(theme.health[Math.floor(maxSeverity)]));
    }
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
