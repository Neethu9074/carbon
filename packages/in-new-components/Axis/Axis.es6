import invariant from 'invariant';
import React from 'react';

import TickLabels from 'in-new-components/Axis/components/TickLabels';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getAxisTickPositions } from 'in-charts/ticks/timeAxis';
import Ticks from 'in-new-components/Axis/components/Ticks';
import { number } from 'in-services/formatters/number';
import createScale from 'in-charts/scale';

import locals from './Axis.mless';

export default function Axis({ isVertical, scale, align, fixedTickPositions, width, height, formatter = number }) {
  if (__DEV__) {
    invariant(scale, `You should define a scale or discreteTicks`);
    if (scale) {
      invariant(scale.to != undefined, `the scale needs a to, which represents to domainTo`);
      invariant(scale.from != undefined, `the scale needs a from, which represents from domainTo`);
    }
  }

  let tickPositions;
  if (fixedTickPositions) {
    tickPositions = mapNormalizedTicks(scale, fixedTickPositions, isVertical ? height : width);
  } else {
    tickPositions = isVertical
      ? calculateVerticalTickPositions(scale, formatter, height)
      : calculateHorizontalTickPositions(scale, width);
  }

  return (
    <div
      style={{ minWidth: width, minHeight: height, maxWidth: width, maxHeight: height }}
      className={evaluateClassNames({
        [locals.axis]: true,
        [locals.vertical]: isVertical,
        [locals.verticalLeft]: isVertical && align === 'left',
        [locals.verticalRight]: isVertical && align !== 'left',
        [locals.horizontal]: !isVertical,
        [locals.horizontalTop]: !isVertical && align === 'top',
        [locals.horizontalBottom]: !isVertical && align !== 'top'
      })}
    >
      <Ticks tickPositions={tickPositions} isVertical={isVertical} formatter={formatter} align={align} />
      <TickLabels tickPositions={tickPositions} isVertical={isVertical} formatter={formatter} align={align} />
    </div>
  );
}

function calculateVerticalTickPositions(_scale, formatter, height) {
  const scale = createScale();
  scale.setDomainFrom(_scale.from);
  scale.setDomainTo(_scale.to);
  scale.setRangeFrom(0);
  scale.setRangeTo(height);
  return getAxisTickPositions(scale, formatter.detailed);
}

function calculateHorizontalTickPositions(scale, widthInPx) {
  const expectLabelWidth = 40;
  const numSteps = Math.floor(widthInPx / expectLabelWidth);
  const ticks = [];

  for (let i = 0; i < numSteps; i++) {
    ticks.push(i / numSteps);
  }

  return mapNormalizedTicks(scale, ticks, widthInPx);
}

function mapNormalizedTicks(scale, tickPositions, length) {
  return tickPositions.map(tick => ({
    range: tick * length,
    domain: scale.from + tick * (scale.to - scale.from)
  }));
}
