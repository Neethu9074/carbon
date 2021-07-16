/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import { getRegexForPathPatternsWithRouteParamPlaceholders } from 'in-components/layout/SideNavigationAndContent/routing';

describe('in-components/layout/SideNavigationAndContent/routing', () => {
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
