/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export interface ScaleType {
  rangeFrom: number;
  rangeTo: number;
  domainFrom: number;
  domainTo: number;
  clamp: boolean;

  setRangeFrom: (v: number) => void;
  getRangeFrom: () => number;
  setRangeTo: (v: number) => void;
  getRangeTo: () => number;

  setDomainFrom: (v: number) => void;
  getDomainFrom: () => number;
  setDomainTo: (v: number) => void;
  getDomainTo: () => number;

  setClamp: (v: boolean) => void;
  getClamp: () => boolean;

  getRange(domainValue: number): number;
  getDomain(rangeValue: number): number;

  getDomainArea(rangeArea: number): number;
  getRangeArea(domainArea: number | undefined): number;
  shiftDomain(offset: number): void;
}

export default function createScale() {
  return new Scale();
}

/**
 * This is a small subset of the D3.js scales, optimized for this
 * specific use case. This scale is only a utility to convert between
 * ranges (mostly pixels) and domain values.
 */
class Scale implements ScaleType {
  rangeFrom: number = 0;
  rangeTo: number = 1;
  domainFrom: number = 0;
  domainTo: number = 1;
  clamp: boolean = false;

  setFromScale(scale: ScaleType) {
    this.rangeFrom = scale.getRangeFrom();
    this.rangeTo = scale.getRangeTo();
    this.domainFrom = scale.getDomainFrom();
    this.domainTo = scale.getDomainTo();
  }

  setRangeFrom(v: number) {
    this.rangeFrom = v;
  }
  getRangeFrom() {
    return this.rangeFrom;
  }

  setRangeTo(v: number) {
    this.rangeTo = v;
  }
  getRangeTo() {
    return this.rangeTo;
  }

  setDomainFrom(v: number) {
    this.domainFrom = v;
  }
  getDomainFrom() {
    return this.domainFrom;
  }

  setDomainTo(v: number) {
    this.domainTo = v;
  }
  getDomainTo() {
    return this.domainTo;
  }

  setClamp(v: boolean) {
    this.clamp = v;
  }
  getClamp() {
    return this.clamp;
  }

  shiftDomain(offset: number) {
    this.domainFrom += offset;
    this.domainTo += offset;
  }

  getRange(domainValue: number) {
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

  getDomain(rangeValue: number) {
    const percentageOfRange = (1 / (this.rangeTo - this.rangeFrom)) * (rangeValue - this.rangeFrom);
    return percentageOfRange * (this.domainTo - this.domainFrom) + this.domainFrom;
  }

  getDomainArea(rangeArea: number) {
    return this.getDomain(this.getRangeTo()) - this.getDomain(this.getRangeTo() - rangeArea);
  }

  getRangeArea(domainArea: number = 0) {
    return this.getRange(this.getDomainTo()) - this.getRange(this.getDomainTo() - domainArea);
  }
}
