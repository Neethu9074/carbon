import THREE from 'three';

import CylinderHCP from 'in-map/singleMeshFactories/ContentProvider/CylinderHighlightingContentProvider';
import CloudHCP from 'in-map/singleMeshFactories/ContentProvider/CloudHighlightingContentProvider';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import CubeCP from 'in-map/singleMeshFactories/ContentProvider/CylinderContentProvider';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CloudCP from 'in-map/singleMeshFactories/ContentProvider/CloudContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import IconComponent from 'in-map/sceneObjectComponents/iconComponents/Logical';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import ServiceStickyNote from 'in-map/components/stickyNotes/logical/Service';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import {changePosition} from 'in-map/stores/logical/layouterStore';
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

    this.isExternal = params.entity.getIn(['metadata', 'external'], false);
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

    this.isExternal
      ? this.addComponent('mesh', new MeshComponent(this, CloudCP, 'nodes'))
      : this.addComponent('mesh', new MeshComponent(this, CubeCP, 'nodes'));

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

    this.isExternal
      ? this.addComponent('highlighting', new HighlightingComponent(this, CloudHCP))
      : this.addComponent('highlighting', new HighlightingComponent(this, CylinderHCP));

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

      this.eventEmitter.on('healthChanged').subscribe(health => {
        const severity = health.get('maxSeverity', 0);
        const color = severity > 0 ? theme.health[Math.floor(severity)] : '#ffffff';
        this.getComponent('color').setHex(color);
      }),

      focusEntityId$.subscribe(id => {
        if (this.id === id) {
          eventBus.emit('focusPosition', this.getComponent('transform').getPosition());
        }
      }),

      this.eventEmitter.on('positionChanged').subscribe(pos => changePosition(this.id, pos.x, pos.y, pos.z))
    ]);

  }

  dispose() {
    super.dispose();

    stickyNotes.remove(this.id);
    services.remove(this.id);

    this.isExternal = null;
  }
}
