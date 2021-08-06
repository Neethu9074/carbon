/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTickPositionsDefault from 'in-services/ticks/default';
import { Tick, TickRequest } from 'in-services/ticks/types';
import { FormatterFn } from 'in-stores/metric/formatters';

export default function getTickPositions({ scale, formatter }: TickRequest): Tick[] {
  const domainFrom = scale.getDomainFrom();
  const domainTo = scale.getDomainTo();
  const domainRange = domainTo - domainFrom;

  // special case, the range is 1, happens on Calls and Instances frequently
  if (domainRange === 1) {
    return getTickPositionsDefault({ scale });
  }

  const desiredNumberOfTicks = 4;
  const ticks = [];

  const t = getTicks(domainFrom, domainTo, desiredNumberOfTicks, formatter);
  for (let i = 0, length = t.length; i < length; i++) {
    const tick = t[i];
    if (tick > domainTo) {
      continue;
    }
    ticks.push({
      range: scale.getRange(tick),
      domain: tick
    });
  }

  return ticks;
}

const bases = [1, 2, 5];
function getTicks(min: number, max: number, n: number, formatter?: FormatterFn) {
  // swap min and max if necessary
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  const interval = getNiceInterval(min, max, n, formatter);
  let value = getFirstTickValue(min, interval);

  let ticks = [value];
  while (value < max) {
    value += interval;
    ticks.push(value);
  }

  ticks = ticks.map(precision(interval));

  // add the min and max values
  ticks[0] = min;
  ticks[ticks.length - 1] = max;

  return ticks;
}

// this eliminates floating point errors otherwise accumulated by repeatedly adding the computed interval
export function precision(interval: number) {
  const multiplier = Math.pow(10, Math.ceil(Math.log10(interval)) + 1);
  return function(value: number) {
    return Math.round(value * multiplier) / multiplier;
  };
}

export function getNiceInterval(min: number, max: number, n: number, formatter?: FormatterFn) {
  const rawInterval = (max - min) / n;
  const rawExponent = Math.log10(rawInterval);

  // one of these two integer exponents, in conjunction with one of the bases, will yield the nicest interval
  const exponents = [Math.floor(rawExponent), Math.ceil(rawExponent)];

  let nicestInterval = Infinity;
  bases.forEach(base => {
    exponents.forEach(exponent => {
      // try each combination of base and interval
      const currentInterval = base * Math.pow(10, exponent);

      // pick the combination that yields the nice interval that most closely matches the raw interval
      const currentDeviation = Math.abs(rawInterval - currentInterval);
      const nicestDeviation = Math.abs(rawInterval - nicestInterval);

      if (currentDeviation < nicestDeviation) {
        nicestInterval = currentInterval;
      }
    });
  });

  if (formatter) {
    const supportsDecimalPlaces: boolean = formatter(0.3) !== formatter(0.4);
    if (!supportsDecimalPlaces) {
      nicestInterval = Math.max(1, nicestInterval);
    }
  }

  return nicestInterval;
}

export function getFirstTickValue(min: number, interval: number) {
  return Math.floor(min / interval) * interval;
}

export function roundMaxValueToNextHighestHumanFriendlyValue(value: number, ops = { roundToEvenValues: true }): number {
  if (value <= 0) {
    return value;
  }
  if (value <= 1) {
    return roundMaxValueToNextHighestHumanFriendlyValue(value * 1000, ops) / 1000;
  }
  if (value <= 10) {
    return value + (value % 2);
  }
  const maxAllowedValueChange = Math.pow(10, Math.floor(Math.log10(value))) / 10;
  const brokenValue = value / maxAllowedValueChange;
  const rest = brokenValue % 2;
  if (rest === 0) {
    return value;
  }
  const addition = rest >= 1 ? 2 : ops.roundToEvenValues ? 2 : 1;
  return Math.ceil((brokenValue + (addition - rest)) * maxAllowedValueChange);
}
