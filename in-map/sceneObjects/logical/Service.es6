import {simpleServiceGeometry, externalServiceGeometry, eumServiceGeometry} from 'in-map/misc/fixedGeometries';
import CylinderHCP from 'in-map/singleMeshFactories/ContentProvider/CylinderHighlightingContentProvider';
import CloudHCP from 'in-map/singleMeshFactories/ContentProvider/CloudHighlightingContentProvider';
import HighlightingMeshComponent from 'in-map/sceneObjectComponents/HighlightingMeshComponent';
import EumHCP from 'in-map/singleMeshFactories/ContentProvider/EumHighlightingContentProvider';
import CylinderCP from 'in-map/singleMeshFactories/ContentProvider/CylinderContentProvider';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import CloudCP from 'in-map/singleMeshFactories/ContentProvider/CloudContentProvider';
import EumCP from 'in-map/singleMeshFactories/ContentProvider/EumContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import IconComponent from 'in-map/sceneObjectComponents/iconComponents/Logical';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {OCTREE_LAYER, PREDEFINED_COLLISION_OBJECTS} from 'in-map/misc/serviceLocator/physics/physicsConstants';
import ServiceStickyNote from 'in-map/components/stickyNotes/logical/Service';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import {changePosition} from 'in-map/stores/logical/layouterStore';
import services from 'in-map/stores/logical/servicesStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import DragGhost from 'in-map/misc/logical/DragGhost';
import {eventBus} from 'in-map/services/eventBus';
import {theme} from 'in-services/theme';


export default class Service extends SceneObject {

  constructor(params) {
    super(params);

    this.isExternal = params.entity.metadata.external || false;
    this.isEum = params.entity.metadata.eum || false;
    this.isUnknown = params.id.startsWith('unknown-service');
  }

  init() {
    super.init();

    // unknown service hack
    if (!this.isUnknown) {
      stickyNotes.add(this.id, {
        type: ServiceStickyNote,
        eventEmitter: this.eventEmitter,
        props: {
          id: this.id,
          isExternal: this.isExternal
        }
      });
    }
  }

  initComponents() {
    super.initComponents();

    if (isWebVRActive) {
      this.addComponent('mesh', new MeshComponent(this, this.isExternal ? CloudCP : CylinderCP, 'nodes'));

    } else {
      if (this.isExternal && !this.isEum) {
        this.addComponent('mesh', new MeshComponent(this, CloudCP, 'nodes'));

        this.addComponent('highlighting_mesh', new HighlightingMeshComponent(this, CloudHCP));

        this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, CloudCP, 'solid'));

        this.addComponent('highlighting_mesh_secondary_solid', new HighlightingMeshComponent(this, CloudHCP, 'secondary_solid', 'isSecondaryHighlighted'));

      } else if (this.isEum) {
        this.addComponent('mesh', new MeshComponent(this, EumCP, 'nodes'));

        this.addComponent('highlighting_mesh', new HighlightingMeshComponent(this, EumHCP));

        this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, EumCP, 'solid'));

        this.addComponent('highlighting_mesh_secondary_solid', new HighlightingMeshComponent(this, EumHCP, 'secondary_solid', 'isSecondaryHighlighted'));

      } else {
        this.addComponent('mesh', new MeshComponent(this, CylinderCP, 'nodes'));

        this.addComponent('highlighting_mesh', new HighlightingMeshComponent(this, CylinderHCP));

        this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, CylinderCP, 'solid'));

        this.addComponent('highlighting_mesh_secondary_solid', new HighlightingMeshComponent(this, CylinderHCP, 'secondary_solid', 'isSecondaryHighlighted'));
      }

      this.addComponent('collision', new CollisionComponent(this,
                                                            PREDEFINED_COLLISION_OBJECTS.BOX,
                                                            OCTREE_LAYER.NODES));

      if (!this.isUnknown) {
        this.addComponent('screenPosition', new ScreenPositionComponent(this, (pos, scale) => {
          return {
            x: pos.x + scale.x,
            y: pos.y + scale.y,
            z: pos.z - scale.z / 2
          };
        }));
      }
    }

    this.addComponent('icon', new IconComponent(this, 6, (pos, scale) => {
      return {
        x: 0,
        y: scale.y + 0.75,
        z: 0
      };
    }));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('health', new HealthComponent(this));

    if (this.isUnknown) {
      this.getComponent('transform').setScaleXYZ(0.5, 0.25, 0.5);
    } else if (this.isEum) {
      this.getComponent('transform').setScaleXYZ(1, 1, 1);
    } else {
      this.getComponent('transform').setScaleXYZ(1, 0.25, 1);
    }
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      eventBus.on('dragObjectStart').subscribe(id => {
        if (this.id === id) {
          if (this.isExternal && !this.isEum) {
            this.dragGhost = new DragGhost(this, externalServiceGeometry);
          } else if (this.isEum) {
            this.dragGhost = new DragGhost(this, eumServiceGeometry);
          } else {
            this.dragGhost = new DragGhost(this, simpleServiceGeometry);
          }
          this.dragGhost.setScale(this.getComponent('transform').getScale());
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

      this.eventEmitter.on('positionChanged').subscribe(pos => changePosition(this.id, pos.x, pos.y, pos.z))
    ]);
  }

  initialized() {
    super.initialized();

    services.add(this.id, this);
  }

  dispose() {
    super.dispose();

    stickyNotes.remove(this.id);
    services.remove(this.id);

    this.isExternal = null;
  }
}
