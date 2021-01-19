/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getTickPositionsPercentage, {
  roundMaxValueToNextHighestHumanFriendlyValue as roundMaxValueToNextHighestHumanFriendlyValuePercentage
} from 'in-services/ticks/percentage';
import getTickPositionsNumber, {
  roundMaxValueToNextHighestHumanFriendlyValue as roundMaxValueToNextHighestHumanFriendlyValueNumber
} from 'in-services/ticks/number';
import getTickPositionsBytes, {
  roundMaxValueToNextHighestHumanFriendlyValue as roundMaxValueToNextHighestHumanFriendlyBytes
} from 'in-services/ticks/bytes';
import { percentage, bytes, kiloBytes, megaBytes } from 'in-services/formatters/number';
import getTickPositionsDefault from 'in-services/ticks/default';

const tickPositionStrategies = {
  default: {
    getTickPositions: getTickPositionsNumber,
    roundMaxValueToNextHighestHumanFriendlyValue: roundMaxValueToNextHighestHumanFriendlyValueNumber
  }
};

tickPositionStrategies[percentage] = tickPositionStrategies[percentage.compact] = tickPositionStrategies[
  percentage.detailed
] = {
  getTickPositions: getTickPositionsPercentage,
  roundMaxValueToNextHighestHumanFriendlyValue: roundMaxValueToNextHighestHumanFriendlyValuePercentage
};

tickPositionStrategies[kiloBytes] = tickPositionStrategies[kiloBytes.compact] = tickPositionStrategies[
  kiloBytes.detailed
] = tickPositionStrategies[megaBytes] = tickPositionStrategies[megaBytes.compact] = tickPositionStrategies[
  megaBytes.detailed
] = tickPositionStrategies[bytes.compact] = tickPositionStrategies[bytes.detailed] = tickPositionStrategies[bytes] = {
  getTickPositions: getTickPositionsBytes,
  roundMaxValueToNextHighestHumanFriendlyValue: roundMaxValueToNextHighestHumanFriendlyBytes
};

export function getTickStrategyByFormatter(formatter) {
  return tickPositionStrategies[formatter] || tickPositionStrategies.default;
}

export default function getTickPositions(scale, formatter, numIntermediateSteps) {
  const domainRange = scale.getDomainTo() - scale.getDomainFrom();
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

  if (numIntermediateSteps) {
    return getEquallyDeferredTicks(scale, numIntermediateSteps);
  }

  const strategy = getTickStrategyByFormatter(formatter);
  let ticks = strategy.getTickPositions({ scale, formatter });

  // remove close data points, skip first and last
  ticks = removeCloseTicks(ticks);

  if (ticks.length < 2) {
    return getTickPositionsDefault(scale);
  }

  return ticks;
}

function getEquallyDeferredTicks(scale, numIntermediateSteps) {
  const rangeFrom = scale.getRangeFrom();
  const rangeTo = scale.getRangeTo();
  const domainFrom = scale.getDomainFrom();
  const domainTo = scale.getDomainTo();

  const ticks = [];
  for (let i = 0; i < numIntermediateSteps + 2; i++) {
    ticks[i] = {
      range: rangeFrom + (rangeTo - rangeFrom) * (i / (numIntermediateSteps + 1)),
      domain: domainFrom + (domainTo - domainFrom) * (i / (numIntermediateSteps + 1))
    };
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
