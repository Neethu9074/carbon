import getTickPositionsNumber from 'in-charts/ticks/number';

export default function getTickPositions(rangeFrom, rangeTo, domainFrom, domainTo, scale) {
  const ticks = getTickPositionsNumber(rangeFrom, rangeTo, domainFrom, domainTo, scale);

  for (let i = 1, length = ticks.length - 1; i < length; i++) {
    const tick = ticks[i];
    let value = tick.domain;

    let temp = tick.domain;
    let x = 0;
    while (temp > 1024) {
      temp /= 1024;
      x++;
    }

    for (let i2 = 0; i2 < x; i2++) {
      value *= 1024 / 1000;
    }
    tick.domain = value;
  }

  return ticks;
}
