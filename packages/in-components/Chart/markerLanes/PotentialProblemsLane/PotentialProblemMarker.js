import React from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { clearActiveTooltip } from 'in-services/stores/tooltip';

import locals from './PotentialProblemMarker.mless';

export default function PotentialProblemMarker({ eventData, xScale, onClick }) {
  const { duration } = eventData;
  const durationWidth = duration ? xScale?.getRangeArea(duration) + 8 : null;
  if (!durationWidth) return null;

  const clickHandler = !onClick
    ? undefined
    : () => {
        onClick(eventData);
        clearActiveTooltip();
      };

  return (
    <div
      className={locals.marker}
      style={{
        width: durationWidth
      }}
      onClick={clickHandler}
      {...toInteractiveElement({
        ariaLabel: 'Potential Problem,',
        onDefaultInteraction: clickHandler
      })}
    />
  );
}
