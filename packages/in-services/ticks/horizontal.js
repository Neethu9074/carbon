export default function getTickPositions(scale, { stepSize, expectLabelWidth = 70 }, mapToAbsoluteValues = false) {
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

  if (mapToAbsoluteValues) {
    const windowSize = scale.getDomainTo() - scale.getDomainFrom();
    return ticks.map(relativeTickPosition => scale.getDomainFrom() + relativeTickPosition * windowSize);
  }

  return ticks;
}
