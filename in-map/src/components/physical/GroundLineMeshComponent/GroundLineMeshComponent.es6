import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';

import LineMeshComponent from '../../common/LineMeshComponent';


export default class GroundLineMeshComponent extends LineMeshComponent {

  constructor(config) {
    super(config);

    this.addSubscription('healthChanged', this.healthChanged);
  }

  positionChanged(pos) {
    super.positionChanged({
      newPosition: {
        x: pos.newPosition.x - 0.5,
        y: pos.newPosition.y,
        z: pos.newPosition.z + 0.5
      }
    });
  }

  sizeChanged({x, y, z}) {
    super.sizeChanged({x: x * 1.5, y, z: z * 1.5});
  }

  healthChanged(maxSeverity) {
    const active = maxSeverity < 0.5 ? PROPERTY_VALUES.OFF : PROPERTY_VALUES.ON;
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, active);
  }
}
