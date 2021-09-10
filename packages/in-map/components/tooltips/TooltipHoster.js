/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { view$ } from 'in-infrastructure/perspectives';
import { tooltip$ } from 'in-map/stores/tooltipStore';
import { canvas$ } from 'in-map/stores/indexStore';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    entity: tooltip$.distinct(),
    canvas: canvas$,
    view: view$
  },
  function TooltipHoster({ entity, canvas }) {
    if (!entity || !canvas) {
      return null;
    }

    let Tooltip = entity.getComponent('tooltip');
    if (!Tooltip) {
      return null;
    }
    Tooltip = Tooltip.getTooltipClass();

    return <Tooltip entity={entity} canvas={canvas} />;
  }
);
