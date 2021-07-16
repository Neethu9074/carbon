/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import { stringify } from 'in-stores/navigation/routing/stringifier';
import { parseUrl } from 'in-stores/navigation/routing/parser';

describe('in-stores/navigation/routing/stringifier', () => {
  describe('stringify', () => {
    check('/');
    check('/foo');
    check('/foo/bar');
    check('/foo/bar?foo');
    check('/foo/bar?foo=bar');
    check('/foo/bar?', '/foo/bar');
    check('/foo;k=v/bar;a=b');
    check('/foo;k=v/bar;a=b/rat?k=b');
    check('/foo;valueWithSpaces=a%2520b/bar');
  });

  function check(href, expected) {
    expected = expected || href;
    it(`must parse and translate: ${href}`, () => {
      expect(stringify(parseUrl(href))).to.equal(expected);
    });
  }
});
