/* eslint-env mocha */
import Immutable from 'immutable';
import {expect} from 'chai';

import {getPower} from 'in-sdk/power';

import './index';

describe('power', () => {
  const osPlugin = 'com.instana.forge.infrastructure.os.host.Host';

  describe(osPlugin, () => {
    let snapshot;

    beforeEach(() => {
      snapshot = Immutable.fromJS({
        plugin: osPlugin,
        data: {
          'cpu.count': 1,
          'memory.total': 1000
        }
      });
    });

    it('should calculate power', () => {
      expect(getPower(snapshot)).to.equal(1000);
    });
  });
});
