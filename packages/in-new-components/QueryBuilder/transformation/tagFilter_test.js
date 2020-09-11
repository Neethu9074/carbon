/* eslint-env mocha */

import { expect } from 'chai';

import { toNewTagFilterFormat, type, toTagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { KEY_VALUE_PAIR, STRING } from 'in-new-components/QueryBuilder/tagFilter/types';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';

describe('in-new-components/QueryBuilder/transformation/tagFilter#toNewTagFilterFormat', () => {
  let tagCatalog;

  beforeEach(() => {
    tagCatalog = {
      tags: [
        {
          name: 'service.name',
          type: STRING
        },
        {
          name: 'http.headers',
          type: KEY_VALUE_PAIR
        }
      ]
    };
  });

  it('must not apply any changes to tag filters in new format', () => {
    const tagFilter = {
      name: 'service.name',
      operator: EQUALS,
      value: 'shop'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type
    });
  });

  it('must convert string values', () => {
    const tagFilter = {
      name: 'service.name',
      operator: EQUALS,
      stringValue: 'shop'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: undefined,
      value: 'shop'
    });
  });

  it('must convert string key value pairs without value', () => {
    const tagFilter = {
      name: 'http.headers',
      operator: EQUALS,
      stringValue: 'user-agent'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: 'user-agent',
      value: undefined
    });
  });

  it('must convert string key value pairs without value (with =)', () => {
    const tagFilter = {
      name: 'http.headers',
      operator: EQUALS,
      stringValue: 'user-agent='
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: 'user-agent',
      value: undefined
    });
  });

  it('must convert string key value pairs', () => {
    const tagFilter = {
      name: 'http.headers',
      operator: EQUALS,
      stringValue: 'user-agent=chrome'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: 'user-agent',
      value: 'chrome'
    });
  });

  it('must just pass through string values when tag is unknown', () => {
    const tagFilter = {
      name: 'unknown',
      operator: EQUALS,
      stringValue: 'shop'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: undefined,
      value: 'shop'
    });
  });

  it('must support number values', () => {
    const tagFilter = {
      name: 'call.latency',
      operator: EQUALS,
      numberValue: 42
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: undefined,
      value: 42
    });
  });

  it('must support boolean values', () => {
    const tagFilter = {
      name: 'call.erroneous',
      operator: EQUALS,
      booleanValue: true
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: undefined,
      value: true
    });
  });
});
