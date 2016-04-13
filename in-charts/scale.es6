/**
 * This is a small subset of the D3.js scales, optimized for this
 * specific use case. This scale is only a utility to convert between
 * ranges (mostly pixels) and domain values.
 */
export default function createScale() {
  let rangeFrom = 0;
  let rangeTo = 1;
  let domainFrom = 0;
  let domainTo = 1;

  return {
    setRangeFrom(v) { rangeFrom = v; },
    getRangeFrom() { return rangeFrom; },

    setRangeTo(v) { rangeTo = v; },
    getRangeTo() { return rangeTo; },

    setDomainFrom(v) { domainFrom = v; },
    getDomainFrom() { return domainFrom; },

    setDomainTo(v) { domainTo = v; },
    getDomainTo() { return domainTo; },

    getRange,
    getDomain
  };

  function getRange(domainValue) {
    const percentageOfDomain = 1 / (domainTo - domainFrom) * (domainValue - domainFrom);
    return (percentageOfDomain * (rangeTo - rangeFrom)) + rangeFrom;
  }

  function getDomain(rangeValue) {
    const percentageOfRange = 1 / (rangeTo - rangeFrom) * (rangeValue - rangeFrom);
    return (percentageOfRange * (domainTo - domainFrom)) + domainFrom;
  }
}
