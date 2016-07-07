/* eslint-env mocha */

import {expect} from 'chai';

import {createPluginFieldPath} from 'in-sdk/search';
import 'in-forge';

describe('in-sdk/search', () => {
  describe('createPluginFieldPath', () => {
    it('must create path', () => {
      expect(createPluginFieldPath('host', ['cpu.count']))
        .to.equal('search.host.cpu__count');
    });
  });
});
