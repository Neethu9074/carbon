/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { uniqBy } from 'lodash';

import {
  megaBytesZeroDecimalPlaces,
  megaBytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  byteBase
} from 'in-services/formatters/number';
import {
  getFirstTickValue,
  getNiceInterval,
  precision,
  roundMaxValueToNextHighestHumanFriendlyValue as roundMaxValueToNextHighestHumanFriendlyValueNumber
} from 'in-services/ticks/number';
import getTickPositionsDefault from 'in-services/ticks/default';
import { Tick, TickRequest } from 'in-services/ticks/types';
import { FormatterFn } from 'in-stores/metric/formatters';

const differenceToBytes = new Map<FormatterFn, number>([
  [megaBytesZeroDecimalPlaces, byteBase * byteBase],
  [megaBytesTwoDecimalPlaces, byteBase * byteBase],
  [megaBytesZeroDecimalPlaces, byteBase * byteBase],
  [kiloBytesZeroDecimalPlaces, byteBase],
  [kiloBytesTwoDecimalPlaces, byteBase],
  [bytesZeroDecimalPlaces, 1],
  [bytesTwoDecimalPlaces, 1]
]);

export default function getTickPositions({ scale, formatter }: TickRequest): Tick[] {
  // convert to bytes before performing any logic

  const difference: number = formatter ? differenceToBytes.get(formatter) ?? 1 : 1;
  const domainFrom = scale.getDomainFrom() * difference;
  const domainTo = scale.getDomainTo() * difference;
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

    ticks.push({
      range: scale.getRange(tick),
      domain: tick
    });
  }

  return ticks;
}

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
  while (value + interval < max) {
    value += interval;
    ticks.push(value);
  }

  // increase byte size by conversionLevel so we don't lose "nice" numbers when performing label formatting
  ticks = ticks.map(niceBytes);

  ticks = ticks.map(precision(interval));

  // add the min and max values
  ticks[0] = min;
  ticks[ticks.length - 1] = max;

  ticks = filterTicks(ticks, formatter);

  // convert back to original unit size (KiB or MiB)
  const difference: number = formatter ? differenceToBytes.get(formatter) ?? 1 : 1;
  ticks = ticks.map(tick => tick / difference);

  return ticks;
}

const sizeDifferences = [1, 2.4, 4.86, 7.37, 9.95, 12.59, 15.29, 18.06, 20.89]; // size difference in % between bytes and bigger units of measure when converting with byte base of 1024 compared to byte base of 1000

function niceBytes(tick: number) {
  let conversionLevel = Math.min(Math.floor(Math.log(tick) / Math.log(byteBase)), sizeDifferences.length - 1);

  // rounds bytes to new values to get "nice" values when converted to bigger units of measure
  const roundedValue = tick + (tick / 100) * sizeDifferences[conversionLevel];

  // // special case when rounded value is 1000 and doesn't round up to the unit of higher measurment (eg. 1000MiB to 1GiB)
  const whenConverted = roundedValue / Math.pow(byteBase, conversionLevel);
  const differenceToByteBase = Math.abs(byteBase - whenConverted);

  if (differenceToByteBase < 100) {
    return roundedValue + differenceToByteBase * Math.pow(byteBase, conversionLevel);
  }

  return roundedValue;
}

// removes duplicate ticks when zero decimal formatter gets applied eg. [1000GiB, 1500GiB, 2000GiB] -> [1TiB, 1TiB, 2TiB], returns just byte sized of [1TiB, 2TiB].
function filterTicks(ticks: number[], formatter?: FormatterFn): number[] {
  const formattedTicks: TickInternal[] = ticks.map(tick => ({ value: tick, formattedValue: formatter?.(tick) }));
  if (formattedTicks.length < 2) {
    return formattedTicks.map(tick => tick.value);
  }

  const lastTick = formattedTicks.pop();

  // remove duplicate ticks with formatted applied
  const uniqueTicks = uniqBy(formattedTicks, 'formattedValue');
  const uniqueLastTick = uniqueTicks[uniqueTicks.length - 1];

  if (lastTick && uniqueLastTick && lastTick.formattedValue === uniqueLastTick.formattedValue) {
    const remaininingTicks = uniqueTicks.filter(tick => tick.formattedValue !== lastTick.formattedValue);
    return [...remaininingTicks, lastTick].map(tick => tick.value);
  }

  return uniqueTicks && lastTick ? [...uniqueTicks, lastTick].map(tick => tick.value) : [];
}

export function roundMaxValueToNextHighestHumanFriendlyValue(value: number) {
  const roundedNumberValue = roundMaxValueToNextHighestHumanFriendlyValueNumber(value, { roundToEvenValues: false });
  return roundedNumberValue * Math.pow(byteBase / 1000, getNumberOf1024Blocks(value));
}

// export for test
export function getNumberOf1024Blocks(value: number) {
  let newValue = value;
  let numBlocks = 0;
  while (newValue >= byteBase) {
    newValue /= byteBase;
    numBlocks++;
  }
  return numBlocks;
}

interface TickInternal {
  value: number;
  formattedValue: string | undefined | null;
}
