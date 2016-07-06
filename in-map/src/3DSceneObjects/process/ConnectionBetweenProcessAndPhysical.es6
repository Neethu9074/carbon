import {combineLatest} from 'reactive-observables';

import Connection from 'in-map/src/3DSceneObjects/process/Connection';
import {hexToRGBNormalized} from 'in-services/formatters/color';

const NOT_FULLY_VISIBLE_COLOR = hexToRGBNormalized('#627379');

export default class ConnectionBetweenProcessAndPhysical extends Connection {

  constructor(params) {
    super(params);

    this.addSubscription(
      combineLatest([
        this.sourceNode.eventEmitter.on('isFullyVisible'),
        this.destinationNode.eventEmitter.on('isFullyVisible')
      ]).subscribe(([isSourceNodeExpanded, isDestinationNodeExpanded]) => {
        this.isFullyVisible = isSourceNodeExpanded && isDestinationNodeExpanded;
        this.eventEmitter.emit('updateGeometry');
      })
    );
  }

  init() {
    this.isFullyVisible = true;
    super.init();
  }

  getColorArrayFromRgb(r, g, b) {
    if (!this.isFullyVisible) {
      r = NOT_FULLY_VISIBLE_COLOR.r;
      g = NOT_FULLY_VISIBLE_COLOR.g;
      b = NOT_FULLY_VISIBLE_COLOR.b;
    }
    return [
      r, g, b,
      r, g, b
    ];
  }
}
