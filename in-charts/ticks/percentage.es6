export default function getTickPositions(rangeFrom, rangeTo, domainFrom, domainTo, scale) {
  const step = 0.2; // 20% steps

  const ticks = [
    {
      range: rangeFrom,
      domain: domainFrom
    }
  ];

  for (let currentStep = domainFrom; currentStep < domainTo; currentStep += step) {
    ticks.push({
      range: scale.getRange(currentStep),
      domain: currentStep
    });
  }

  ticks.push({
    range: rangeTo,
    domain: domainTo
  });

  return ticks;
}
