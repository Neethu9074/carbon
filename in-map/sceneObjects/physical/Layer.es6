import HighlightingMeshComponent from 'in-map/sceneObjectComponents/HighlightingMeshComponent';
import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import FCCP from 'in-map/singleMeshFactories/ContentProvider/FullCubeContentProvider';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import TooltipComponent from 'in-map/sceneObjectComponents/TooltipComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {OCTREE_LAYER, PREDEFINED_COLLISION_OBJECTS} from 'in-map/misc/serviceLocator/physics/physicsConstants';
import LayerTooltip from 'in-map/components/tooltips/physical/Layer';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import {theme} from 'in-services/theme';


export default class Layer extends SceneObject {

  constructor(params) {
    super(params);

    this._cachedPlugin = 'unknown';
    this.node = params.node;
  }

  initComponents() {
    super.initComponents();

    if (isWebVRActive) {
      this.addComponent('mesh', new MeshComponent(this, FCCP, 'layer'));

    } else {
      this.addComponent('mesh', new MeshComponent(this, CCP, 'layer'));

      this.addComponent('highlighting_mesh_solid', new HighlightingMeshComponent(this, CCP, 'solid_layer'));

      this.addComponent('tooltip', new TooltipComponent(this, LayerTooltip));

      this.addComponent('highlighting_mesh', new HighlightingMeshComponent(this, CHCP));


      this.addComponent('collision', new CollisionComponent(this,
                                                            PREDEFINED_COLLISION_OBJECTS.BOX,
                                                            OCTREE_LAYER.LAYER));
    }

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('health', new HealthComponent(this));

    // only add them after the snapshot was calculated, because they are layouted by _cachedPlugin
    this.node.addLayer(this.id, this);
  }

  initEvents() {
    super.initEvents();

    const healthChangedCallback = this.healthChanged.bind(this);
    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    this.addSubscriptions([
      this.eventEmitter.on('healthChanged').subscribe(healthChangedCallback),
      this.eventEmitter.on('snapshotChanged').subscribe(snapshotChangedCallback)
    ]);
  }

  healthChanged(health) {
    const severity = health.get('maxSeverity', 0);
    const color = severity > 0 ? theme.health[Math.floor(severity)] : '#dfdfdf';
    this.getComponent('color').setHex(color);
  }

  snapshotChanged(snapshot) {
    this._cachedPlugin = snapshot.get('plugin');

    // readd this layer to trigger a relayout
    this.node.addLayer(this.id, this);
  }

  dispose() {
    super.dispose();

    this.node.removeLayer(this.id);
    this.node = null;

    this.plugin = null;
  }
}
