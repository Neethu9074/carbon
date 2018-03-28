import React, { Fragment } from 'react';

import { formatTime, formatDateShort } from 'in-services/formatters/date';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import { getAxisConfig } from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';

export default function HorizontalTimeAxis(props) {
  const { width = 300, scale } = props;
  const formattingConfig = getAxisConfig(scale.to - scale.from);

  function format(timestamp) {
    return (
      <Fragment>
        <div>{formatTime(timestamp)}</div>
        <span>{formatDateShort(timestamp)}</span>
      </Fragment>
    );
  }

  return (
    <HorizontalAxis
      {...props}
      fixedTickPositions={getXTickPositions(formattingConfig, width, scale)}
      formatter={{
        compact: format,
        detailed: format
      }}
    />
  );
}

function getXTickPositions(formatting, width, scale) {
  const ticks = [];

  const x = createScale();
  x.setDomainFrom(scale.from);
  x.setDomainTo(scale.to);
  x.setRangeFrom(0);
  x.setRangeTo(width);

  let previousTickRange = Number.NEGATIVE_INFINITY;
  let lastTickDomain = scale.from;
  let lastTickRange = 0;

  while (lastTickRange <= width) {
    if (previousTickRange + formatting.expectLabelWidth < lastTickRange) {
      ticks.push(lastTickRange / width);
      previousTickRange = lastTickRange;
    }

    lastTickDomain += formatting.stepSize;
    lastTickRange = x.getRange(lastTickDomain);
  }

  return ticks;
}
