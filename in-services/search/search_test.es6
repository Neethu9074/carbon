/* eslint-env mocha */
/* eslint-disable max-len */

import {expect} from 'chai';

import {transformQuery} from 'in-services/search/search';
import 'in-forge';

describe('in-services/search', () => {
  function transform(str) {
    return transformQuery(str).luceneQuery;
  }

  it('must report unknown keys', () => {
    expect(() => transform('cpuAwesomeness = 1000')).to.throw(/Unknown key cpuAwesomeness at line 1/);
  });

  it('must report unsupported operators', () => {
    expect(() => transform('cpuCount ~ 1000')).to.throw(/Unsupported operator ~ for key cpuCount at line 1/);
  });

  it('must translate host cpu count query to lucene query', () => {
    expect(transform('cpuCount > 3'))
      .to.equal('cpuCount:>3');
  });

  it('must translate a mix of key/value and free text queries', () => {
    expect(transform('cpuCount <= 18 fat machine'))
      .to.equal('cpuCount:<=18 fat machine');
  });

  it('must retain groups of words', () => {
    expect(transform('cpuCount <= 18 "fat machine"'))
      .to.equal("cpuCount:<=18 'fat machine'");
  });

  it('must not use an equal sign when looking for equality', () => {
    expect(transform('cpuCount = 18'))
      .to.equal('cpuCount:18');
  });

  it('must reject values which are not numbers', () => {
    expect(() => transform('cpuCount > abc')).to.throw(/Unsupported value abc for key cpuCount at line 1. Expected value to be a number./);
  });

  it('must not mix free text query parts', () => {
    expect(transform('fat cpuCount <= 18 machine'))
      .to.equal('fat cpuCount:<=18 machine');
  });

  it('must support key/value string queries', () => {
    expect(transform('fqdn = "foo bar"'))
      .to.equal("fqdn:'foo bar'");
  });

  it('must support searches for tags', () => {
    expect(transform('tag = "production environment"'))
      .to.equal("tag:'production environment'");
  });

  it('must return an empty string when no filters are defined', () => {
    expect(transform('')).to.equal('');
  });

  it('must not escape wildcard operator', () => {
    expect(transform('elasti*')).to.equal('elasti*');
  });

  it('must not escape fuzzy operator', () => {
    expect(transform('elasti~')).to.equal('elasti~');
  });

  it.skip('must support multiple values for selection types', () => {
    expect(transform('type=service')).to.match(/^\(plugin_id:[a-z.]+ OR plugin_id:[a-z.]+ OR .*\)$/i);
  });

  it('must support raw entities query types', () => {
    expect(transform('entities="foo:bar"')).to.equal('foo:bar');
  });
});
