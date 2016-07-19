import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';

import MeshComponent from 'in-map/src/components/common/MeshComponent';


export default class SolidMeshComponent extends MeshComponent {

  constructor(config) {
    super(config);
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }
}
