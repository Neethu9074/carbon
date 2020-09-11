/* eslint-env mocha */

import { expect } from 'chai';

import {
  fromTagFiltersArray,
  CONJUNCTION as CONJUNCTION_TYPE
} from 'in-new-components/QueryBuilder/transformation/formModel';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { KEY_VALUE_PAIR, STRING } from 'in-new-components/QueryBuilder/tagFilter/types';
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
});
