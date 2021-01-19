/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import { roundMaxValueToNextHighestHumanFriendlyValue } from 'in-services/ticks/number';

describe('in-services/ticks/number', () => {
  describe('roundMaxValueToNextHighestHumanFriendlyValue', () => {
    // These tests are for comparing expectations to the algorithm to the actual behaviour
    it('should round to the next proper human readable value', () => {
      expect(roundMaxValueToNextHighestHumanFriendlyValue(0)).to.equal(0);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(1)).to.equal(1);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(2)).to.equal(2);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(3)).to.equal(4);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(4)).to.equal(4);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(5)).to.equal(6);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(6)).to.equal(6);

      expect(roundMaxValueToNextHighestHumanFriendlyValue(10)).to.equal(10);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(11)).to.equal(12);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(15)).to.equal(16);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(19)).to.equal(20);

      expect(roundMaxValueToNextHighestHumanFriendlyValue(193423)).to.equal(200000);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(195)).to.equal(200);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(129)).to.equal(140);
      expect(roundMaxValueToNextHighestHumanFriendlyValue(17347)).to.equal(18000);
    });
  });
});
