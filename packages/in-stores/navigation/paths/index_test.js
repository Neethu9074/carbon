/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { getRootPathPattern, getRegexForPathPatternsWithRouteParamPlaceholders } from 'in-stores/navigation/paths';

describe('in-stores/navigation/paths', () => {
  describe('getRootPathPattern', () => {
    it('must match exactly', () => {
      expect('/foo').to.match(getRootPathPattern('/foo'));
    });

    it('must match with active subpaths', () => {
      expect('/foo/bar').to.match(getRootPathPattern('/foo'));
    });

    it('must not match when it is only a prefix match', () => {
      expect('/foo2').to.not.match(getRootPathPattern('/foo'));
    });

    it('must not match when it a subpath matches', () => {
      expect('/bar/foo').to.not.match(getRootPathPattern('/foo'));
    });

    it('must match against multiple root paths', () => {
      expect('/blub').to.match(getRootPathPattern('/foo', '/blub', '/bar'));
    });
  });

  describe('getRegexForPathPatternsWithRouteParamPlaceholders', () => {
    it('must match without route parameters', () => {
      expect('/path/without/route/params').to.match(
        getRegexForPathPatternsWithRouteParamPlaceholders('/path/without/route/params')
      );
    });

    it('must match with route parameters', () => {
      expect('/a/path/With/some/PLAAAACE/holders').to.match(
        getRegexForPathPatternsWithRouteParamPlaceholders('/a/path/:w1th/some/:pla_ce/holders')
      );
    });

    it('must match multiple routes', () => {
      expect('/foo/1234/bar/5678').to.match(
        getRegexForPathPatternsWithRouteParamPlaceholders('/foo/:id/bar/:thing', '/bar/:what/baz/:ever')
      );
      expect('/bar/abcd/baz/efgh').to.match(
        getRegexForPathPatternsWithRouteParamPlaceholders('/foo/:id/bar/:thing', '/bar/:what/baz/:ever')
      );
    });
  });
});
