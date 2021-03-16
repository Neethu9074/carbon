/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { fromJS } from 'immutable';
import { expect } from 'chai';

import { getFormattedValue } from 'in-sdk/metrics';
import './index';

describe('metrics', () => {
  describe('format value', () => {
    let snapshot;
    const osPlugin = 'host';

    beforeEach(() => {
      snapshot = fromJS({
        plugin: osPlugin,
        data: {
          'memory.total': 1024,
          'cpu.count': 4
        }
      });
    });

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', snapshot, 1024)).to.equal('0.00 B');
    });

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', snapshot, 512)).to.equal('512.00 B');
    });

    it('should format normalized to normalized', () => {
      expect(getFormattedValue('load', snapshot, 0.5)).to.equal(0.5);
    });

    it('should format normalized to normalized', () => {
      expect(getFormattedValue('load', snapshot, 2)).to.equal(2);
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('cpu.user', snapshot, 0.5)).to.equal('50%');
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('cpu.wait', snapshot, 0.25)).to.equal('25%');
    });

    it('should round normalized', () => {
      expect(getFormattedValue('load', snapshot, 0.04)).to.equal(0.04);
    });

    it('should round normalized', () => {
      expect(getFormattedValue('load', snapshot, 0.041)).to.equal(0.04);
    });

    it('should round normalized', () => {
      expect(getFormattedValue('load', snapshot, 0.040234542)).to.equal(0.04);
    });

    it('should round percentages', () => {
      expect(getFormattedValue('cpu.wait', snapshot, 0.04003123)).to.equal('4%');
    });

    it('should round percentages', () => {
      expect(getFormattedValue('cpu.wait', snapshot, 0.041)).to.equal('4.1%');
    });
  });
});
