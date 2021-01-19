/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function getTickPositions(scale) {
  const rangeFrom = scale.getRangeFrom();
  const rangeTo = scale.getRangeTo();
  const domainFrom = scale.getDomainFrom();
  const domainTo = scale.getDomainTo();

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
