import React from 'react';

import Connections from 'in-map/components/tooltips/physical/Connections';
import { view$, types as views } from 'in-stores/view';
import { tooltip$ } from 'in-map/stores/tooltipStore';
import { canvas$ } from 'in-map/stores/indexStore';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    entities: tooltip$.distinct(),
    canvas: canvas$,
    view: view$
  },
  function TooltipHoster({ entities, view, canvas }) {
    if (!entities || !canvas) {
      return null;
    }

    // if it's a connection tooltip
    if (entities.length > 0) {
      if (view === views.physical) {
        return <Connections entity={entities} canvas={canvas} />;
      }
      // don't show connection tooltip on logical view
      return null;
    }

    let Tooltip = entities.getComponent('tooltip');
    if (!Tooltip) {
      return null;
    }
    Tooltip = Tooltip.getTooltipClass();

    return <Tooltip entity={entities} canvas={canvas} />;
  }
);
