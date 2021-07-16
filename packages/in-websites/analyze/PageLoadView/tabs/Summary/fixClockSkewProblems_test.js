/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import { fixClockSkewProblems } from 'in-websites/analyze/PageLoadView/tabs/Summary/fixClockSkewProblems';

describe('in-websites/analyze/PageLoadView/tabs/Summary/fixClockSkewProblems', () => {
  describe('fixClockSkewProblems', () => {
    it('must not require fixes when all beacons timestamps are the way they should be', () => {
      const beacons = [
        getBeacon('pageLoad', 10000, 5600),
        getBeacon('httpRequest', 12000, 4800),
        getBeacon('resource', 11000, 5600)
      ];
      const result = fixClockSkewProblems(beacons);
      expect(result.requiredFixes).to.equal(false);
      expect(result.beacons).to.equal(beacons);
    });

    it('must not require fixes when there is no page load as everything is the earliest beacon defines the order', () => {
      const beacons = [getBeacon('resource', 11000, 5600), getBeacon('httpRequest', 12000, 4800)];
      const result = fixClockSkewProblems(beacons);
      expect(result.requiredFixes).to.equal(false);
      expect(result.beacons).to.equal(beacons);
    });

    it('must fix the timestamps when the timestamps do not make sense', () => {
      const beacons = [
        getBeacon('httpRequest', 80000, 4000),
        getBeacon('pageLoad', 100000, 50000),
        getBeacon('resource', 110000, 50000)
      ];
      const result = fixClockSkewProblems(beacons);
      expect(result.requiredFixes).to.equal(true);
      expect(result.beacons).to.deep.equal([
        getBeacon('pageLoad', 50000, 0),
        getBeacon('resource', 60000, 0),
        getBeacon('httpRequest', 76000, 0)
      ]);
    });
  });
});

function getBeacon(type, timestamp, clockSkew) {
  return { type, timestamp, clockSkew };
}
