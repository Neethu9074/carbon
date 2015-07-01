/*eslint-env mocha*/
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';

import './index';
import {
  getNormalizedValue,
  getFormattedValue
  } from 'instana-ui-sdk/metrics';

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

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', 1)).to.equal('1 B');
    });

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', 1024)).to.equal('1 kB');
    });

    it('should format bytes to whateverBytes', () => {
      expect(getFormattedValue('memory.free', 1024 * 1024)).to.equal('1 MB');
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('load', 0.5)).to.equal(50);
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('cpu.total.user', 0.5)).to.equal(50);
    });

    it('should format normalized to percentage', () => {
      expect(getFormattedValue('cpu.total.wait', 0.25)).to.equal(25);
    });
  });

});
