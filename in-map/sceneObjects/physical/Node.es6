import {combineLatest} from 'reactive-observables';

import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import PowerComponent from 'in-map/sceneObjectComponents/PowerComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import createObjectCollectionStream from 'in-map/stores/ObjectColletionStream';
import createLayerLayouter from 'in-map/misc/physical/LayerLayouter';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {focusEntityId$} from 'in-map/stores/focusEntity';
import {collisionDetection} from 'in-map/misc/Physics';
import {eventBus} from 'in-map/services/eventBus';
import nodes from 'in-map/stores/physical/nodes';


export default class Node extends SceneObject {

  constructor(params) {
    super(params.id);

    this.group = params.group;
    this.layer = createObjectCollectionStream();
    this._cachedLabel = this.id;
  }

  init() {
    super.init();

    nodes.add(this.id, this);
    this.group.addNode(this.id, this);

    this.layerLayouter = createLayerLayouter(this);
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));

    this.addComponent('icon', new IconComponent(this, 3, (pos, scale) => {
      return {
        x: scale.x / 2,
        y: scale.y + 0.25,
        z: -scale.z / 2
      };
    }));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('highlighting', new HighlightingComponent(this, CHCP));

    this.addComponent('health', new HealthComponent(this));

    this.addComponent('power', new PowerComponent(this));

    this.addComponent('screenPosition', new ScreenPositionComponent(this, (pos) => pos));
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      combineLatest([
        eventBus.on('zoomLevelChanged'),
        this.eventEmitter.on('isVisibleChanged' + this.id)
      ]).subscribe(([zoomLevel, isVisible]) => {
        this.eventEmitter.emit('isVisibleForMetrics', zoomLevel < 300 && isVisible);
      }),

      focusEntityId$.subscribe(id => {
        if (this.id === id) {
          eventBus.emit('focusPosition', this.getComponent('transform').getPosition());
        }
      })
    ]);
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
