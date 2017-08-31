export default function getTickPositions(rangeFrom, rangeTo, domainFrom, domainTo) {
  return [
    {
      range: rangeFrom,
      domain: domainFrom
    },
    {
      range: rangeTo,
      domain: domainTo
    }
  ];
}
