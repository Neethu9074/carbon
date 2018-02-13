import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import getTickPositionsPercentage from 'in-charts/ticks/percentage';
import getTickPositionsDefault from 'in-charts/ticks/default';
import getTickPositionsNumber from 'in-charts/ticks/number';

export function getTickPositions(scale, { stepSize, ceilToNearestStep }, leftAligned = false) {
  // special case: Trace with 0 time.
  if (scale.getDomainFrom() >= scale.getDomainTo()) {
    return [
      {
        range: scale.getRangeFrom(),
        domain: scale.getDomainFrom()
      }
    ];
  }

  const ticks = [];
  const width = Math.abs(scale.getRangeTo() - scale.getRangeFrom());
  const start = leftAligned ? scale.getDomainFrom() : ceilToNearestStep(scale.getDomainFrom());

  let lastTickDomain = 0;
  let lastTickRange = scale.getRange(lastTickDomain + start);

  while (lastTickRange <= width) {
    ticks.push({
      range: lastTickRange,
      domain: lastTickDomain + start
    });

    lastTickDomain += stepSize;
    lastTickRange = scale.getRange(lastTickDomain + start);
  }

  return ticks;
}

const tickPositionStrategies = {};
tickPositionStrategies[percentageTwoDecimalPlaces] = getTickPositionsPercentage;
tickPositionStrategies[percentageZeroDecimalPlaces] = getTickPositionsPercentage;

export function getAxisTickPositions(scale, formatter) {
  const rangeFrom = scale.getRangeFrom();
  const rangeTo = scale.getRangeTo();
  const domainFrom = scale.getDomainFrom();
  const domainTo = scale.getDomainTo();

  const domainRange = domainTo - domainFrom;
  if (!domainRange) {
    return [];
  }

  const strategy = tickPositionStrategies[formatter] || getTickPositionsNumber;
  let ticks = strategy(rangeFrom, rangeTo, domainFrom, domainTo, scale);

  // remove close data points, skip first and last
  ticks = removeCloseTicks(ticks);

  if (ticks.length < 2) {
    return getTickPositionsDefault(rangeFrom, rangeTo, domainFrom, domainTo);
  }

  return ticks;
}

function removeCloseTicks(ticks) {
  if (ticks.length < 2) {
    return ticks;
  }

  const filteredTicks = [];
  const minSpaceBetweenTicksInPx = 16;
  let previousRange = Number.MAX_VALUE;
  for (let i = 0; i < ticks.length - 1; i++) {
    const tick = ticks[i];
    if (Math.abs(previousRange - tick.range) > minSpaceBetweenTicksInPx) {
      filteredTicks.push(tick);
      previousRange = tick.range;
    }
  }

  if (filteredTicks.length === 0) {
    return filteredTicks;
  }

  const lastTick = ticks[ticks.length - 1];
  if (Math.abs(lastTick.range - filteredTicks[filteredTicks.length - 1].range) < minSpaceBetweenTicksInPx) {
    filteredTicks[filteredTicks.length - 1] = lastTick;
  } else {
    filteredTicks.push(lastTick);
  }

  return filteredTicks;
}
