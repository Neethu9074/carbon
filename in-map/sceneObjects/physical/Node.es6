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

import {OCTREE_LAYER, PREDEFINED_COLLISION_OBJECTS} from 'in-map/misc/serviceLocator/physics/physicsConstants';
import createObjectCollectionStream from 'in-map/stores/ObjectCollectionStream';
import createLayerLayouter from 'in-map/misc/physical/LayerLayouter';
import NodeTooltip from 'in-map/components/tooltips/physical/Node';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {nodes} from 'in-map/stores/physical/nodesStore';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import {theme} from 'in-services/theme';


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
  }

  initComponents() {
    super.initComponents();

    if (isWebVRActive) {
      this.addComponent('mesh', new MeshComponent(this, FCCP, 'nodes'));

      this.addComponent('icon', new IconComponent(this, 3, (pos, scale) => {
        return {
          x: 0,
          y: scale.y + 0.25,
          z: 0
        };
      }));

      this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, FCCP, 'solid'));

    } else {
      this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));

      this.addComponent('icon', new IconComponent(this, 3, (pos, scale) => {
        return {
          x: scale.x / 2,
          y: scale.y + 0.25,
          z: -scale.z / 2
        };
      }));

      this.addComponent('screenPosition', new ScreenPositionComponent(this));

      this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, CCP, 'solid'));

      this.addComponent('highlighting_mesh', new HighlightingMeshComponent(this, CHCP));

      this.addComponent('tooltip', new TooltipComponent(this, NodeTooltip));

      this.addComponent('collision', new CollisionComponent(this,
                                                            PREDEFINED_COLLISION_OBJECTS.BOX,
                                                            OCTREE_LAYER.NODES));
    }


    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('health', new HealthComponent(this));

    this.addComponent('power', new PowerComponent(this));
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      this.eventEmitter.on('isVisibleChanged' + this.id).subscribe((isVisible) =>
        this.eventEmitter.emit('isVisibleForMetrics', isVisible)),

      this.eventEmitter.on('healthChanged').subscribe(health => {
        const severity = health.get('maxSeverity', 0);
        const color = severity > 0 ? theme.health[Math.floor(severity)] : '#ffffff';
        this.getComponent('color').setHex(color);
      })
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

    nodes.remove(this.id);
    this.group.removeNode(this.id);

    this._cachedLabel = null;
    this.group = null;
  }
}
