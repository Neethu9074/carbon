/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeFormat } from 'in-components/Axis/timeFormatting';
import { ScaleType } from 'in-services/scale';

interface Arguments {
  scale: ScaleType;
  axisConfig: TimeFormat;
}

export function getTickPositions({ scale, axisConfig }: Arguments): number[] {
  const { stepSize, expectLabelWidth = 70 } = axisConfig;

  // special case: Trace with 0 time.
  if (scale.getDomainFrom() >= scale.getDomainTo()) {
    return [scale.getRangeFrom()];
  }

  const ticks: number[] = [];
  let lastTickDomain = scale.getDomainFrom();
  let previousTickRange = Number.NEGATIVE_INFINITY;
  let lastTickRange = 0;
  const width = Math.abs(scale.getRangeTo() - scale.getRangeFrom());

  while (lastTickRange <= width) {
    if (previousTickRange + expectLabelWidth < lastTickRange) {
      ticks.push(lastTickRange / width);
      previousTickRange = lastTickRange;
    }

    lastTickDomain += stepSize;
    lastTickRange = scale.getRange(lastTickDomain);
  }

  return ticks;
}

export function getTickPositionsAbsolute({ scale, axisConfig }: Arguments) {
  const ticks = getTickPositions({ scale, axisConfig });

  const windowSize = scale.getDomainTo() - scale.getDomainFrom();
  return ticks.map(relativeTickPosition => scale.getDomainFrom() + relativeTickPosition * windowSize);
}
