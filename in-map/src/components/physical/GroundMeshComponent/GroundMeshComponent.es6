import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {health} from 'in-services/health';

import MeshComponent from '../../common/MeshComponent';


export default class GroundMeshComponent extends MeshComponent {

  constructor(config) {
    super(config);

    this.addSubscription('healthChanged', this.healthChanged);
  }

  sizeChanged({x, y, z}) {
    super.sizeChanged({x: x * 1.5, y, z: z * 1.5});
  }

  healthChanged(newHealth) {
    const active = newHealth === health.ok ? PROPERTY_VALUES.OFF : PROPERTY_VALUES.ON;
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, active);
  }
}
