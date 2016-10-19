/* eslint-env mocha */

import Immutable from 'immutable';
import {expect} from 'chai';

import {plugins} from 'in-forge/constants';
import {getLabel} from 'in-sdk/snapshot';
import 'in-forge/plugins/docker/index';

describe('in-forge/plugins/docker/index', () => {

  describe('label', () => {
    it('must generate labels only with the container name', () => {
      const snapshot = Immutable.fromJS({
        plugin: plugins.docker,

        data: {
          Names: ['ui-backend']
        }
      });
      expect(getLabel(snapshot)).to.equal('ui-backend');
    });

    it('must take image name into account', () => {
      const snapshot = Immutable.fromJS({
        plugin: plugins.docker,

        data: {
          Image: 'registry-internal.instana.io/instana/ui-backend/develop:latest',
          Names: ['ui-backend']
        }
      });
      expect(getLabel(snapshot)).to.equal('ui-backend/develop');
    });

    it('must support shorter image names', () => {
      const snapshot = Immutable.fromJS({
        plugin: plugins.docker,

        data: {
          Image: 'ui-backend/develop:latest',
          Names: ['ui-backend']
        }
      });
      expect(getLabel(snapshot)).to.equal('ui-backend/develop');
    });

    it('must support unqualified image names', () => {
      const snapshot = Immutable.fromJS({
        plugin: plugins.docker,

        data: {
          Image: 'develop',
          Names: ['ui-backend']
        }
      });
      expect(getLabel(snapshot)).to.equal('develop');
    });
  });
});
