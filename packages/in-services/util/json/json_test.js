/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import { expandNestedSerializedJson } from 'in-services/util/json/json';
import { deepFreeze } from 'in-services/util/object';

describe('in-services/util/json/json', () => {
  describe('expandNestedSerializedJson', () => {
    it('must expand nested JSON', () => {
      const given = deepFreeze({
        num: 1,
        bol: false,
        nul: null,
        str: 'a',
        brokenNestedJson: '{"notForReal": true',
        arr: ['a', JSON.stringify({ b: 'false' })],
        obj: JSON.stringify({
          foo: true,
          nestedArr: JSON.stringify([1, 2, 3, '4'])
        })
      });

      expect(expandNestedSerializedJson(given)).to.deep.equal({
        num: 1,
        bol: false,
        nul: null,
        str: 'a',
        brokenNestedJson: '{"notForReal": true',
        arr: ['a', { b: 'false' }],
        obj: { foo: true, nestedArr: '[1,2,3,"4"]' }
      });
    });
  });
});
