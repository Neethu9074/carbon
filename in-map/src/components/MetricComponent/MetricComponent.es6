import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCCP from '../../SingleMeshFactory/ContentProvider/SlicedCubeContentProvider';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Component from '../Component';

let id = 0;

export default class MetricComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject);

    const scene = sceneObject.scene;

    this.uid = id++;

    this.numSlices = 1;
    this.id = sceneObject.id + '_metricPillarTemp';
    this.factory = scene.singleMeshMetricFactory;

    this.contentProvider = new PCM({
      contentProvider: new SCCP({numSlices: this.numSlices})
    });

    this.fragment = {
      id: this.id,
      contentProvider: this.contentProvider
    };

    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.updateContentProvider();

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.addToFactory();
  }

  onInactiveEnter() {
    this.removeFromFactory();
  }


  setValues(values) {
    if(values.length !== this.numSlices) {
      this.numSlices = values.length;
      this.fragment.contentProvider.contentProvider = new SCCP({ numSlices: this.numSlices });
      this.addToFactory();
    }

    values = values.map(x => x * this.sceneObject.height);

    // set values to to factory fragment and refresh arrays
    this.factoryFragment.values = values;
  }

  positionChanged(x, y, z) {
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
    this.factory.removeFragment(this.factoryFragment);
  }

  updateContentProvider() {
    const pcm = this.contentProvider;
    const pos = this.positionToSet;

    this.changeXyzOf(pcm.position, pos.x - 0.5, pos.y, pos.z + 0.5);
  }

  dispose() {
    super.dispose();

    this.removeFromFactory();

    this.contentProvider = null;
    this.positionToSet = null;
    this.fragment = null;
    this.factory = null;
    this.id = null;
  }
}
