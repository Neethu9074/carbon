/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import ExistingValue from 'in-applications/analyze/components/FacetedSearch/ExistingValue';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { ua2FacetedSearchFilterAddedTracker } from 'in-applications/tracker';

import locals from './Suggestion.mless';

const tag = 'call.http.status';
const ranges = [
  { start: 100, end: 199, label: '1xx' },
  { start: 200, end: 299, label: '2xx' },
  { start: 300, end: 399, label: '3xx' },
  { start: 400, end: 499, label: '4xx' },
  { start: 500, end: 599, label: '5xx' }
];

export default function FacetedFilterHttpStatusCodes({ title, tagFilterExpression, updateFilter, dataSource }) {
  return (
    <FacetedExpandableCard title={title} tag={tag} dataSource={dataSource}>
      <Body tagFilterExpression={tagFilterExpression} updateFilter={updateFilter} dataSource={dataSource} />
    </FacetedExpandableCard>
  );
}

function Body({ tagFilterExpression, updateFilter, dataSource }) {
  const currentFilters = existingFiltersForTag(tagFilterExpression);
  const selectedRanges =
    currentFilters &&
    ranges.filter(range => {
      const hasStart = currentFilters.find(
        filter => filter.value === range.start && filter.operator === GREATER_OR_EQUAL_THAN
      );
      const hasEnd = currentFilters.find(
        filter => filter.value === range.end && filter.operator === LESS_OR_EQUAL_THAN
      );
      return hasStart && hasEnd;
    });
  if (selectedRanges?.length > 0) {
    return <SelectedRanges selectedRanges={selectedRanges} updateFilter={updateFilter} />;
  }
  return (
    <>
      {ranges.map(range => (
        <Suggestion key={range.start} range={range} updateFilter={updateFilter} dataSource={dataSource} />
      ))}
    </>
  );
}

function existingFiltersForTag(tagFilterExpression) {
  return (
    tagFilterExpression.type === EXPRESSION &&
    tagFilterExpression.logicalOperator === OPERATOR_AND &&
    tagFilterExpression.elements.filter(element => element.type === TAG_FILTER_TYPE && element.name === tag)
  );
}

function SelectedRanges({ selectedRanges, updateFilter }) {
  return (
    <>
      {selectedRanges.map(range => (
        <ExistingValue
          key={range.start}
          value={range.label}
          remove={() =>
            updateFilter({
              remove: [
                {
                  type: TAG,
                  name: tag,
                  operator: GREATER_OR_EQUAL_THAN,
                  value: range.start
                },
                {
                  type: TAG,
                  name: tag,
                  operator: LESS_OR_EQUAL_THAN,
                  value: range.end
                }
              ]
            })
          }
        />
      ))}
    </>
  );
}

function Suggestion({ range, updateFilter, dataSource }) {
  return (
    <div className={locals.suggestion}>
      <Link
        onClick={() => {
          ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: tag });
          updateFilter({
            add: [
              {
                type: TAG,
                name: tag,
                operator: GREATER_OR_EQUAL_THAN,
                value: range.start
              },
              {
                type: TAG,
                name: tag,
                operator: LESS_OR_EQUAL_THAN,
                value: range.end
              }
            ]
          });
        }}
        className={locals.label}
      >
        {range.label}
      </Link>
    </div>
  );
}
