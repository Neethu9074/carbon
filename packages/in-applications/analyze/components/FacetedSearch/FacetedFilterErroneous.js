import React from 'react';

import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import ExistingValue from 'in-applications/analyze/components/FacetedSearch/ExistingValue';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import Link from 'in-components/Link';

import locals from './Suggestion.mless';

export default function FacetedFilterErroneous({ title, tagFilterExpression, updateFilter }) {
  return (
    <FacetedExpandableCard title={title}>
      <Body tagFilterExpression={tagFilterExpression} updateFilter={updateFilter} />
    </FacetedExpandableCard>
  );
}

function Body({ tagFilterExpression, updateFilter }) {
  if (existingErroneousFilter(tagFilterExpression)) {
    return (
      <ExistingValue
        value={'Erroneous'}
        remove={() =>
          updateFilter({
            remove: [
              {
                type: TAG,
                name: 'call.erroneous',
                value: true,
                operator: EQUALS
              }
            ]
          })
        }
      />
    );
  }
  return <Suggestion updateFilter={updateFilter} tagFilterExpression={tagFilterExpression} />;
}

function Suggestion({ updateFilter, tagFilterExpression }) {
  const timeConfig = useTimeConfig();
  const suggestions = useObservable(
    getTagSuggestions({
      tagFilterExpression,
      tagName: 'call.erroneous',
      filter: {
        timeConfig: timeConfig
      },
      filterOnTagName: true,
      valueFilter: null,
      metrics: {
        calls_SUM_Agg: {
          metric: 'calls',
          aggregation: 'SUM'
        }
      }
    }),
    [tagFilterExpression]
  );

  if (suggestions?.progress.loading) {
    return (
      <div className={locals.loading}>
        <InfiniteCircle width={72} height={24} className={locals.circle} />
      </div>
    );
  }

  if (suggestions?.errors?.length > 0) {
    return (
      <>
        {suggestions?.errors.map(error => (
          <Message key={error.code} className={locals.message} type="error" small>
            {error.message}
          </Message>
        ))}
      </>
    );
  }

  if (suggestions?.data?.results?.length > 0) {
    return (
      <div className={locals.suggestion}>
        <Link
          onClick={() =>
            updateFilter({
              add: [
                {
                  type: TAG,
                  name: 'call.erroneous',
                  value: true,
                  operator: EQUALS
                }
              ]
            })
          }
          className={locals.addSuggestion}
        >
          <span className={locals.label}>Erroneous</span>
          <span className={locals.count}>
            {suggestions?.data?.results.filter(result => result.label === 'true')[0]?.metrics.calls_SUM_Agg[0][1] || 0}
          </span>
        </Link>
      </div>
    );
  }

  return <div className={locals.noResult}>No results</div>;
}

function existingErroneousFilter(tagFilterExpression) {
  return (
    (tagFilterExpression.type === EXPRESSION &&
      tagFilterExpression.logicalOperator === OPERATOR_AND &&
      tagFilterExpression.elements.filter(
        element => element.type === TAG_FILTER_TYPE && element.name === 'call.erroneous' && element.value === true
      ).length > 0) ||
    (tagFilterExpression.type === TAG_FILTER_TYPE &&
      tagFilterExpression.name === 'call.erroneous' &&
      tagFilterExpression.value === true)
  );
}
