import invariant from 'invariant';
import React from 'react';

import TickLabels from 'in-new-components/Axis/components/TickLabels';
import { evaluateClassNames } from 'in-services/util/classnames';
import Ticks from 'in-new-components/Axis/components/Ticks';
import getTickPositions from 'in-services/ticks/vertical';
import { number } from 'in-services/formatters/number';
import createScale from 'in-services/scale';

import locals from './Axis.mless';

export default function Axis({
  isVertical,
  scale,
  align,
  fixedTickPositions,
  width,
  height,
  tickLength = 8,
  formatter = number,
  detailedFormatting = false,
  tickColor,
  tickLabelColor,
  tickPositions,
  renderTickLines = true
}) {
  if (__DEV__) {
    invariant(scale, `You should define a scale or discreteTicks`);
    if (scale) {
      invariant(scale.to != undefined, `the scale needs a to, which represents to domainTo`);
      invariant(scale.from != undefined, `the scale needs a from, which represents from domainTo`);
    }
  }

  if (!tickPositions) {
    if (fixedTickPositions) {
      tickPositions = mapNormalizedTicks(scale, fixedTickPositions, isVertical ? height : width);
    } else {
      tickPositions = calculateTickPositions(scale, formatter, height);
    }
  }

  return (
    <div
      style={{ minWidth: width, minHeight: height, maxWidth: width, maxHeight: height }}
      className={evaluateClassNames({
        [locals.axis]: true,
        [locals.verticalLeft]: isVertical && align === 'left',
        [locals.verticalRight]: isVertical && align !== 'left',
        [locals.horizontalTop]: !isVertical && align === 'top',
        [locals.horizontalBottom]: !isVertical && align !== 'top'
      })}
    >
      {renderTickLines && (
        <Ticks
          tickColor={tickColor}
          tickPositions={tickPositions}
          isVertical={isVertical}
          align={align}
          tickLength={tickLength}
        />
      )}
      <TickLabels
        tickPositions={tickPositions}
        tickColor={tickLabelColor}
        detailedFormatting={detailedFormatting}
        isVertical={isVertical}
        formatter={formatter}
        align={align}
        tickLength={tickLength}
      />
    </div>
  );
}

function calculateTickPositions(_scale, formatter, height) {
  const scale = createScale();
  scale.setDomainFrom(_scale.from);
  scale.setDomainTo(_scale.to);
  scale.setRangeFrom(height);
  scale.setRangeTo(0);
  return getTickPositions(scale, formatter.detailed);
}

function mapNormalizedTicks(scale, tickPositions, length) {
  return tickPositions.map(tick => ({
    range: tick * length,
    domain: scale.from + tick * (scale.to - scale.from)
  }));
}
