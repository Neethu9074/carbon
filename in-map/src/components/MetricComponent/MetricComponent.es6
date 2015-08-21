import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCCP from '../../SingleMeshFactory/ContentProvider/SlicedCubeContentProvider';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Component from '../Component';

export default class MetricComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject);

    const scene = sceneObject.scene;

    this.numSlices = 1;
    this.id = sceneObject.id + '_metricPillarTemp';
    this.factory = scene.singleMeshMetricFactory;

    this.contentProvider = new PCM({
      contentProvider: new SCCP({numSlices: this.numSlices})
    });

    this.fragment = {
      contentProvider: this.contentProvider,
      id: this.id,
      values: [0]
    };

    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.updateContentProvider();

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.factory.addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }


  setValues(values) {
    if(values.length !== this.numSlices) {
      this.numSlices = values.length;
      this.fragment.contentProvider.contentProvider = new SCCP({numSlices: this.numSlices});

      //TODO: this is extrem ugly and imperformant but I don't find another good way yet
      this.factory.removeFragment(this.id);
      this.factory.rebuild();
      this.factory.addFragment(this.fragment);
    }

    this.fragment.values = values;
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
      this.factory.addFragment(this.fragment);
    }
  }

  updateContentProvider() {
    const pcm = this.contentProvider;
    const pos = this.positionToSet;

    this.changeXyzOf(pcm.position, pos.x - 0.5, pos.y, pos.z + 0.5);
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);

    this.contentProvider = null;
    this.positionToSet = null;
    this.fragment = null;
    this.factory = null;
    this.id = null;
  }
}
