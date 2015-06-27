'use strict';

import BaseRenderer from './BaseRenderer';

export default class StackedAreaRenderer extends BaseRenderer {

  constructor(opts) {
    super(opts);

    this.container.classList.add('in-chart--stacked-area');
  }

}
