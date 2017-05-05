import HighlightingMeshComponent from 'in-map/sceneObjectComponents/HighlightingMeshComponent';
import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import FCCP from 'in-map/singleMeshFactories/ContentProvider/FullCubeContentProvider';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import IconComponent from 'in-map/sceneObjectComponents/iconComponents/Physical';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import TooltipComponent from 'in-map/sceneObjectComponents/TooltipComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import PowerComponent from 'in-map/sceneObjectComponents/PowerComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import { OCTREE_LAYER, PREDEFINED_COLLISION_OBJECTS } from 'in-map/misc/serviceLocator/physics/physicsConstants';
import createObjectCollectionStream from 'in-map/stores/ObjectCollectionStream';
import NodeStickyNote from 'in-map/components/stickyNotes/physical/Node';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import createLayerLayouter from 'in-map/misc/physical/LayerLayouter';
import NodeTooltip from 'in-map/components/tooltips/physical/Node';
import { showSticky$ } from 'in-map/stores/physical/nodesStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { isWebVRActive } from 'in-map/stores/webVRStore';
import { getColorBySeverity } from 'in-stores/events';

export default class Node extends SceneObject {
  constructor(params) {
    super(params);

    this.group = params.group;
    this.layer = createObjectCollectionStream();
    this._cachedLabel = this.id;
  }

  init() {
    super.init();

    this.group.addNode(this.id, this);

    this.layerLayouter = createLayerLayouter(this);

    stickyNotes.add(this.id, {
      type: NodeStickyNote,
      props: {
        id: this.id,
        eventEmitter: this.eventEmitter,
        showSticky$
      }
    });
  }

  initComponents() {
    super.initComponents();

    if (isWebVRActive) {
      this.addComponent('mesh', new MeshComponent(this, FCCP, 'nodes'));

      this.addComponent(
        'icon',
        new IconComponent(this, 3, (pos, scale) => {
          return {
            x: 0,
            y: scale.y + 0.25,
            z: 0
          };
        })
      );

      this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, FCCP, 'solid'));
    } else {
      this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));

      this.addComponent(
        'icon',
        new IconComponent(this, 3, (pos, scale) => {
          return {
            x: scale.x / 2,
            y: scale.y + 0.25,
            z: -scale.z / 2
          };
        })
      );

      this.addComponent(
        'screenPosition',
        new ScreenPositionComponent(this, (pos, scale) => {
          return {
            x: pos.x + 0.75,
            y: pos.y + scale.y,
            z: pos.z - 0.75
          };
        })
      );

      this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, CCP, 'solid'));

      this.addComponent('highlighting_mesh', new HighlightingMeshComponent(this, CHCP));

      this.addComponent('tooltip', new TooltipComponent(this, NodeTooltip));

      this.addComponent(
        'collision',
        new CollisionComponent(this, PREDEFINED_COLLISION_OBJECTS.BOX, OCTREE_LAYER.NODES)
      );
    }

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('health', new HealthComponent(this));

    this.addComponent('power', new PowerComponent(this));
  }

  initEvents() {
    super.initEvents();

    const isVisibleChangedCallback = this.isVisibleChanged.bind(this);
    const healthChangedCallback = this.healthChanged.bind(this);
    this.addSubscriptions([
      this.eventEmitter.on('isVisibleChanged' + this.id).subscribe(isVisibleChangedCallback),
      this.eventEmitter.on('healthChanged').subscribe(healthChangedCallback)
    ]);

    // enable visibility for metric pillars
    if (isWebVRActive) {
      this.eventEmitter.emit('isVisibleChanged' + this.id, true);
    }
  }

  initialized() {
    super.initialized();

    nodes.add(this.id, this);
  }

  isVisibleChanged(isVisible) {
    this.eventEmitter.emit('isVisibleForMetrics', isVisible);
  }

  healthChanged(health) {
    const severity = health ? health.get('maxSeverity', 0) : 0;
    const color = severity > 0 ? getColorBySeverity(severity) : '#ffffff';
    this.getComponent('color').setHex(color);
  }

  addLayer(id, node) {
    this.layer.add(id, node);
  }

  removeLayer(id) {
    this.layer.remove(id);
  }

  dispose() {
    super.dispose();

    this.layerLayouter.dispose();
    this.layerLayouter = null;

    stickyNotes.remove(this.id);
    nodes.remove(this.id);

    this.group.removeNode(this.id);

    this._cachedLabel = null;
    this.group = null;
  }
}
