/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { number } from 'in-services/formatters/number';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import { sortBy } from 'lodash';
import { t } from 'in-i18n';

import locals from './Suggestion.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export default function SuggestionsPresenter({
  loading = false,
  errors = [],
  suggestions = [],
  tag,
  updateFilter,
  dataSource,
  isValid = true
}) {
  if (loading) {
    return <Loading />;
  } else if (errors?.length > 0) {
    return <Errors errors={errors} />;
  } else if (!suggestions) {
    return null;
  } else if (suggestions.length > 0) {
    return (
      <Results
        suggestions={suggestions}
        tag={tag}
        updateFilter={updateFilter}
        dataSource={dataSource}
        isValid={isValid}
      />
    );
  } else {
    return <NoResults />;
  }
}

function Loading() {
  return (
    <div className={locals.loading}>
      <InfiniteCircle width={72} height={24} />
    </div>
  );
}

function Errors({ errors }) {
  return (
    <>
      {errors.map(error => (
        <Message key={error.code} className={locals.message} type="error" small>
          {error.message}
        </Message>
      ))}
    </>
  );
}

function Results({ suggestions, tag, updateFilter, dataSource, isValid }) {
  const [showMore, setShowMore] = useState(DEFAULT_SUGGESTIONS_SIZE);
  const nextBatch = Math.min(suggestions.length - showMore, 20);

  if (!isValid) {
    return null;
  }

  return (
    <>
      {sortBy(suggestions, suggestion => -1 * suggestion.metrics[dataSourceConstants[dataSource].metricKey][0][1])
        .slice(0, showMore ? showMore : undefined)
        .map((suggestion, i) => (
          <div key={i} className={locals.suggestion}>
            <Tooltip content={suggestion.label} align="rightMiddle">
              <Link
                onClick={() =>
                  updateFilter({
                    add: [
                      {
                        type: TAG,
                        name: tag,
                        operator: EQUALS,
                        value: suggestion.label
                      }
                    ]
                  })
                }
                className={locals.addSuggestion}
              >
                <span className={locals.label}>{suggestion.label}</span>
                <span className={locals.count}>
                  {number.compact(suggestion.metrics[dataSourceConstants[dataSource].metricKey][0][1])}
                </span>
              </Link>
            </Tooltip>
          </div>
        ))}
      {nextBatch > 0 && (
        <Button className={locals.showMore} kind="action" onClick={() => setShowMore(showMore + nextBatch)}>
          {t('in-applications:analyze.showBatchMore', { nextBatch: nextBatch })}
        </Button>
      )}
    </>
  );
}

function NoResults() {
  return <div className={locals.noResult}>{t('in-applications:analyze.noResults')}</div>;
}
