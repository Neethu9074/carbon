/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import ExistingValue from 'in-applications/analyze/components/FacetedSearch/ExistingValue';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { ua2FacetedSearchFilterAddedTracker } from 'in-applications/tracker';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './Suggestion.mless';

export default function FacetedFilterErroneous({
  title,
  tagFilterExpression,
  hiddenCalls,
  updateFilter,
  dataSource,
  openByDefault
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <Body
        tagFilterExpression={tagFilterExpression}
        hiddenCalls={hiddenCalls}
        updateFilter={updateFilter}
        dataSource={dataSource}
      />
    </FacetedExpandableCard>
  );
}

function Body({ tagFilterExpression, updateFilter, hiddenCalls, dataSource }) {
  if (existingErroneousFilter(tagFilterExpression)) {
    return (
      <ExistingValue
        value={t('in-applications:analyze.erroneous')}
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
  return (
    <Suggestion
      updateFilter={updateFilter}
      tagFilterExpression={tagFilterExpression}
      hiddenCalls={hiddenCalls}
      dataSource={dataSource}
    />
  );
}

function Suggestion({ updateFilter, tagFilterExpression, hiddenCalls, dataSource }) {
  const timeConfig = useTimeConfig();

  const suggestions =
    useObservable(
      getTagSuggestions({
        tagFilterExpression,
        tagName: 'call.erroneous',
        filter: {
          timeConfig: timeConfig
        },
        filterOnTagName: true,
        valueFilter: null,
        includeInternal: hiddenCalls.includeInternal,
        includeSynthetic: hiddenCalls.includeSynthetic,
        metrics: dataSourceConstants[dataSource].sumMetric
      }),
      [tagFilterExpression, hiddenCalls, dataSource, timeConfig]
    ) ?? pendingResult;

  if (suggestions.progress?.loading) {
    return (
      <div className={locals.suggestion}>
        <div className={locals.addSuggestion}>
          <Skeleton className={locals.skeletonContainer} darkMode />
        </div>
      </div>
    );
  }

  if (suggestions.errors?.length > 0) {
    return (
      <>
        {suggestions.errors.map(error => (
          <Message key={error.code} className={locals.message} type="error" small>
            {error.message}
          </Message>
        ))}
      </>
    );
  }

  if (suggestions.data?.results?.length > 0) {
    return (
      <div className={locals.suggestion}>
        <Link
          onClick={() => {
            ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: 'call.erroneous' });
            updateFilter({
              add: [
                {
                  type: TAG,
                  name: 'call.erroneous',
                  value: true,
                  operator: EQUALS
                }
              ]
            });
          }}
          className={locals.addSuggestion}
        >
          <span className={locals.label}>{t('in-applications:analyze.erroneous')}</span>
          <span className={locals.count}>
            {number.compact(
              suggestions.data?.results.filter(result => result.label === 'true')[0]?.metrics[
                dataSourceConstants[dataSource].metricKey
              ][0][1] || 0
            )}
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
