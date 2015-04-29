/*eslint-env mocha*/
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';

import './index';
import {health, getHealth} from 'instana-ui-sdk/health';

describe('health', () => {
  const osPlugin = 'com.instana.forge.infrastructure.os.OS';

  describe(osPlugin, () => {
    let snapshot;

    beforeEach(() => {
      snapshot = Immutable.fromJS({
        pluginId: osPlugin,
        snapshot: {
          'accumulated.status': {}
        }
      });
    });

    it('should cope with unavailable scores', () => {
      expect(getHealth(snapshot)).to.equal(health.ok);
    });

    it('should translate 1 to ok', () => {
      setScore(1);
      expect(getHealth(snapshot)).to.equal(health.ok);
    });

    it('should translate 0.9 to warning', () => {
      setScore(0.9);
      expect(getHealth(snapshot)).to.equal(health.warning);
    });

    it('should translate 0.3 to danger', () => {
      setScore(0.3);
      expect(getHealth(snapshot)).to.equal(health.danger);
    });

    function setScore(score) {
      snapshot = snapshot.setIn(
        ['snapshot', 'accumulated.status', 'score'],
        score
      );
    }
  });

});
