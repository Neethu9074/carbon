import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';

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

export function getAxisTickPositions(scale, formatter) {
  const domainRange = scale.getDomainTo() - scale.getDomainFrom();
  if (!domainRange) {
    return [];
  }

  const defaultTicks = [
    {
      range: scale.getRangeFrom(),
      domain: scale.getDomainFrom()
    },
    {
      range: scale.getRangeTo(),
      domain: scale.getDomainTo()
    }
  ];

  // special case, the range is 1, happens on percentages, Calls and Instances frequently
  if (domainRange === 1) {
    // special case for percentage charts
    if (formatter === percentageZeroDecimalPlaces || formatter === percentageTwoDecimalPlaces) {
      const rangeFrom = scale.getRangeFrom();
      const rangeTo = scale.getRangeTo();
      const domainFrom = scale.getDomainFrom();
      const domainTo = scale.getDomainTo();
      const diffRange = rangeTo - rangeFrom;
      const diffDomain = domainTo - domainFrom;
      return [
        {
          range: rangeFrom,
          domain: domainFrom
        },
        {
          range: rangeFrom + diffRange * 0.2,
          domain: domainFrom + diffDomain * 0.2
        },
        {
          range: rangeFrom + diffRange * 0.4,
          domain: domainFrom + diffDomain * 0.4
        },
        {
          range: rangeFrom + diffRange * 0.6,
          domain: domainFrom + diffDomain * 0.6
        },
        {
          range: rangeFrom + diffRange * 0.8,
          domain: domainFrom + diffDomain * 0.8
        },
        {
          range: rangeTo,
          domain: domainTo
        }
      ];
    }
    return defaultTicks;
  }

  const desiredNumberOfTicks = 4;
  const ticks = [];

  const t = getTicks(scale.getDomainFrom(), scale.getDomainTo(), desiredNumberOfTicks);
  for (let i = 0, length = t.length; i < length; i++) {
    const tick = t[i];
    if (tick > domainRange) {
      continue;
    }
    ticks.push({
      range: scale.getRange(tick),
      domain: tick
    });
  }

  // remove close data points, skip first and last
  removeCloseIndices(ticks);

  if (ticks.length < 2) {
    return defaultTicks;
  }
  return ticks;
}

function removeCloseIndices(ticks) {
  for (let i = ticks.length - 1; i > 1; i--) {
    const tick = ticks[i];
    const nextTick = ticks[i - 1];
    if (Math.abs(tick.range - nextTick.range) < 10) {
      ticks.splice(i - 1, 1);
      return removeCloseIndices(ticks);
    }
  }
}

const bases = [1, 2, 5];
function getTicks(min, max, n) {
  // Swap min and max if necessary;
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  const interval = getNiceInterval(min, max, n);
  let value = getFirstTickValue(min, interval);

  let ticks = [value];
  while (value < max) {
    value += interval;
    ticks.push(value);
  }

  ticks = ticks.map(precision(interval));

  ticks[0] = min;
  ticks[ticks.length - 1] = max;

  return ticks;
}

// This eliminates floating point errors otherwise accumulated
// by repeatedly adding the computed interval.
function precision(interval) {
  const multiplier = Math.pow(10, Math.ceil(Math.log10(interval)) + 1);
  return function(value) {
    return Math.round(value * multiplier) / multiplier;
  };
}

function getNiceInterval(min, max, n) {
  const rawInterval = (max - min) / n;
  const rawExponent = Math.log10(rawInterval);

  // One of these two integer exponents, in conjunction with one of the bases,
  // will yield the nicest interval.
  const exponents = [Math.floor(rawExponent), Math.ceil(rawExponent)];

  let nicestInterval = Infinity;
  bases.forEach(base => {
    exponents.forEach(exponent => {
      // Try each combination of base and interval.
      const currentInterval = base * Math.pow(10, exponent);

      // Pick the combination that yields the nice interval that
      // most closely matches the raw interval.
      const currentDeviation = Math.abs(rawInterval - currentInterval);
      const nicestDeviation = Math.abs(rawInterval - nicestInterval);

      if (currentDeviation < nicestDeviation) {
        nicestInterval = currentInterval;
      }
    });
  });

  return nicestInterval;
}

function getFirstTickValue(min, interval) {
  return Math.floor(min / interval) * interval;
}
