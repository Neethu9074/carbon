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
      .to.equal("data.com__instana__forge__infrastructure__os__host__Host.cpu__count:<=18 'fat' 'machine'");
  });

  it('must retain groups of words', () => {
    expect(transform('host.cpuCount <= 18 "fat machine"'))
      .to.equal("data.com__instana__forge__infrastructure__os__host__Host.cpu__count:<=18 'fat machine'");
  });

  it('must not use an equal sign when looking for equality', () => {
    expect(transform('host.cpuCount = 18'))
      .to.equal('data.com__instana__forge__infrastructure__os__host__Host.cpu__count:18');
  });

  it('must reject values which are not numbers', () => {
    expect(() => transform('host.cpuCount > abc')).to.throw(/Unsupported value abc for key host.cpuCount at line 1. Expected value to be a number./);
  });

  it('must not mix free text query parts', () => {
    expect(transform('fat host.cpuCount <= 18 machine'))
      .to.equal("'fat' data.com__instana__forge__infrastructure__os__host__Host.cpu__count:<=18 'machine'");
  });

  it('must support key/value string queries', () => {
    expect(transform('host.osName = "Windows 10"'))
      .to.equal("data.com__instana__forge__infrastructure__os__host__Host.os__name:'Windows 10'");
  });

  it('must support searches for tags', () => {
    expect(transform('tag = "production environment"'))
      .to.equal("processor_tags:'production environment'");
  });

  it('must support searches for entity types', () => {
    expect(transform('type=host'))
      .to.equal('plugin_id:com.instana.forge.infrastructure.os.host.Host');
  });

  it('must support case insensitive searches for types', () => {
    expect(transform('type=nOdE.Js'))
      .to.equal('plugin_id:com.instana.forge.infrastructure.runtime.nodejs.NodeJsRuntimePlatform');
  });

  it('must reject searches for unknown entity types', () => {
    expect(() => transform('type=blub'))
      .to.throw(/Unknown entity type blub for key type at row 1./);
  });

  it('must return an empty string when no filters are defined', () => {
    expect(transform('')).to.equal('');
  });
});
