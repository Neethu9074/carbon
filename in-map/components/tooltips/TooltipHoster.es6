import React from 'react';

import Connections from 'in-map/components/tooltips/physical/Connections';
import {tooltip$} from 'in-map/stores/tooltipStore';
import {canvas$} from 'in-map/stores/indexStore';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  entities: tooltip$.distinct().throttle(50),
  canvas: canvas$
},
function TooltipHoster({entities, canvas}) {
  if (!entities || !canvas) {
    return null;
  }

  if (entities.length > 0) {
    return (
      <Connections entity={entities}
                   canvas={canvas} />
    );
  }

  let Tooltip = entities.getComponent('tooltip');
  if (!Tooltip) {
    return null;
  }
  Tooltip = Tooltip.getTooltipClass();

  return (
    <Tooltip entity={entities}
             canvas={canvas} />
  );
});
