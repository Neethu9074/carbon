import RoEmitter from 'roemitter';

import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import {setCameraController} from 'in-map/stores/cameraController';
import {clearSelectedIncident} from 'in-stores/incident';
import {clearSelectedEvent} from 'in-stores/events';
import Subscriber from 'in-map/src/Subscriber';


export default class CameraController extends Subscriber {

  constructor() {
    super();

    this.interactionModules = [];
    this.eventEmitter = new RoEmitter('control event emitter');

    setCameraController(this);
  }

  onObjectClicked({hittenObject, hoveredConnections}) {
    if (hittenObject) {
      const parentSceneObject = hittenObject.parentSceneObject;
      const sceneObject = parentSceneObject ? parentSceneObject : hittenObject;
      setSelectedSnapshotId(sceneObject.id);
    // dont reset the click if you clicken on connections
    } else if (hoveredConnections.length === 0) {
      // the was something clicked but no object or connection available -> reset
      clearSelectedSnapshotId();
      clearSelectedIncident();
      clearSelectedEvent();
    } else {
      setSelectedSnapshotId(hoveredConnections[0].id);
    }
  }


  dispose() {
    this.interactionModules.forEach(module => module.dispose());
    this.interactionModules = [];

    this.eventEmitter.dispose();
    super.dispose();

    setCameraController(null);
  }
}
