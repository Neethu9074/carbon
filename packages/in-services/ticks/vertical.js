import {
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytes,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  megaBytesZeroDecimalPlaces,
  megaBytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import getTickPositionsPercentage from 'in-services/ticks/percentage';
import getTickPositionsDefault from 'in-services/ticks/default';
import getTickPositionsNumber from 'in-services/ticks/number';
import getTickPositionsBytes from 'in-services/ticks/bytes';

const tickPositionStrategies = {};
tickPositionStrategies[percentageZeroDecimalPlaces] = getTickPositionsPercentage;
tickPositionStrategies[percentageTwoDecimalPlaces] = getTickPositionsPercentage;
tickPositionStrategies[megaBytesZeroDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[kiloBytesZeroDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[megaBytesTwoDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[kiloBytesTwoDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[bytesZeroDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[bytesTwoDecimalPlaces] = getTickPositionsBytes;
tickPositionStrategies[bytes] = getTickPositionsBytes;

export default function getTickPositions(scale, formatter) {
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
  let ticks = strategy({ scale, formatter });

  // remove close data points, skip first and last
  ticks = removeCloseTicks(ticks);

  if (ticks.length < 2) {
    return getTickPositionsDefault(scale);
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
