import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import {activeMetric$} from 'in-stores/metric';


const METRIC_MARGIN = 0.9;

export default class NodeMetric extends SceneObject {

  constructor(params) {
    super(params.id);

    this.parentNode = params.node;
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'metrics'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));
  }

  initEvents() {
    this.addSubscriptions([
      this.parentNode.eventEmitter.on('positionChanged').subscribe(position =>
        this.getComponent('transform').setPosition(position)),

      this.parentNode.eventEmitter.on('scaleChanged').subscribe(scale =>
        this.getComponent('transform').setScaleXYZ(scale.x * METRIC_MARGIN,
                                                   scale.y - 0.1,
                                                   scale.z * METRIC_MARGIN)),

      activeMetric$.subscribe(metric => {
        if (!metric) {
          return;
        }

        console.log(metric.toJS());
      })
    ]);
  }

  disposeMetricPillar() {

  }

  dispose() {
    super.dispose();

    this.disposeMetricPillar();
    this.parentNode = null;
  }
}
