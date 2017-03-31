/* eslint-env mocha */

import { expect } from 'chai';
import { uniq } from 'lodash';

import { registry, getCategoryIcon } from 'in-sdk/tracing';

describe('in-sdk/tracing/tracing', () => {
  uniq(Object.keys(registry).map(type => registry[type].category)).forEach(category => {
    it(`must define an icon for category ${category}`, () => {
      expect(getCategoryIcon(category)).to.be.defined;
    });
  });
});
