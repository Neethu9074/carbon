/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */

import { expect } from 'chai';

import {
  CONTAINS,
  EQUALS,
  LESS_OR_EQUAL_THAN,
  NOT_EQUAL,
  NOT_STARTS_WITH,
  ENDS_WITH,
  STARTS_WITH
} from 'in-components/QueryBuilder/tagFilter/operators';
import {
  sanitizeTagFilter,
  toNewTagFilterFormat,
  type,
  toTagFilter
} from 'in-components/QueryBuilder/transformation/tagFilter';
import { KEY_VALUE_PAIR, STRING, BOOLEAN, NUMBER } from 'in-components/QueryBuilder/tagFilter/types';

const STRING_MAX_LENGTH = 10;
jest.mock('in-components/QueryBuilder/tagFilter/constraints', () => ({
  STRING_MAX_LENGTH
}));

describe('in-components/QueryBuilder/transformation/tagFilter#toNewTagFilterFormat', () => {
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
        },
        {
          name: 'call.erroneous',
          type: BOOLEAN
        },
        {
          name: 'call.latency',
          type: NUMBER
        }
      ]
    };
  });

  it('must not apply any changes to tag filters in new format', () => {
    const tagFilter = {
      type,
      name: 'service.name',
      operator: EQUALS,
      value: 'shop'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: undefined
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

  it('must support a booleanValue represented as string', () => {
    // GIVEN
    const tagFilter = {
      name: 'call.erroneous',
      operator: EQUALS,
      booleanValue: 'true'
    };

    // WHEN
    const result = toNewTagFilterFormat(tagFilter, tagCatalog);

    // THEN
    expect(result).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      key: undefined,
      value: true
    });
  });

  it('must support boolean string values with a missing operator', () => {
    const tagFilter = {
      name: 'call.erroneous',
      value: 'true'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      operator: EQUALS,
      key: undefined,
      value: true
    });
  });

  it('must support numeric string values', () => {
    const tagFilter = {
      name: 'call.latency',
      value: '15',
      operator: LESS_OR_EQUAL_THAN
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      operator: LESS_OR_EQUAL_THAN,
      key: undefined,
      value: 15
    });
  });

  it('must support a numberValue represented as string', () => {
    // GIVEN
    const tagFilter = {
      name: 'call.latency',
      numberValue: '15',
      operator: LESS_OR_EQUAL_THAN
    };

    // WHEN
    const result = toNewTagFilterFormat(tagFilter, tagCatalog);

    // THEN
    expect(result).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      operator: LESS_OR_EQUAL_THAN,
      key: undefined,
      value: 15
    });
  });

  it('must support lower-case operator', () => {
    const tagFilter = {
      name: 'service.name',
      operator: 'equals',
      value: 'shop'
    };
    expect(toNewTagFilterFormat(tagFilter, tagCatalog)).to.deep.equal({
      ...toTagFilter(tagFilter),
      type,
      operator: EQUALS,
      key: undefined,
      value: 'shop'
    });
  });
});

describe('in-components/QueryBuilder/transformation/tagFilter#sanitizeTagFilter', () => {
  it('must not change if sanitization not needed', () => {
    const tagFilter = Object.freeze({
      type,
      name: 'service.name',
      operator: EQUALS,
      value: 'shop'
    });
    expect(sanitizeTagFilter(tagFilter)).to.deep.equal(tagFilter);
  });

  it('must sanitize string values exceeding length limit', () => {
    const tagFilter = Object.freeze({
      type,
      name: 'log.message',
      operator: EQUALS,
      value: '123456789123456789'
    });
    expect(sanitizeTagFilter(tagFilter)).to.deep.equal({
      ...tagFilter,
      operator: STARTS_WITH,
      value: '1234567891'
    });
  });

  it('must sanitize string values exceeding length limit and use negative operator', () => {
    const tagFilter = Object.freeze({
      type,
      name: 'log.message',
      operator: NOT_EQUAL,
      value: 'a'.repeat(STRING_MAX_LENGTH + 10)
    });
    expect(sanitizeTagFilter(tagFilter)).to.deep.equal({
      ...tagFilter,
      operator: NOT_STARTS_WITH,
      value: 'a'.repeat(STRING_MAX_LENGTH)
    });
  });

  it('must sanitize string values exceeding length limit without changing the operator if not needed', () => {
    const tagFilter = Object.freeze({
      type,
      name: 'log.message',
      operator: CONTAINS,
      value: 'a'.repeat(STRING_MAX_LENGTH + 10)
    });
    expect(sanitizeTagFilter(tagFilter)).to.deep.equal({
      ...tagFilter,
      value: 'a'.repeat(STRING_MAX_LENGTH)
    });
  });

  it('must sanitize string values exceeding length limit and use ends with', () => {
    const tagFilter = Object.freeze({
      type,
      name: 'log.message',
      operator: ENDS_WITH,
      value: '123456789123456789'
    });
    expect(sanitizeTagFilter(tagFilter)).to.deep.equal({
      ...tagFilter,
      operator: ENDS_WITH,
      value: '9123456789'
    });
  });
});
