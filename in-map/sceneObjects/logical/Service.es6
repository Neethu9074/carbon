import THREE from 'three';

import CHCP from 'in-map/singleMeshFactories/ContentProvider/CylinderHighlightingContentProvider';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CylinderContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import ServiceStickyNote from 'in-map/components/stickyNotes/logical/Service';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import {focusEntityId$} from 'in-map/stores/focusEntityStore';
import services from 'in-map/stores/logical/servicesStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import DragGhost from 'in-map/misc/logical/DragGhost';
import {eventBus} from 'in-map/services/eventBus';
import {theme} from 'in-services/theme';


export default class Service extends SceneObject {

  constructor(params) {
    super(params.id);
  }

  init() {
    super.init();

    services.add(this.id, this);

    stickyNotes.add(this.id, {
      type: ServiceStickyNote,
      eventEmitter: this.eventEmitter,
      props: {
        id: this.id
      }
    });
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));

    this.addComponent('icon', new IconComponent(this, 3, (pos, scale) => {
      return {
        x: 0,
        y: scale.y + 0.75,
        z: 0
      };
    }));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('highlighting', new HighlightingComponent(this, CHCP));

    this.addComponent('screenPosition', new ScreenPositionComponent(this, (pos, scale) => {
      return {
        x: pos.x + scale.x,
        y: pos.y + scale.y,
        z: pos.z - scale.z / 2
      };
    }));

    this.addComponent('health', new HealthComponent(this));

    // unknown service hack
    this.id.startsWith('unknown-service')
      ? this.getComponent('transform').setScaleXYZ(0.5, 0.25, 0.5)
      : this.getComponent('transform').setScaleXYZ(1, 0.25, 1);
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      eventBus.on('dragObjectStart').subscribe(id => {
        if (this.id === id) {
          const scale = this.getComponent('transform').getScale();
          const radius = scale.x / 2;
          this.dragGhost = new DragGhost(this, new THREE.CylinderBufferGeometry(radius, radius, scale.y, 20, 20));
        }
      }),

      eventBus.on('dragObjectStop').subscribe(() => {
        if (this.dragGhost) {
          const positionToSet = this.dragGhost.getCurrentPosition();
          this.getComponent('transform').setPosition(positionToSet);

          this.dragGhost.dispose();
          this.dragGhost = null;
        }
      }),

      eventBus.on('zoomLevelChanged').subscribe(zoomLevel => this.eventEmitter.emit('isFullyVisible', zoomLevel < 300)),

      this.eventEmitter.on('healthChanged').subscribe(health => {
        const severity = health.get('maxSeverity', 0);
        const color = severity > 0 ? theme.health[Math.floor(severity)] : '#ffffff';
        this.getComponent('color').setHex(color);
      }),

      focusEntityId$.subscribe(id => {
        if (this.id === id) {
          eventBus.emit('focusPosition', this.getComponent('transform').getPosition());
        }
      })
    ]);

  }

  dispose() {
    super.dispose();

    stickyNotes.remove(this.id);
    services.remove(this.id);
  }
}
