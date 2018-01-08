import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import getTickPositionsPercentage from 'in-charts/ticks/percentage';
import getTickPositionsDefault from 'in-charts/ticks/default';
import getTickPositionsNumber from 'in-charts/ticks/number';
import getTickPositionsBytes from 'in-charts/ticks/bytes';

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
tickPositionStrategies[bytesZeroDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[bytesTwoDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[kiloBytesZeroDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[kiloBytesTwoDecimalPlaces] = getTickPositionsBytes;

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
  const ticks = strategy(rangeFrom, rangeTo, domainFrom, domainTo, scale);

  // remove close data points, skip first and last
  removeCloseIndices(ticks);

  if (ticks.length < 2) {
    return getTickPositionsDefault(rangeFrom, rangeTo, domainFrom, domainTo);
  }

  return ticks;
}

function removeCloseIndices(ticks) {
  const minSpaceBetweenTicksInPx = 16;
  for (let i = ticks.length - 1; i > 1; i--) {
    const tick = ticks[i];
    const nextTick = ticks[i - 1];
    if (Math.abs(tick.range - nextTick.range) < minSpaceBetweenTicksInPx) {
      // remove that single element
      // stop iteration over mutated array and start the check again with the mutated array
      ticks.splice(i - 1, 1);
      return removeCloseIndices(ticks);
    }
  }
}
