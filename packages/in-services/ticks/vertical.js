import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import getTickPositionsPercentage from 'in-services/ticks/percentage';
import getTickPositionsDefault from 'in-services/ticks/default';
import getTickPositionsNumber from 'in-services/ticks/number';

const tickPositionStrategies = {};
tickPositionStrategies[percentageTwoDecimalPlaces] = getTickPositionsPercentage;
tickPositionStrategies[percentageZeroDecimalPlaces] = getTickPositionsPercentage;

export default function getTickPositions(scale, formatter) {
  const rangeFrom = scale.getRangeFrom();
  const rangeTo = scale.getRangeTo();
  const domainFrom = scale.getDomainFrom();
  const domainTo = scale.getDomainTo();

  const domainRange = domainTo - domainFrom;

  if (domainRange === 0) {
    return [
      {
        range: scale.getRangeFrom(),
        domain: scale.getDomainFrom()
      }
    ];
  }

  if (!domainRange) {
    return [];
  }

  const strategy = tickPositionStrategies[formatter] || getTickPositionsNumber;
  let ticks = strategy(rangeFrom, rangeTo, domainFrom, domainTo, scale, formatter);

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
