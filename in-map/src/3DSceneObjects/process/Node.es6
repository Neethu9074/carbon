import {combineLatest} from 'reactive-observables';

import SnapshotComponent from 'in-map/src/components/common/SnapshotComponent/SnapshotComponent';
import HealthComponent from 'in-map/src/components/common/HealthComponent/HealthComponent';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {changePosition} from 'in-map/src/stores/process/logicalLayouterStore';
import {addNode, removeNode} from 'in-map/src/stores/process/nodesStore';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import DragGhost from 'in-map/src/3DSceneObjects/process/DragGhost';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {focusEntityId$} from 'in-map/src/stores/focusEntity';
import {eventBus} from 'in-map/src/services/eventBus';
import {theme} from 'in-services/theme';


const NODE_BASE_COLOR = hexToRGBNormalized('#ffffff');

export default class Node extends SceneObject {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.stickyNote = this.createSticky();

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

      this.eventEmitter.on('screenPositionChanged_screenPosition').subscribe(screenPosition =>
        this.stickyNote.setScreenPosition(screenPosition)),

      parent.onZoomLevel().subscribe(zoomLevel =>
        this.eventEmitter.emit('sicktyFullyVisibilityChanged', zoomLevel < 500)),

      focusEntityId$.subscribe(id => {
        if (this.id === id) {
          eventBus.emit('flyToEntity', this);
        }
      })
    ]);

    this.eventEmitter.emit('sizeChanged', { x: 1, y: this.height, z: 1 });
    this.eventEmitter.emit('onHighlight', false);

    addNode(this);
  }

  onHighlightEnter() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.eventEmitter.emit('onHighlight', true);
  }

  onHighlightLeave() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.eventEmitter.emit('onHighlight', false);
  }

  onSelectedEnter() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onSelectedLeave() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
    this.eventEmitter.emit('onHighlight', true);
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('solidMesh', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
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

  createSticky() {}

  getTooltip() {
    return null;
  }

  positionChanged(newPos) {
    this.getComponent('screenPosition').set3DPositionToProject(newPos.x,
                                                               this.height + 0.5,
                                                               newPos.z + 0.5);

    changePosition(this.id, newPos.x, newPos.y, newPos.z);
  }

  setColor(snapshot, maxSeverity) {
    this.eventEmitter.emit('colorChanged', maxSeverity > 0 ?
      hexToRGBNormalized(theme.health[Math.floor(maxSeverity)]) :
      NODE_BASE_COLOR);
  }

  dispose() {
    removeNode(this);

    super.dispose();

    this.stickyNote.dispose();
    this.stickyNote = null;

    this.height = null;
    this.children = null;
  }
}
