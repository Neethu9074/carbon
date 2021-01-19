/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    this.clamp = false;
  }

  setFromScale(scale) {
    this.rangeFrom = scale.getRangeFrom();
    this.rangeTo = scale.getRangeTo();
    this.domainFrom = scale.getDomainFrom();
    this.domainTo = scale.getDomainTo();
  }

  setRangeFrom(v) {
    this.rangeFrom = v;
  }
  getRangeFrom() {
    return this.rangeFrom;
  }

  setRangeTo(v) {
    this.rangeTo = v;
  }
  getRangeTo() {
    return this.rangeTo;
  }

  setDomainFrom(v) {
    this.domainFrom = v;
  }
  getDomainFrom() {
    return this.domainFrom;
  }

  setDomainTo(v) {
    this.domainTo = v;
  }
  getDomainTo() {
    return this.domainTo;
  }

  setClamp(v) {
    this.clamp = v;
  }
  getClamp() {
    return this.clamp;
  }

  shiftDomain(offset) {
    this.domainFrom += offset;
    this.domainTo += offset;
  }

  getRange(domainValue) {
    const domainRange = this.domainTo - this.domainFrom;
    if (domainRange === 0) {
      if (domainValue === 0) {
        return this.rangeFrom;
      }
      return (this.rangeTo - this.rangeFrom) / 2 + this.rangeFrom;
    }
    let percentageOfDomain = (1 / (this.domainTo - this.domainFrom)) * (domainValue - this.domainFrom);
    if (this.clamp) {
      percentageOfDomain = Math.max(0, percentageOfDomain);
      percentageOfDomain = Math.min(1, percentageOfDomain);
    }
    return percentageOfDomain * (this.rangeTo - this.rangeFrom) + this.rangeFrom;
  }

  getDomain(rangeValue) {
    const percentageOfRange = (1 / (this.rangeTo - this.rangeFrom)) * (rangeValue - this.rangeFrom);
    return percentageOfRange * (this.domainTo - this.domainFrom) + this.domainFrom;
  }

  getDomainArea(rangeArea) {
    return this.getDomain(this.getRangeTo()) - this.getDomain(this.getRangeTo() - rangeArea);
  }

  getRangeArea(domainArea) {
    return this.getRange(this.getDomainTo()) - this.getRange(this.getDomainTo() - domainArea);
  }
}
