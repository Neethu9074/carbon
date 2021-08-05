/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import {
  Bracket,
  CLOSE_BRACKET,
  Conjunction,
  FormModelElement
} from 'in-components/QueryBuilder/transformation/formModel';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getFiltersCount, getLimitedNumberOfFilters } from './limitedFilters';
import { TagFilter } from 'in-types';

describe('in-websites/WebsiteDashboard/tabs/alerts/limitedFilters', () => {
  const and: Conjunction = {
    type: 'CONJUNCTION',
    logicalOperator: 'AND'
  };
  const somTagFilter: TagFilter = {
    entity: 'NOT_APPLICABLE',
    name: 'test',
    operator: 'EQUALS',
    type: 'any type'
  };
  const closingBracket: Bracket = { type: CLOSE_BRACKET };

  describe('getFiltersCount', () => {
    it('provides correct number of TagFilter for empty list', () => {
      expect(getFiltersCount([])).toBe(0);
    });

    it('provides correct number of TagFilters formModel elements', () => {
      const tagFilters: FormModelElement[] = [
        and,
        closingBracket,
        { ...somTagFilter, type: 'wrong type, gets filtered-out' },
        { ...somTagFilter, type: TAG_FILTER }
      ];

      expect(getFiltersCount(tagFilters)).toBe(1);
    });
  });

  describe('getLimitedNumberOfFilters', () => {
    it('reduces the size of filters to specific number', () => {
      const tagFilters: FormModelElement[] = [
        { ...somTagFilter, type: 'wrong type, gets filtered-out' },
        and,
        { ...somTagFilter, type: TAG_FILTER },
        and,
        { ...somTagFilter, name: 'beacon.page.name', value: 'excluded', type: TAG_FILTER },
        and,
        { type: 'CLOSE_BRACKET' }
      ];

      expect(getLimitedNumberOfFilters(tagFilters, 1)).toMatchInlineSnapshot(`
        Array [
          Object {
            "entity": "NOT_APPLICABLE",
            "name": "test",
            "operator": "EQUALS",
            "type": "wrong type, gets filtered-out",
          },
          Object {
            "logicalOperator": "AND",
            "type": "CONJUNCTION",
          },
          Object {
            "entity": "NOT_APPLICABLE",
            "name": "test",
            "operator": "EQUALS",
            "type": "TAG_FILTER",
          },
        ]
      `);
    });
  });
});
