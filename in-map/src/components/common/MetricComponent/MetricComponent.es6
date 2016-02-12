import THREE from 'three';

import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/mapSceneObjects/common/geometries';
import SCCP from 'in-map/src/SingleMeshFactory/ContentProvider/SlicedCubeContentProvider';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import TooltipMetric from 'in-map/src/Tooltips/Metric';
import {currentTooltip} from 'in-map/src/stores';

import CollisionComponent from '../CollisionObjectComponent';
import Component from '../Component';
import XYZ from '../XYZ';

const thicknessOfCubes = 0.9;

export default class MetricComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_metric_pillar');

    const scene = sceneObject.scene;

    this.scene = sceneObject.scene;
    this.tooltip = new TooltipMetric(sceneObject);
    this.factory = scene.singleMeshMetricFactory;
    this.numSlices = 1;
    this.positionToSet = new XYZ(-1000, 0, 0);

    this.setupFragment();
    this.updateContentProvider();

    this.collisionComponent = new CollisionComponent({
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      sceneObject: this,
      layer: 3
    });
    this.collisionComponent.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    this.highlightingSubscription = highlightedSnapshot.highlightedEntityId.subscribe(highlightedId => {
      const isThisHighlighted = highlightedId === this.id ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, isThisHighlighted);
    });

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.addToFactory();
    this.collisionComponent.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onHighlightEnter() {
    currentTooltip.emit(this.tooltip);
  }

  onInactiveEnter() {
    this.collisionComponent.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
    this.removeFromFactory();
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

  setValues(values) {
    if (values.length !== this.numSlices) {
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
    if (heightOfBox <= 0) {
      heightOfBox = 0.01;
    }

    this.collisionComponent.sizeChanged(
      thicknessOfCubes,
      heightOfBox,
      thicknessOfCubes);
  }

  positionChanged(x, y, z) {
    this.collisionComponent.positionChanged(x, y, z);

    this.positionToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  update() {
    this.needsUpdate = false;
    this.updateContentProvider();

    if (this.isActive()) {
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

    this.changeXYZOf(pcm.position, pos.x - 0.5, pos.y, pos.z + 0.5);
  }

  dispose() {
    super.dispose();

    this.removeFromFactory();

    this.positionToSet.dispose();
    this.highlightingSubscription.dispose();

    this.highlightingSubscription = null;
    this.factoryFragment = null;
    this.contentProvider = null;
    this.positionToSet = null;
    this.fragment = null;
    this.factory = null;
    this.id = null;
  }
}
