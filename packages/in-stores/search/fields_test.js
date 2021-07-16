/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
/* global __dirname: false */

import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { config } from 'in-services/config';

describe('in-components/SearchBar/misc/fields', () => {
  let mod;

  let originalInstanaGlobal;
  let originalSettings;
  let originalFeatureFlags;

  beforeEach(() => {
    // when running on Jenkins, window.instana seems to not exist, so let's initialize it.
    originalInstanaGlobal = window.instana;
    window.instana = window.instana || {};

    originalSettings = window.instana.settings;
    window.instana.settings = {};

    originalFeatureFlags = config.featureFlags;
    config.featureFlags = {};
  });

  afterEach(() => {
    // we messed a lot with global variables in beforeEach, so let's clean up
    window.instana.settings = originalSettings;
    window.instana = originalInstanaGlobal;
    config.featureFlags = originalFeatureFlags;
  });

  describe('in hybrid mode with v2=true', () => {
    beforeEach(() => {
      mod = proxyquire('in-stores/search/fields', {});

      mod.buildCategorizedFields(undefined, [
        { keyword: 'entity' },
        { keyword: 'graph' },
        { keyword: 'event' },
        { keyword: 'entity.containerized' },
        { keyword: 'entity.id' },
        { keyword: 'entity.os' },
        { keyword: 'entity.serviceName' },
        { keyword: 'entity.type' },
        { keyword: 'graph.connectedTo' },
        { keyword: 'graph.relatedTo' },
        { keyword: 'event.open' },
        { keyword: 'event.severity' },
        { keyword: 'event.type' }
      ]);

      setHybridModeV2Enabled(true);
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
      expect(mod.findNode('graph').name).to.equal('root');
      expect(mod.findNode('event').name).to.equal('root');
    });

    it('must only enter the matching node on dot', () => {
      expect(mod.findNode('entity.').name).to.equal('entity');
      expect(mod.findNode('graph.').name).to.equal('graph');
      expect(mod.findNode('event.').name).to.equal('event');
    });

    it('must return all children for valid second stage', () => {
      expect(mod.findNode('entity.type').name).to.equal('entity');
    });

    it('must skip unknown path', () => {
      expect(mod.findNode('entity.unknown')).to.equal(null);
    });

    it('must skip unknown path', () => {
      expect(mod.findNode('unknown.')).to.equal(null);
      expect(mod.findNode('ent.')).to.equal(null);
      expect(mod.findNode('.')).to.equal(null);
    });

    it('must skip disabled items', () => {
      expect(mod.findNode('log')).to.equal(null);
      expect(mod.findNode('span')).to.equal(null);
      expect(mod.findNode('trace')).to.equal(null);
    });
  });

  describe('in hybrid mode with v2=true and searchContext=traces', () => {
    const ctx = 'traces';

    beforeEach(() => {
      mod = proxyquire('in-stores/search/fields', {});

      mod.buildCategorizedFields(ctx, [
        { keyword: 'entity' },
        { keyword: 'span' },
        { keyword: 'graph' },
        { keyword: 'trace' },
        { keyword: 'event' },
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
        { keyword: 'trace.eum.pageLoad', termType: 'id' }
      ]);

      setHybridModeV2Enabled(true);
    });

    it('must return root on empty null', () => {
      expect(mod.findNode(undefined, ctx).name).to.equal('root');
    });

    it('must return root on empty string', () => {
      expect(mod.findNode('', ctx).name).to.equal('root');
    });

    it('must return matching nodes', () => {
      expect(mod.findNode('e', ctx).name).to.equal('root');
    });

    it('must return all children for valid first stage', () => {
      expect(mod.findNode('entity', ctx).name).to.equal('root');
      expect(mod.findNode('span', ctx).name).to.equal('root');
      expect(mod.findNode('graph', ctx).name).to.equal('root');
      expect(mod.findNode('trace', ctx).name).to.equal('root');
      expect(mod.findNode('event', ctx).name).to.equal('root');
    });

    it('must only enter the matching node on dot', () => {
      expect(mod.findNode('entity.', ctx).name).to.equal('entity');
      expect(mod.findNode('span.', ctx).name).to.equal('span');
      expect(mod.findNode('graph.', ctx).name).to.equal('graph');
      expect(mod.findNode('trace.', ctx).name).to.equal('trace');
      expect(mod.findNode('event.', ctx).name).to.equal('event');
    });

    it('must return all children for valid second stage', () => {
      expect(mod.findNode('span.location', ctx).name).to.equal('span');
      expect(mod.findNode('span.location.', ctx).name).to.equal('location');
    });

    it('must return all children for valid third stage', () => {
      expect(mod.findNode('span.location.country', ctx).name).to.equal('location');
      expect(mod.findNode('span.location.country.', ctx)).to.equal(null);
    });

    it('must skip unknown path', () => {
      expect(mod.findNode('span.unknown', ctx)).to.equal(null);
    });

    it('must skip unknown path', () => {
      expect(mod.findNode('unknown.', ctx)).to.equal(null);
      expect(mod.findNode('ent.', ctx)).to.equal(null);
      expect(mod.findNode('.', ctx)).to.equal(null);
    });

    it('must skip disabled items', () => {
      expect(mod.findNode('log', ctx)).to.equal(null);
    });

    it('must skip groups if children only contains termtype-id items', () => {
      expect(mod.findNode('trace.eum', ctx)).to.equal(null);
    });
  });

  function setHybridModeV2Enabled(v2Enabled) {
    window.instana.settings.v2Enabled = v2Enabled;
    updateFeatureFlags();
  }

  function updateFeatureFlags() {
    // evaluating feature flags is a one-time event in production code, so we have to jump through some hoops here :-/
    const resolvedFileName = require.resolve(__dirname + '/../../in-services/featureFlags.ts');
    delete require.cache[resolvedFileName];
    require(resolvedFileName);
  }
});
