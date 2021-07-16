/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import { getRootPathPattern } from 'in-stores/navigation/paths';

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
});
