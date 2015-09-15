import THREE from 'three';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import SCCP from '../../SingleMeshFactory/ContentProvider/SlicedCubeContentProvider';
import {cubeGeometry, defaultGeometryMaterial} from '../../sceneObjects/geometries';
import CollisionComponent from '../../components/CollisionObjectComponent';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import TooltipMetric from '../../sceneObjects/Tooltips/Metric';
import {currentTooltip} from '../../mapStores';
import Component from '../Component';

const thicknessOfCubes = 0.9;

export default class MetricComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject);

    const scene = sceneObject.scene;

    this.id = sceneObject.id + '_metricPillar';
    this.scene = sceneObject.scene;
    this.tooltip = new TooltipMetric(sceneObject);
    this.factory = scene.singleMeshMetricFactory;
    this.numSlices = 1;
    this.positionToSet = {x: -1000, y: 0, z: 0};

    this.setupFragment();
    this.updateContentProvider();

    this.collisionComponent = new CollisionComponent({
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      sceneObject: this,
      layer: 3
    });
    this.collisionComponent.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.addToFactory();

    this.collisionComponent.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onInactiveEnter() {
    this.collisionComponent.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    this.removeFromFactory();
  }

  addCollisionObject(obj, layer) {
    this.sceneObject.addCollisionObject(obj, layer);
  }


  setupFragment() {
    this.contentProvider = new PCM({
      contentProvider: new SCM({
        x: thicknessOfCubes, y: 1, z: thicknessOfCubes,
        contentProvider: new SCCP({
          numSlices: this.numSlices
        })
      })
    });

    this.fragment = {
      id: this.id,
      contentProvider: this.contentProvider
    };
  }

  onHighlight() {
    currentTooltip.emit(this.tooltip);
  }

  setValues(values) {
    if(values.length !== this.numSlices) {
      this.numSlices = values.length;
      this.fragment
        .contentProvider // SCM
        .contentProvider // PCM
        .contentProvider = new SCCP({ numSlices: this.numSlices });
      this.addToFactory();
      this.factory.rebuild();
    }

    if (!this.factoryFragment) {
      return;
    }

    values = values.map(x => x * this.sceneObject.height);

    // set values to to factory fragment and refresh arrays
    this.factoryFragment.values = values;

    let heightOfBox = values.reduce((a, b) => a + b, 0);
    if(heightOfBox <= 0) {
      heightOfBox = 0.01;
    }

    this.collisionComponent.sizeChanged(
      thicknessOfCubes,
      heightOfBox,
      thicknessOfCubes);
  }

  positionChanged(x, y, z) {
    this.collisionComponent.positionChanged(x, y, z);

    this.changeXyzOf(this.positionToSet, x, y, z);
    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  update() {
    this.needsUpdate = false;
    this.updateContentProvider();

    if(this.isActive()) {
      this.addToFactory();
    }
  }

  addToFactory() {
    this.factoryFragment = this.factory.addFragment(this.fragment);
  }

  removeFromFactory() {
    this.factory.removeFragment(this.fragment.id);
  }

  updateContentProvider() {
    const pcm = this.contentProvider;
    const pos = this.positionToSet;

    this.changeXyzOf(pcm.position, pos.x - 0.5, pos.y, pos.z + 0.5);
  }

  dispose() {
    super.dispose();

    this.removeFromFactory();

    this.factoryFragment = null;
    this.contentProvider = null;
    this.positionToSet = null;
    this.fragment = null;
    this.factory = null;
    this.id = null;
  }
}
