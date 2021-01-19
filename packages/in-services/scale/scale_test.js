/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-disable comma-style */
/* eslint-env mocha */

import { expect } from 'chai';

import createScale from './scale';

describe('scale', () => {
  let scale;

  beforeEach(() => {
    scale = createScale();
  });

  describe('getRange', () => {
    it('must translate domain to range value', () => {
      // Range:     0--------------------------100
      // Domain:   30--------------------------60
      scale.setRangeFrom(0);
      scale.setRangeTo(100);
      scale.setDomainFrom(30);
      scale.setDomainTo(60);

      expect(scale.getRange(30)).to.equal(0);
      expect(scale.getRange(45)).to.equal(50);
      expect(scale.getRange(60)).to.equal(100);
    });

    it('must work with inversed ranges', () => {
      // Range:   100---------------------------0
      // Domain:   30---------------------------60
      scale.setRangeFrom(100);
      scale.setRangeTo(0);
      scale.setDomainFrom(30);
      scale.setDomainTo(60);

      expect(scale.getRange(30)).to.equal(100);
      expect(scale.getRange(45)).to.equal(50);
      expect(scale.getRange(60)).to.equal(0);
    });

    it('must work with uneven values', () => {
      // Range:   120---------------------------20
      // Domain:   50---------------------------55
      scale.setRangeFrom(120);
      scale.setRangeTo(20);
      scale.setDomainFrom(50);
      scale.setDomainTo(55);

      expect(scale.getRange(50)).to.equal(120);
      expect(scale.getRange(52.5)).to.equal(70);
      expect(scale.getRange(55)).to.equal(20);
    });

    it('must calculate ranges outside the defined range', () => {
      // Range:     0--------------------------100
      // Domain:   30--------------------------60
      scale.setRangeFrom(0);
      scale.setRangeTo(100);
      scale.setDomainFrom(30);
      scale.setDomainTo(60);

      expect(scale.getRange(0)).to.equal(-100);
      expect(scale.getRange(90)).to.equal(200);

      // enable clamping
      scale.setClamp(true);
      expect(scale.getRange(0)).to.equal(0);
      expect(scale.getRange(90)).to.equal(100);
    });

    it('must not result in a division by zero', () => {
      // Range:     5--------------------------10
      // Domain:    0--------------------------10
      scale.setRangeFrom(5);
      scale.setRangeTo(10);
      scale.setDomainFrom(0);
      scale.setDomainTo(10);

      expect(scale.getRange(0)).to.equal(5);
    });

    it('must set range to 50% for 0 domain range', () => {
      // Range:      0--------------------------10
      // Domain:    51--------------------------51
      scale.setRangeFrom(0);
      scale.setRangeTo(10);
      scale.setDomainFrom(51);
      scale.setDomainTo(51);

      expect(scale.getRange(51)).to.equal(5);
    });

    it('must set range to 0% for 0 domain range and domain value 0', () => {
      // Range:      0--------------------------10
      // Domain:    51--------------------------51
      scale.setRangeFrom(0);
      scale.setRangeTo(10);
      scale.setDomainFrom(0);
      scale.setDomainTo(0);

      expect(scale.getRange(0)).to.equal(0);
    });
  });

  describe('getDomain', () => {
    it('must translate range to domain value', () => {
      // Range:     0--------------------------100
      // Domain:   30--------------------------60
      scale.setRangeFrom(0);
      scale.setRangeTo(100);
      scale.setDomainFrom(30);
      scale.setDomainTo(60);

      expect(scale.getDomain(0)).to.equal(30);
      expect(scale.getDomain(50)).to.equal(45);
      expect(scale.getDomain(100)).to.equal(60);
    });

    it('must work with inversed ranges', () => {
      // Range:   100---------------------------0
      // Domain:   30---------------------------60
      scale.setRangeFrom(100);
      scale.setRangeTo(0);
      scale.setDomainFrom(30);
      scale.setDomainTo(60);

      expect(scale.getDomain(100)).to.equal(30);
      expect(scale.getDomain(50)).to.equal(45);
      expect(scale.getDomain(0)).to.equal(60);
    });

    it('must work with uneven values', () => {
      // Range:   120---------------------------20
      // Domain:   50---------------------------55
      scale.setRangeFrom(120);
      scale.setRangeTo(20);
      scale.setDomainFrom(50);
      scale.setDomainTo(55);

      expect(scale.getDomain(120)).to.equal(50);
      expect(scale.getDomain(70)).to.equal(52.5);
      expect(scale.getDomain(20)).to.equal(55);
    });

    it('must calculate domains outside the defined domain', () => {
      // Range:     0--------------------------100
      // Domain:   30--------------------------60
      scale.setRangeFrom(0);
      scale.setRangeTo(100);
      scale.setDomainFrom(30);
      scale.setDomainTo(60);

      expect(scale.getDomain(-100)).to.equal(0);
      expect(scale.getDomain(200)).to.equal(90);
    });

    it('must not result in a division by zero', () => {
      // Range:     5--------------------------10
      // Domain:    0--------------------------10
      scale.setRangeFrom(5);
      scale.setRangeTo(10);
      scale.setDomainFrom(0);
      scale.setDomainTo(10);

      expect(scale.getDomain(5)).to.equal(0);
    });

    it('must translate one domain area to the other', () => {
      // Range:     0--------------------------100
      // Domain:    0--------------------------10
      scale.setRangeFrom(0);
      scale.setRangeTo(100);
      scale.setDomainFrom(0);
      scale.setDomainTo(10);

      expect(scale.getDomainArea(10)).to.equal(1);
      expect(scale.getDomainArea(20)).to.equal(2);
      expect(scale.getDomainArea(50)).to.equal(5);

      expect(scale.getRangeArea(1)).to.equal(10);
      expect(scale.getRangeArea(2)).to.equal(20);
      expect(scale.getRangeArea(5)).to.equal(50);
    });
  });
});
