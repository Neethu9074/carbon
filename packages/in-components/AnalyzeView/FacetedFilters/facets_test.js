/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import {
  addFacetItem,
  getRangesFromFacets,
  removeFacetItem,
  removeFacetTag,
  tagFiltersFromFacets
} from 'in-components/AnalyzeView/FacetedFilters/facets';
import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

describe('in-components/AnalyzeView/FacetedFilters/facets.js', () => {
  describe('addFacetItem', () => {
    it('should add a new facet tag with an item if the tag does not yet exist', () => {
      // GIVEN
      const existingFacets = {};
      const newTag = 'newFacetTag';
      const newItem = 'newFacetItem';
      const expectedFacets = {
        [newTag]: [newItem]
      };

      // WHEN
      const updatedFacets = addFacetItem(existingFacets, newTag, newItem);

      // THEN
      expect(updatedFacets).toEqual(expectedFacets);
    });

    it('should not add duplicates', () => {
      // GIVEN
      const facetTag = 'facetTag';
      const tagItem = 'existing';
      const existingFacets = {
        [facetTag]: [tagItem]
      };
      const expectedFacets = existingFacets;

      // WHEN
      const updatedFacets = addFacetItem(existingFacets, facetTag, tagItem);

      // THEN
      expect(updatedFacets).toEqual(expectedFacets);
    });
  });

  describe('removeFacetItem', () => {
    it('should remove a single tag item', () => {
      // GIVEN
      const facetTag = 'facetTag';
      const tagItems = ['existing', 'items'];
      const existingFacets = {
        [facetTag]: tagItems
      };
      const itemToRemove = 'existing';
      const expectedFacets = {
        [facetTag]: ['items']
      };

      // WHEN
      const updatedFacets = removeFacetItem(existingFacets, facetTag, itemToRemove);

      // THEN
      expect(updatedFacets).toEqual(expectedFacets);
    });

    it('should properly remove object items', () => {
      // GIVEN
      const facetTag = 'facetTag';
      const tagItemObject = { tag: 'item' };
      const tagItems = ['existing', tagItemObject];
      const existingFacets = {
        [facetTag]: tagItems
      };
      const itemToRemove = tagItemObject;
      const expectedFacets = {
        [facetTag]: ['existing']
      };

      // WHEN
      const updatedFacets = removeFacetItem(existingFacets, facetTag, itemToRemove);

      // THEN
      expect(updatedFacets).toEqual(expectedFacets);
    });

    it('should remove the whole tag if no item is left', () => {
      // GIVEN
      const facetTag = 'facetTag';
      const tagItems = ['existing'];
      const existingFacets = {
        [facetTag]: tagItems
      };
      const itemToRemove = 'existing';
      const expectedFacets = {};

      // WHEN
      const updatedFacets = removeFacetItem(existingFacets, facetTag, itemToRemove);

      // THEN
      expect(updatedFacets).toEqual(expectedFacets);
    });
  });

  describe('removeFacetTag', () => {
    it('should remove existing tags from facets', () => {
      // GIVEN
      const facetTag = 'facetTag';
      const tagItems = ['existing'];
      const existingFacets = {
        [facetTag]: tagItems,
        other: ['facets']
      };

      // WHEN
      const updatedFacets = removeFacetTag(existingFacets, facetTag);

      // THEN
      expect(updatedFacets).not.toHaveProperty(facetTag);
    });

    it('should ignore missing tags', () => {
      // GIVEN
      const facetTag = 'facetTag';
      const existingFacets = {
        other: ['facets']
      };

      // WHEN
      const updatedFacets = removeFacetTag(existingFacets, facetTag);

      // THEN
      expect(updatedFacets).toEqual(existingFacets);
    });
  });

  describe('getRangesFromFacets', () => {
    it('should return a list of valid number ranges', () => {
      // GIVEN
      const facetTag = 'ranges';
      const ranges = [
        { from: 'foo', to: 23 },
        { from: 42, to: 'bar' },
        { from: 123, to: 456 }
      ];
      const existingFacets = {
        [facetTag]: ranges
      };
      const expectedRanges = [
        { from: null, to: 23 },
        { from: 42, to: null },
        { from: 123, to: 456 }
      ];

      // WHEN
      const numberRanges = getRangesFromFacets(existingFacets, facetTag);

      // THEN
      expect(numberRanges.length).toBe(3);
      expect(numberRanges).toEqual(expectedRanges);
    });
  });

  describe('getRangesFromFacets', () => {
    it('should replace non-numerical values with null', () => {
      // GIVEN
      const facetTag = 'ranges';
      const ranges = [
        { from: 'foo', to: 23 },
        { from: 42, to: 'bar' },
        { from: 123, to: 456 }
      ];
      const existingFacets = {
        [facetTag]: ranges
      };
      const expectedRanges = [
        { from: null, to: 23 },
        { from: 42, to: null },
        { from: 123, to: 456 }
      ];

      // WHEN
      const numberRanges = getRangesFromFacets(existingFacets, facetTag);

      // THEN
      expect(numberRanges.length).toBe(3);
      expect(numberRanges).toEqual(expectedRanges);
    });
  });

  describe('tagFiltersFromFacets', () => {
    it('should add all configured facet tags', () => {
      // GIVEN
      const facetsConfig = [
        {
          tag: 'call.erroneous'
        },
        {
          tag: 'call.http.statusClass'
        },
        {
          tag: 'application.name',
          entity: DESTINATION
        },
        {
          tag: 'service.name',
          entity: DESTINATION
        }
      ];
      const existingFacets = {
        'application.name': ['first ap', 'second ap', 'third ap'],
        'service.name': ['first svc', 'second svc', 'third svc'],
        'call.erroneous': [true],
        'not.included': ['foo', 'bar']
      };
      const expectedFacetsAsTagFilterExpression = [
        {
          type: 'TAG_FILTER',
          name: 'call.erroneous',
          operator: EQUALS,
          value: true
        },
        { type: 'CONJUNCTION', logicalOperator: 'AND' },
        { type: 'OPEN_BRACKET' },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: EQUALS,
          value: 'first ap',
          entity: 'DESTINATION'
        },
        { type: 'CONJUNCTION', logicalOperator: 'OR' },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: EQUALS,
          value: 'second ap',
          entity: 'DESTINATION'
        },
        { type: 'CONJUNCTION', logicalOperator: 'OR' },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: EQUALS,
          value: 'third ap',
          entity: 'DESTINATION'
        },
        { type: 'CLOSE_BRACKET' },
        { type: 'CONJUNCTION', logicalOperator: 'AND' },
        { type: 'OPEN_BRACKET' },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: EQUALS,
          value: 'first svc',
          entity: 'DESTINATION'
        },
        { type: 'CONJUNCTION', logicalOperator: 'OR' },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: EQUALS,
          value: 'second svc',
          entity: 'DESTINATION'
        },
        { type: 'CONJUNCTION', logicalOperator: 'OR' },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: EQUALS,
          value: 'third svc',
          entity: 'DESTINATION'
        },
        { type: 'CLOSE_BRACKET' }
      ];

      // WHEN
      const facetsAsTagFilterExpressions = tagFiltersFromFacets(facetsConfig, existingFacets);

      // THEN
      expect(facetsAsTagFilterExpressions.length).toBe(expectedFacetsAsTagFilterExpression.length);
      expect(facetsAsTagFilterExpressions).toEqual(expectedFacetsAsTagFilterExpression);
    });

    it('should skip NOT_APPLICABLE entity property', () => {
      // GIVEN
      const facetsConfig = [
        {
          tag: 'application.name',
          entity: NOT_APPLICABLE
        }
      ];
      const existingFacets = {
        'application.name': ['first ap']
      };
      const expectedFacetsAsTagFilterExpression = [
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: EQUALS,
          value: 'first ap'
        }
      ];

      // WHEN
      const facetsAsTagFilterExpressions = tagFiltersFromFacets(facetsConfig, existingFacets);

      // THEN
      expect(facetsAsTagFilterExpressions.length).toBe(expectedFacetsAsTagFilterExpression.length);
      expect(facetsAsTagFilterExpressions).toEqual(expectedFacetsAsTagFilterExpression);
    });

    it('should not include nullish entity values', () => {
      // GIVEN
      const facetsConfig = [
        {
          tag: 'application.name',
          entity: null
        },
        {
          tag: 'service.name',
          entity: undefined
        }
      ];
      const existingFacets = {
        'application.name': ['first ap'],
        'service.name': ['first svc']
      };
      const expectedFacetsAsTagFilterExpression = [
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: EQUALS,
          value: 'first ap'
        },
        { type: 'CONJUNCTION', logicalOperator: 'AND' },
        {
          type: 'TAG_FILTER',
          name: 'service.name',
          operator: EQUALS,
          value: 'first svc'
        }
      ];

      // WHEN
      const facetsAsTagFilterExpressions = tagFiltersFromFacets(facetsConfig, existingFacets);

      // THEN
      expect(facetsAsTagFilterExpressions.length).toBe(expectedFacetsAsTagFilterExpression.length);
      expect(facetsAsTagFilterExpressions).toEqual(expectedFacetsAsTagFilterExpression);
    });

    it('should properly process ranges', () => {
      // GIVEN
      const facetsConfig = [
        {
          tag: 'call.latency'
        }
      ];
      const existingFacets = {
        'call.latency': [{ from: 10, to: 20 }]
      };
      const expectedFacetsAsTagFilterExpression = [
        {
          type: 'TAG_FILTER',
          name: 'call.latency',
          operator: GREATER_OR_EQUAL_THAN,
          value: 10
        },
        { type: 'CONJUNCTION', logicalOperator: 'AND' },
        {
          type: 'TAG_FILTER',
          name: 'call.latency',
          operator: LESS_THAN,
          value: 20
        }
      ];

      // WHEN
      const facetsAsTagFilterExpressions = tagFiltersFromFacets(facetsConfig, existingFacets);

      // THEN
      expect(facetsAsTagFilterExpressions.length).toBe(expectedFacetsAsTagFilterExpression.length);
      expect(facetsAsTagFilterExpressions).toEqual(expectedFacetsAsTagFilterExpression);
    });

    it('should properly process open ranges', () => {
      // GIVEN
      const facetsConfig = [
        {
          tag: 'call.latency'
        },
        {
          tag: 'trace.latency'
        }
      ];
      const existingFacets = {
        'call.latency': [{ to: 20 }],
        'trace.latency': [{ from: 20 }]
      };
      const expectedFacetsAsTagFilterExpression = [
        {
          type: 'TAG_FILTER',
          name: 'call.latency',
          operator: LESS_THAN,
          value: 20
        },
        { type: 'CONJUNCTION', logicalOperator: 'AND' },
        {
          type: 'TAG_FILTER',
          name: 'trace.latency',
          operator: GREATER_OR_EQUAL_THAN,
          value: 20
        }
      ];

      // WHEN
      const facetsAsTagFilterExpressions = tagFiltersFromFacets(facetsConfig, existingFacets);

      // THEN
      expect(facetsAsTagFilterExpressions.length).toBe(expectedFacetsAsTagFilterExpression.length);
      expect(facetsAsTagFilterExpressions).toEqual(expectedFacetsAsTagFilterExpression);
    });
  });
});
