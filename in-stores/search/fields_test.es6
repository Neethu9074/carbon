/* eslint-env mocha */
import proxyquire from 'proxyquire';
import {expect} from 'chai';


describe('in-components/SearchBar/misc/fields', () => {
  let mod;

  beforeEach(() => {
    mod = proxyquire('in-stores/search/fields', {});

    mod.buildCategorizedFields([
      { alias: 'entity' },
      { alias: 'span' },
      { alias: 'graph' },
      { alias: 'trace' },
      { alias: 'event' },
      { alias: 'log' },

      { alias: 'entity.containerized' },
      { alias: 'entity.id' },
      { alias: 'entity.os' },
      { alias: 'entity.serviceName' },
      { alias: 'entity.type' },
      { alias: 'entity.version' },

      { alias: 'span.type' },
      { alias: 'span.duration' },
      { alias: 'span.errorCount' },
      { alias: 'span.location.country' },
      { alias: 'span.sql.command' },

      { alias: 'graph.connectedTo' },
      { alias: 'graph.relatedTo' },

      { alias: 'event.open' },
      { alias: 'event.severity' },
      { alias: 'event.type' },

      { alias: 'trace.type' },
      { alias: 'trace.errorCount' },

      { alias: 'log.level' },
    ]);
  });

  afterEach(() => {
    delete window.instana;
  });

  it('returns root on empty null', () => {
    expect(mod.findNode().name).to.equal('root');
  });

  it('returns root on empty string', () => {
    expect(mod.findNode('').name).to.equal('root');
  });

  it('returns matching nodes', () => {
    expect(mod.findNode('e').name).to.equal('root');
  });

  it('returns all children for valid first stage', () => {
    expect(mod.findNode('entity').name).to.equal('root');
    expect(mod.findNode('span').name).to.equal('root');
    expect(mod.findNode('graph').name).to.equal('root');
    expect(mod.findNode('trace').name).to.equal('root');
    expect(mod.findNode('event').name).to.equal('root');
    expect(mod.findNode('log').name).to.equal('root');
  });

  it('should only enter the matching node on dot', () => {
    expect(mod.findNode('entity.').name).to.equal('entity');
    expect(mod.findNode('span.').name).to.equal('span');
    expect(mod.findNode('graph.').name).to.equal('graph');
    expect(mod.findNode('trace.').name).to.equal('trace');
    expect(mod.findNode('event.').name).to.equal('event');
    expect(mod.findNode('log.').name).to.equal('log');
  });

  it('returns all children for valid second stage', () => {
    expect(mod.findNode('span.location').name).to.equal('span');
    expect(mod.findNode('span.location.').name).to.equal('location');
  });

  it('returns all children for valid third stage', () => {
    expect(mod.findNode('span.location.country').name).to.equal('location');
    expect(mod.findNode('span.location.country.')).to.equal(null);
  });

  it('should skip unknown path', () => {
    expect(mod.findNode('span.unknnown')).to.equal(null);
  });

  it('should skip unknown path', () => {
    expect(mod.findNode('unknown.')).to.equal(null);
    expect(mod.findNode('ent.')).to.equal(null);
    expect(mod.findNode('.')).to.equal(null);
  });
});
