import React from 'react';

import { GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import ExistingValue from 'in-applications/analyze/components/FacetedSearch/ExistingValue';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import Link from 'in-components/Link';

import locals from './Suggestion.mless';

const tag = 'call.http.status';
const ranges = [
  { start: 100, end: 199 },
  { start: 200, end: 299 },
  { start: 300, end: 399 },
  { start: 400, end: 499 },
  { start: 500, end: 599 }
];

export default function FacetedFilterHttpStatusCodes({ title, tagFilterExpression, addFilter, removeFilter }) {
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
    return <SelectedRanges title={title} selectedRanges={selectedRanges} removeFilter={removeFilter} />;
  }
  return (
    <FacetedExpandableCard title={title}>
      {ranges.map(range => (
        <Suggestion key={range.start} range={range} addFilter={addFilter} />
      ))}
    </FacetedExpandableCard>
  );
}

function existingFiltersForTag(tagFilterExpression) {
  return (
    tagFilterExpression.type === EXPRESSION &&
    tagFilterExpression.logicalOperator === OPERATOR_AND &&
    tagFilterExpression.elements.filter(element => element.type === TAG_FILTER_TYPE && element.name === tag)
  );
}

const rangeLabel = range => `${range.start}-${range.end}`;

function SelectedRanges({ title, selectedRanges, removeFilter }) {
  return (
    <FacetedExpandableCard title={title} openByDefault>
      {selectedRanges.map(range => (
        <ExistingValue
          key={range.start}
          value={rangeLabel(range)}
          remove={() =>
            removeFilter(
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
            )
          }
        />
      ))}
    </FacetedExpandableCard>
  );
}

function Suggestion({ range, addFilter }) {
  return (
    <div className={locals.suggestion}>
      <Link
        onClick={() => {
          addFilter(
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
          );
        }}
        className={locals.label}
      >
        {rangeLabel(range)}
      </Link>
    </div>
  );
}
