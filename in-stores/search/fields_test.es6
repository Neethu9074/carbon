/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-components/SearchBar/misc/fields', () => {
  let mod;

  beforeEach(() => {
    mod = proxyquire('in-stores/search/fields', {});

    mod.buildCategorizedFields([
      { keyword: 'entity' },
      { keyword: 'span' },
      { keyword: 'graph' },
      { keyword: 'trace' },
      { keyword: 'event' },
      { keyword: 'log' },
      { keyword: 'entity.containerized' },
      { keyword: 'entity.id' },
      { keyword: 'entity.os' },
      { keyword: 'entity.serviceName' },
      { keyword: 'entity.type' },
      { keyword: 'entity.version' },
      { keyword: 'span.type' },
      { keyword: 'span.duration' },
      { keyword: 'span.errorCount' },
      { keyword: 'span.location.country' },
      { keyword: 'span.sql.command' },
      { keyword: 'span.content' },
      { keyword: 'graph.connectedTo' },
      { keyword: 'graph.relatedTo' },
      { keyword: 'event.open' },
      { keyword: 'event.severity' },
      { keyword: 'event.type' },
      { keyword: 'trace.type' },
      { keyword: 'trace.errorCount' },
      { keyword: 'log.level' }
    ]);
  });

  it('must return root on empty null', () => {
    expect(mod.findNode().name).to.equal('root');
  });

  it('must return root on empty string', () => {
    expect(mod.findNode('').name).to.equal('root');
  });

  it('must return matching nodes', () => {
    expect(mod.findNode('e').name).to.equal('root');
  });

  it('must return all children for valid first stage', () => {
    expect(mod.findNode('entity').name).to.equal('root');
    expect(mod.findNode('span').name).to.equal('root');
    expect(mod.findNode('graph').name).to.equal('root');
    expect(mod.findNode('trace').name).to.equal('root');
    expect(mod.findNode('event').name).to.equal('root');
  });

  it('must only enter the matching node on dot', () => {
    expect(mod.findNode('entity.').name).to.equal('entity');
    expect(mod.findNode('span.').name).to.equal('span');
    expect(mod.findNode('graph.').name).to.equal('graph');
    expect(mod.findNode('trace.').name).to.equal('trace');
    expect(mod.findNode('event.').name).to.equal('event');
  });

  it('must return all children for valid second stage', () => {
    expect(mod.findNode('span.location').name).to.equal('span');
    expect(mod.findNode('span.location.').name).to.equal('location');
  });

  it('must return all children for valid third stage', () => {
    expect(mod.findNode('span.location.country').name).to.equal('location');
    expect(mod.findNode('span.location.country.')).to.equal(null);
  });

  it('must skip unknown path', () => {
    expect(mod.findNode('span.unknnown')).to.equal(null);
  });

  it('must skip unknown path', () => {
    expect(mod.findNode('unknown.')).to.equal(null);
    expect(mod.findNode('ent.')).to.equal(null);
    expect(mod.findNode('.')).to.equal(null);
  });

  it('must skip blacklisted items', () => {
    expect(mod.findNode('log')).to.equal(null);
  });
});
