import {combineLatest} from 'reactive-observables';

import SnapshotComponent from 'in-map/src/components/common/SnapshotComponent/SnapshotComponent';
import HealthComponent from 'in-map/src/components/common/HealthComponent/HealthComponent';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {addNode, removeNode} from 'in-map/src/stores/process/nodesStore';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import DragGhost from 'in-map/src/3DSceneObjects/process/DragGhost';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import eventBus from 'in-map/src/eventbus';
import {theme} from 'in-services/theme';
import {getColor} from 'in-sdk/color';


export default class Node extends SceneObject {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.edgeCount = 0;

    this.addSubscriptions([
      eventBus.on('endUpdate').subscribe(this.updateScreenPosition.bind(this)),

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

      this.eventEmitter.on('screenPositionChanged_screenPositionMetric').subscribe(screenPosition => {
        if (this.stickyNoteMetric) {
          this.stickyNoteMetric.setScreenPosition(screenPosition);
        }
      }),

      combineLatest([
        this.eventEmitter.on('isVisibleChanged_screenPositionMetric')
                         .distinct(),
        parent.onZoomLevel(),
        this.eventEmitter.on('onHighlight')
                         .debounce(100)
                         .distinct()
      ]).subscribe(([isVisible, zoomLevel, isHighlighted]) =>
        (isVisible && (zoomLevel < 500 || isHighlighted)) ?
          this.getOrCreateMetricSticky(isHighlighted) :
          this.disposeMetricSticky()
      )
    ]);

    this.eventEmitter.emit('sizeChanged', { x: 1, y: this.height, z: 1 });
    this.eventEmitter.emit('onHighlight', false);

    addNode(this);
  }

  onHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.eventEmitter.emit('onHighlight', true);
  }

  onHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.eventEmitter.emit('onHighlight', false);
  }

  onSelectedEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.eventEmitter.emit('onHighlight', true);
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.eventEmitter.emit('onHighlight', false);
  }

  initComponents() {
    super.initComponents();

    const components = this.components;
    const sceneObject = this;

    components.snapshot = new SnapshotComponent({sceneObject});

    components.health = new HealthComponent({sceneObject});

    this.addComponents(this.components);
  }

  getOrCreateMetricSticky(isHighlighted) {
    if (!this.stickyNoteMetric) {
      this.stickyNoteMetric = this.createMetricSticky();

      // force screen position update
      this.getComponent('screenPositionMetric').updateScreenPosition(true);
    }
    this.stickyNoteMetric.setHighlighted(isHighlighted);
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
    return null;
  }

  positionChanged(newPos) {
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

    this.height = null;
    this.children = null;
  }
}
