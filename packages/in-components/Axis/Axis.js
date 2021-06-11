/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';
import React from 'react';

import TickLabels from 'in-components/Axis/components/TickLabels';
import getTickPositions from 'in-services/ticks/vertical';
import Ticks from 'in-components/Axis/components/Ticks';
import { number } from 'in-services/formatters/number';
import { uniq } from 'in-services/arrayUtils';
import createScale from 'in-services/scale';

import locals from './Axis.mless';

export default function Axis({
  isVertical,
  scale,
  align,
  fixedTickPositions,
  roundTickPositions = false,
  height,
  width,
  tickLength = 8,
  formatter = number,
  detailedFormatting = false,
  tickColor,
  tickLabelColor,
  tickLabelBackgroundColor,
  tickPositions,
  renderTickLines = true,
  renderTickLabels = true,
  style
}) {
  if (__DEV__) {
    invariant(scale, 'You should define a scale or discreteTicks');
    if (scale) {
      invariant(scale.to != undefined, 'the scale needs a to, which represents to domainTo');
      invariant(scale.from != undefined, 'the scale needs a from, which represents from domainTo');
    }
  }

  if (!tickPositions) {
    if (fixedTickPositions) {
      tickPositions = mapNormalizedTicks(scale, fixedTickPositions, roundTickPositions, isVertical ? height : width);
    } else {
      tickPositions = calculateTickPositions(scale, formatter, height);
    }
  }

  const styleWithHeight = Object.assign({ minHeight: height, maxHeight: height }, style);
  return (
    <div style={styleWithHeight} className={locals.axis}>
      {renderTickLines && (
        <Ticks
          tickColor={tickColor}
          tickPositions={tickPositions}
          isVertical={isVertical}
          align={align}
          tickLength={tickLength}
        />
      )}
      {renderTickLabels && (
        <TickLabels
          tickPositions={tickPositions.slice(tickPositions.length - 1)}
          tickColor={tickLabelColor}
          backgroundColor={tickLabelBackgroundColor}
          detailedFormatting={detailedFormatting}
          isVertical={isVertical}
          formatter={formatter}
          align={align}
          tickLength={tickLength}
        />
      )}
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

// export for test
export function mapNormalizedTicks(scale, tickPositions, roundTickPositions, length) {
  const mappedTickPosition = tickPositions.map(tick => {
    const domain = scale.from + tick * (scale.to - scale.from);
    if (roundTickPositions) {
      const roundedDomain = Math.round(domain);
      const newTick = scale.to === 0 ? roundedDomain : roundedDomain / scale.to;
      return {
        range: newTick * length,
        domain: roundedDomain
      };
    }
    return {
      range: tick * length,
      domain: domain
    };
  });

  return uniq(mappedTickPosition, item => item.domain);
}
