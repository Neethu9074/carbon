/* eslint-env mocha */

import { expect } from 'chai';

import {
  fromTagFiltersArray,
  joinExpressions,
  removeTopLevelFilters,
  CONJUNCTION as CONJUNCTION_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE
} from 'in-new-components/QueryBuilder/transformation/formModel';
import { or, and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { KEY_VALUE_PAIR, STRING } from 'in-new-components/QueryBuilder/tagFilter/types';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';

describe('in-new-components/QueryBuilder/transformation/formModel', () => {
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

  it('must convert old tag filter arrays to new form model structure', () => {
    const tagFilters = [
      {
        name: 'service.name',
        operator: EQUALS,
        stringValue: 'shop'
      },
      {
        name: 'call.latency',
        operator: EQUALS,
        numberValue: 42
      },
      {
        name: 'http.headers',
        operator: EQUALS,
        stringValue: 'user-agent=chrome'
      }
    ];
    expect(fromTagFiltersArray(tagFilters, tagCatalog)).to.deep.equal([
      {
        name: 'service.name',
        operator: EQUALS,
        type: TAG_FILTER_TYPE,
        key: undefined,
        value: 'shop'
      },
      {
        logicalOperator: and,
        type: CONJUNCTION_TYPE
      },
      {
        name: 'call.latency',
        operator: EQUALS,
        type: TAG_FILTER_TYPE,
        key: undefined,
        value: 42
      },
      {
        logicalOperator: and,
        type: CONJUNCTION_TYPE
      },
      {
        name: 'http.headers',
        operator: EQUALS,
        type: TAG_FILTER_TYPE,
        key: 'user-agent',
        value: 'chrome'
      }
    ]);
  });

  it('must not convert when it does not seem necessary', () => {
    const tagFilters = [
      {
        type: TAG_FILTER_TYPE,
        name: 'service.name',
        operator: EQUALS,
        value: 'shop'
      }
    ];
    expect(fromTagFiltersArray(tagFilters, tagCatalog)).to.deep.equal(tagFilters);
  });

  it('must join expressions', () => {
    expect(
      joinExpressions({
        expressions: [
          { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'my-host' },
          { type: TAG_FILTER_TYPE, name: 'jvm.version', operator: EQUALS, value: '11.0.8' }
        ]
      })
    ).to.deep.equal([
      { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'my-host' },
      { type: CONJUNCTION_TYPE, logicalOperator: and },
      { type: TAG_FILTER_TYPE, name: 'jvm.version', operator: EQUALS, value: '11.0.8' }
    ]);
  });

  it('must enclose expressions when joining as needed', () => {
    expect(
      joinExpressions({
        expressions: [
          [
            { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'my-host' },
            { type: CONJUNCTION_TYPE, logicalOperator: or },
            { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'other-host' }
          ],
          [{ type: TAG_FILTER_TYPE, name: 'jvm.version', operator: EQUALS, value: '11.0.8' }]
        ]
      })
    ).to.deep.equal([
      { type: OPEN_BRACKET_TYPE },
      { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'my-host' },
      { type: CONJUNCTION_TYPE, logicalOperator: or },
      { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'other-host' },
      { type: CLOSE_BRACKET_TYPE },
      { type: CONJUNCTION_TYPE, logicalOperator: and },
      { type: TAG_FILTER_TYPE, name: 'jvm.version', operator: EQUALS, value: '11.0.8' }
    ]);
  });

  it('must not enclose when joining if not needed', () => {
    expect(
      joinExpressions({
        expressions: [
          [
            { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'my-host' },
            { type: CONJUNCTION_TYPE, logicalOperator: and },
            { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'other-host' }
          ],
          [{ type: TAG_FILTER_TYPE, name: 'jvm.version', operator: EQUALS, value: '11.0.8' }]
        ]
      })
    ).to.deep.equal([
      { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'my-host' },
      { type: CONJUNCTION_TYPE, logicalOperator: and },
      { type: TAG_FILTER_TYPE, name: 'host.name', operator: EQUALS, value: 'other-host' },
      { type: CONJUNCTION_TYPE, logicalOperator: and },
      { type: TAG_FILTER_TYPE, name: 'jvm.version', operator: EQUALS, value: '11.0.8' }
    ]);
  });

  it('must not remove filter from empty expression', () => {
    expect(removeTopLevelFilters([], { type: TAG, name: 'tag', operator: EQUALS, value: 'value' })).to.deep.equal([]);
  });

  it('must remove filter from expression with only filter', () => {
    expect(
      removeTopLevelFilters([{ type: TAG, name: 'tag', operator: EQUALS, value: 'value' }], {
        type: TAG,
        name: 'tag',
        operator: EQUALS,
        value: 'value'
      })
    ).to.deep.equal([]);
  });

  it('must remove filter from expression', () => {
    expect(
      removeTopLevelFilters(
        [
          { type: TAG, name: 'other', operator: EQUALS, value: 'value' },
          { type: CONJUNCTION_TYPE, logicalOperator: and },
          { type: TAG, name: 'tag', operator: EQUALS, value: 'value' }
        ],
        { type: TAG, name: 'tag', operator: EQUALS, value: 'value' }
      )
    ).to.deep.equal([{ type: TAG, name: 'other', operator: EQUALS, value: 'value' }]);
  });
  it('must remove filter from expression but not from nested expression', () => {
    expect(
      removeTopLevelFilters(
        [
          { type: OPEN_BRACKET_TYPE },
          { type: TAG, name: 'other', operator: EQUALS, value: 'value' },
          { type: CONJUNCTION_TYPE, logicalOperator: and },
          { type: TAG, name: 'another', operator: EQUALS, value: 'value' },
          { type: CONJUNCTION_TYPE, logicalOperator: and },
          { type: TAG, name: 'tag', operator: EQUALS, value: 'value' },
          { type: CLOSE_BRACKET_TYPE },
          { type: CONJUNCTION_TYPE, logicalOperator: and },
          { type: TAG, name: 'tag', operator: EQUALS, value: 'value' }
        ],
        { type: TAG, name: 'tag', operator: EQUALS, value: 'value' }
      )
    ).to.deep.equal([
      { type: TAG, name: 'other', operator: EQUALS, value: 'value' },
      { type: CONJUNCTION_TYPE, logicalOperator: and },
      { type: TAG, name: 'another', operator: EQUALS, value: 'value' },
      { type: CONJUNCTION_TYPE, logicalOperator: and },
      { type: TAG, name: 'tag', operator: EQUALS, value: 'value' }
    ]);
  });
});
