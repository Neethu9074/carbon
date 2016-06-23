/* eslint-env mocha */
/* eslint-disable max-len */

import {expect} from 'chai';

import {transformToLuceneQuery as transform} from 'in-services/search/search';
import 'in-forge';

describe('in-services/search', () => {
  it('must report unknown keys', () => {
    expect(() => transform('host.cpuAwesomeness = 1000')).to.throw(/Unknown key host\.cpuAwesomeness at line 1/);
  });

  it('must report unsupported operators', () => {
    expect(() => transform('host.cpuCount ~ 1000')).to.throw(/Unsupported operator ~ for key host\.cpuCount at line 1/);
  });

  it('must translate host cpu count query to lucene query', () => {
    expect(transform('host.cpuCount > 3'))
      .to.equal('data.com__instana__forge__infrastructure__os__host__Host.cpu__count:>3');
  });

  it('must translate a mix of key/value and free text queries', () => {
    expect(transform('host.cpuCount <= 18 fat machine'))
      .to.equal('data.com__instana__forge__infrastructure__os__host__Host.cpu__count:<=18 \'fat machine\'');
  });

  it('must not use an equal sign when looking for equality', () => {
    expect(transform('host.cpuCount = 18'))
      .to.equal('data.com__instana__forge__infrastructure__os__host__Host.cpu__count:18');
  });

  it('must reject values which are not numbers', () => {
    expect(() => transform('host.cpuCount > abc')).to.throw(/Unsupported value abc for key host.cpuCount at line 1. Expected type to be number./);
  });
});
