export default function createScale() {
  return new Scale();
}

/**
 * This is a small subset of the D3.js scales, optimized for this
 * specific use case. This scale is only a utility to convert between
 * ranges (mostly pixels) and domain values.
 */
class Scale {
  constructor() {
    this.rangeFrom = 0;
    this.rangeTo = 1;
    this.domainFrom = 0;
    this.domainTo = 1;
  }

  setRangeFrom(v) { this.rangeFrom = v; }
  getRangeFrom() { return this.rangeFrom; }

  setRangeTo(v) { this.rangeTo = v; }
  getRangeTo() { return this.rangeTo; }

  setDomainFrom(v) { this.domainFrom = v; }
  getDomainFrom() { return this.domainFrom; }

  setDomainTo(v) { this.domainTo = v; }
  getDomainTo() { return this.domainTo; }

  getRange(domainValue) {
    const domainRange = this.domainTo - this.domainFrom;
    if (domainRange === 0) {
      if (domainValue === 0) {
        return this.rangeFrom;
      }
      return (this.rangeTo - this.rangeFrom) / 2 + this.rangeFrom;
    }
    const percentageOfDomain = 1 / (this.domainTo - this.domainFrom) * (domainValue - this.domainFrom);
    return (percentageOfDomain * (this.rangeTo - this.rangeFrom)) + this.rangeFrom;
  }

  getDomain(rangeValue) {
    const percentageOfRange = 1 / (this.rangeTo - this.rangeFrom) * (rangeValue - this.rangeFrom);
    return (percentageOfRange * (this.domainTo - this.domainFrom)) + this.domainFrom;
  }
}
