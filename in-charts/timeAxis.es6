export function getTickPositions(scale, {stepSize, ceilToNearestStep}) {
  // special case: Trace with 0 time.
  if (scale.getDomainFrom() === scale.getDomainTo()) {
    return [{
      range: scale.getRangeFrom(),
      domain: scale.getDomainFrom()
    }];
  }

  const ticks = [];
  const width = scale.getRangeTo();
  const start = ceilToNearestStep(scale.getDomainFrom());

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
