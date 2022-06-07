/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { CSSProperties } from 'react';
import { Property } from 'csstype';
import invariant from 'invariant';

import TickLabels from 'in-components/Axis/components/TickLabels';
import { FormatterObject } from 'in-components/Chart/types';
import getTickPositions from 'in-services/ticks/vertical';
import Ticks from 'in-components/Axis/components/Ticks';
import { number } from 'in-services/formatters/number';
import { Tick } from 'in-services/ticks/types';
import { uniq } from 'in-services/arrayUtils';
import createScale from 'in-services/scale';

import locals from './Axis.mless';

export type AxisAlign = 'top' | 'bottom' | 'right' | 'left';
export interface AxisScale {
  from: number;
  to: number;
}

interface AxisProps {
  scale: AxisScale;
  align: AxisAlign;

  // Height in pixel, required if isVertical = true
  height?: number;
  // Width in pixel, required if isVertical = false
  width?: number;

  fixedTickPositions?: number[];
  tickPositions?: Tick[];

  tickLength?: number;
  formatter?: FormatterObject;

  tickColor?: Property.Color;
  tickLabelColor?: Property.Color;
  tickLabelBackgroundColor?: Property.Color;

  isVertical?: boolean;
  roundTickPositions?: boolean;
  detailedFormatting?: boolean;
  renderTickLines?: boolean;
  renderTickLabels?: boolean;
  renderAllTickLabels?: boolean;

  style?: CSSProperties;
}

export type VerticalAxisProps = Omit<AxisProps, 'isVertical' | 'width' | 'height'> & {
  isVertical: true;
  height: number;
};

export type HorizontalAxisProps = Omit<AxisProps, 'isVertical' | 'width' | 'height'> & {
  isVertical?: false;
  width: number;
  height?: number;
};

export default function Axis(props: HorizontalAxisProps): JSX.Element;
export default function Axis(props: VerticalAxisProps): JSX.Element;
export default function Axis({
  isVertical = false,
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
  renderAllTickLabels = false,
  style
}: AxisProps) {
  if (__DEV__) {
    invariant(scale, 'You should define a scale or discreteTicks');
    if (scale) {
      invariant(scale.to != undefined, 'the scale needs a to, which represents to domainTo');
      invariant(scale.from != undefined, 'the scale needs a from, which represents from domainTo');
    }
  }

  if (!tickPositions) {
    if (fixedTickPositions) {
      tickPositions = mapNormalizedTicks(
        scale,
        fixedTickPositions,
        roundTickPositions,
        (isVertical ? height : width) as number
      );
    } else {
      tickPositions = calculateTickPositions(scale, formatter, height ?? 1);
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
          tickPositions={renderAllTickLabels ? tickPositions : tickPositions.slice(tickPositions.length - 1)}
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

function calculateTickPositions(_scale: AxisScale, formatter: FormatterObject, height: number): Tick[] {
  const scale = createScale();
  scale.setDomainFrom(_scale.from);
  scale.setDomainTo(_scale.to);
  scale.setRangeFrom(height);
  scale.setRangeTo(0);
  return getTickPositions({ scale, formatter: formatter.detailed });
}

// export for test
export function mapNormalizedTicks(
  scale: AxisScale,
  tickPositions: number[],
  roundTickPositions: boolean,
  length: number
): Tick[] {
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
