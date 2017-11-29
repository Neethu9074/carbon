/* eslint-env mocha */

import { expect } from 'chai';

import { removeField, containsField, setField, getFieldTerms } from 'in-stores/search/manipulation';

describe('in-stores/search/manipulation', () => {
  describe('removeField', () => {
    it('must remove all keywords of a certain type', () => {
      expect(removeField('type:foo', 'type')).to.equal('');
    });

    it('must leave other keywords untouched', () => {
      expect(removeField('tag:bar type:foo', 'type')).to.equal('tag:bar');
    });

    it('must retain operators (variation 1)', () => {
      expect(removeField('(type:bar AND cpuCount:>1) OR (blub:bla OR cpuCount:0)', 'type')).to.equal(
        'cpuCount:>1 OR (blub:bla OR cpuCount:0)'
      );
    });

    it('must retain operators (variation 2)', () => {
      expect(removeField('(cpuCount:>1 AND type:bar) OR (blub:bla OR cpuCount:0)', 'type')).to.equal(
        'cpuCount:>1 OR (blub:bla OR cpuCount:0)'
      );
    });

    it('must resolve to nothing', () => {
      expect(removeField('type:bar OR type:foo', 'type')).to.equal('');
    });

    it('must only remove fields with a given value', () => {
      expect(removeField('tag:bar type:foo OR type:blub', 'type', 'blub')).to.equal('tag:bar type:foo');
    });

    it('must respect quoting', () => {
      expect(removeField('tag:\\!bar tag:bar OR type:blub', 'tag', '!bar')).to.equal('tag:bar OR type:blub');
      expect(removeField('tag:\\!bar tag:bar OR type:blub', 'tag', 'bar')).to.equal('tag:\\!bar type:blub');
    });
  });

  describe('containsField', () => {
    it('must detect whether a certain field exists', () => {
      expect(containsField('(cpuCount:>1 AND type:bar) OR (blub:bla OR cpuCount:0)', 'type')).to.equal(true);
    });

    it('must detect whether a certain field exists with a given value', () => {
      expect(containsField('(cpuCount:>1 AND type:bar) OR (blub:bla OR cpuCount:0)', 'type', 'blub')).to.equal(false);
      expect(containsField('(cpuCount:>1 AND type:bar) OR (blub:bla OR cpuCount:0)', 'type', 'bar')).to.equal(true);
    });

    it('must detect whether a certain field exists with a given value', () => {
      expect(containsField('eventy.type:incident eventy.type:event', 'eventy.type')).to.equal(true);
    });
  });

  describe('setField', () => {
    it('must set field on a simple query', () => {
      expect(setField('type:node', 'tag', 'production')).to.equal('type:node tag:production');
    });

    it('must not set field on a simple query when it already exists', () => {
      expect(setField('type:node tag:production', 'tag', 'production')).to.equal('type:node tag:production');
    });

    it('must set field in a query with two sides', () => {
      expect(setField('type:node tag:dev', 'tag', 'prod')).to.equal('type:node tag:dev tag:prod');
    });

    it('must not set field in a query with two sides when it already exists', () => {
      expect(setField('type:node tag:dev tag:"prod"', 'tag', 'dev')).to.equal('type:node tag:dev tag:"prod"');
    });

    it('must set field in a complicated query', () => {
      expect(setField('(cpuCount:>1 AND type:bar) OR (blub:bla OR cpuCount:0)', 'tag', 'dev')).to.equal(
        '(cpuCount:>1 AND type:bar) OR (blub:bla OR cpuCount:0) tag:dev'
      );
    });

    it('must respect quoting', () => {
      expect(setField('tag:bar OR type:blub', 'tag', '!bar')).to.equal('tag:bar OR type:blub tag:"\\!bar"');
    });

    it('must set term with quotes and when they are required', () => {
      expect(setField('tag:bar OR type:blub', 'tag', 'we like clean strings')).to.equal(
        'tag:bar OR type:blub tag:"we like clean strings"'
      );
    });
  });

  describe('getFieldTerms', () => {
    it('must return the defined field term', () => {
      expect(getFieldTerms('tag:bar', 'tag')).to.deep.equal(['bar']);
    });

    it('must return all the defined field terms', () => {
      expect(getFieldTerms('tag:bar AND (cpuCount:>3 OR cpuCount:0)', 'cpuCount')).to.deep.equal(['>3', '0']);
    });

    it('must unescape the field terms', () => {
      expect(getFieldTerms('tag:"hostname\\:amgen\\-dispatcher03.us\\-east\\-1.aetion.net"', 'tag')).to.deep.equal([
        'hostname:amgen-dispatcher03.us-east-1.aetion.net'
      ]);
    });
  });
});
