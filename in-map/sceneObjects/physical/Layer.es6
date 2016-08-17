import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import TooltipComponent from 'in-map/sceneObjectComponents/TooltipComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import LayerTooltip from 'in-map/components/tooltips/physical/Layer';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import {theme} from 'in-services/theme';


export default class Layer extends SceneObject {

  constructor(params) {
    super(params.id);

    this._cachedPlugin = 'unknown';
    this.node = params.node;
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'layer'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.LAYER));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('highlighting', new HighlightingComponent(this, CHCP));

    this.addComponent('health', new HealthComponent(this));

    this.addComponent('tooltip', new TooltipComponent(this, LayerTooltip));

    // only add them after the snapshot was calculated, because they are layouted by _cachedPlugin
    this.node.addLayer(this.id, this);
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      this.eventEmitter.on('healthChanged').subscribe(health => {
        const severity = health.get('maxSeverity', 0);
        const color = severity > 0 ? theme.health[Math.floor(severity)] : '#ffffff';
        this.getComponent('color').setHex(color);
      }),

      this.eventEmitter.on('snapshotChanged').subscribe(snapshot => {
        this._cachedPlugin = snapshot.get('plugin');

        // readd this layer to trigger a relayout
        this.node.addLayer(this.id, this);
      })
    ]);
  }

  dispose() {
    super.dispose();

    this.node.removeLayer(this.id);
    this.node = null;

    this.plugin = null;
  }
}
