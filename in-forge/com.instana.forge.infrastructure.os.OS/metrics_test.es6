/*eslint-env mocha*/
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';

import './index';
import {
  getNormalizedValue,
  getFormattedValue
  } from 'in-sdk/metrics';

describe('metrics', () => {

  describe('normalized value', () => {
    const osPlugin = 'com.instana.forge.infrastructure.os.OS';

    describe(osPlugin, () => {
      let snapshot;

      beforeEach(() => {
        snapshot = Immutable.fromJS({
          pluginId: osPlugin,
          data: {
            'memory.total': 1000,
            'cpu.count': 4
          }
        });
      });

      it('should calculate (m - v) / m for memory free', () => {
        expect(getNormalizedValue('memory.free', snapshot, 1)).to.equal(
          (1000 - 1) / 1000);
      });

      it('should calculate v / m for load', () => {
        expect(getNormalizedValue('load', snapshot, 2)).to.equal(2 / 4);
      });

      it('should calculate v for cpu', () => {
        expect(getNormalizedValue('cpu.total.user', snapshot, 2))
          .to.equal(2);
      });
    });

  });

  describe('format value', () => {
    let snapshot;
    const osPlugin = 'com.instana.forge.infrastructure.os.OS';

    beforeEach(() => {
      snapshot = Immutable.fromJS({
        pluginId: osPlugin,
        data: {
          'memory.total': 1024,
          'cpu.count': 4
        }
      });
    });

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', snapshot, 1024)).to.equal('0 B');
    });

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', snapshot, 512))
      .to.equal('512 B');
    });

    it('should format normalized to normalized', () => {
      expect(getFormattedValue('load', snapshot, 0.5)).to.equal(0.5);
    });

    it('should format normalized to normalized', () => {
      expect(getFormattedValue('load', snapshot, 2)).to.equal(2);
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('cpu.total.user', snapshot, 0.5))
      .to.equal('50%');
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('cpu.total.wait', snapshot, 0.25))
      .to.equal('25%');
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
      expect(getFormattedValue('cpu.total.wait', snapshot, 0.04003123))
      .to.equal('4%');
    });

    it('should round percentages', () => {
      expect(getFormattedValue('cpu.total.wait', snapshot, 0.041))
      .to.equal('4.1%');
    });
  });

});
