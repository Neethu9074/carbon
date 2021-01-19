/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import fragmentShader from 'in-map/singleMeshFactories/nodeMetricFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/nodeMetricVertexShader.glsl';

import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import TooltipComponent from 'in-map/sceneObjectComponents/TooltipComponent';
import { Mesh, RawShaderMaterial, DoubleSide } from 'in-map/3DLibProvider';

import {
  NUM_POINTS_PER_SLICE,
  getSlicedGeometry,
  INDEX_MASK
} from 'in-map/singleMeshFactories/ContentProvider/PredefinedSlicedCubes';
import { OCTREE_LAYER, PREDEFINED_COLLISION_OBJECTS } from 'in-map/misc/serviceLocator/physics/physicsConstants';
import NodeMetricTooltip from 'in-map/components/tooltips/physical/NodeMetric';
import { addSceneObject, removeSceneObject } from 'in-map/stores/sceneStore';
import createMetricHandler from 'in-map/misc/physical/MetricHandler';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import AnimationController from 'in-map/misc/AnimationController';
import { requestRendering } from 'in-map/stores/renderingStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';

const METRIC_MARGIN = 0.9;

export default class NodeMetric extends SceneObject {
  constructor(params) {
    super(params);

    this.dashboardId = params.dashboardId;
    this.parentNode = params.node;
    this.numSlices = 1;

    this.getGeometry = getSlicedGeometry;
    this.numPointsPerSlice = NUM_POINTS_PER_SLICE;
    this.indexMask = INDEX_MASK;
  }

  init() {
    super.init();

    const sceneObject = (this.sceneObject = new Mesh(
      this.getGeometry(1),
      new RawShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        side: DoubleSide,
        uniforms: {
          progress: {
            type: 'f',
            value: 0.0
          }
        }
      })
    ));
    addSceneObject(sceneObject);

    this.animationController = new AnimationController({
      onUpdate: this.onAnimationUpdate.bind(this),
      onStop: this.onAnimationStop.bind(this),
      timeToAnimate: 500
    });
  }

  initComponents() {
    super.initComponents();

    this.addComponent(
      'collision',
      new CollisionComponent(this, PREDEFINED_COLLISION_OBJECTS.BOX, OCTREE_LAYER.LAYER, this.dashboardId)
    );

    this.addComponent('screenPosition', new ScreenPositionComponent(this));

    this.addComponent('tooltip', new TooltipComponent(this, NodeMetricTooltip));
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      this.parentNode.eventEmitter.on('transformationChanged').subscribe(transform => {
        const position = transform.position;
        const scale = transform.scale;

        this.getComponent('transform').setTransformXYZ(
          position.x,
          position.y,
          position.z,
          scale.x * METRIC_MARGIN,
          scale.y,
          scale.z * METRIC_MARGIN
        );

        this.sceneObject.position.copy(position);
        this.sceneObject.scale.set(scale.x * METRIC_MARGIN, scale.y, scale.z * METRIC_MARGIN);
      }),

      this.parentNode.eventEmitter.on('snapshotChanged').subscribe(snapshot => {
        this.eventEmitter.emit('snapshotChanged', snapshot);
      })
    ]);

    this.metricHandler = createMetricHandler(this, this.parentNode.id);
  }

  setMetricValues(values) {
    this.animationController.stop();

    if (this.numSlices !== values.length) {
      this.numSlices = values.length;

      this.sceneObject.geometry.dispose();
      this.sceneObject.geometry = this.getGeometry(this.numSlices);
    }

    const newHeights = [];
    let currentValue = 0;
    const stackedValues = [0];
    for (let i = 0; i < values.length; i++) {
      currentValue += values[i];
      stackedValues.push(currentValue);
    }

    let currentIndex = 0;
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < this.numPointsPerSlice; j++) {
        newHeights[currentIndex] = stackedValues[this.indexMask[currentIndex]];
        currentIndex++;
      }
    }

    updateAttribute(this.sceneObject.geometry, 'oldHeight', this.sceneObject.geometry.attributes.newHeight.array, 1);
    updateAttribute(this.sceneObject.geometry, 'newHeight', newHeights, 1);

    this.animationController.start();
  }

  onAnimationUpdate(progress) {
    this.sceneObject.material.uniforms.progress.value = progress;

    requestRendering();
  }

  onAnimationStop() {}

  dispose() {
    super.dispose();

    this.animationController.dispose();
    this.metricHandler.dispose();

    removeSceneObject(this.sceneObject);
    this.sceneObject.geometry.dispose();
    this.sceneObject.material.dispose();
    this.sceneObject = null;

    this.parentNode = null;
    this.numSlices = null;
  }
}
