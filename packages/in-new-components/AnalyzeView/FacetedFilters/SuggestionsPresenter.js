/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import { range } from 'lodash';

import { ua2FacetedSearchFilterAddedTracker, ua2FacetedSearchGroupChangedTracker } from 'in-new-components/tracker';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { siPrefix } from 'in-services/formatters/number';
import { identity } from 'in-services/util/function';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './SuggestionsPresenter.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export default function SuggestionsPresenter({
  loading = false,
  errors = [],
  suggestions = [],
  tag,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  customLabelMapper,
  dataSource,
  enableUseAsGroup = true
}) {
  const [numberOfPresentedRows, setNumberOfPresentedRows] = useState(DEFAULT_SUGGESTIONS_SIZE);
  if (loading) {
    return <Loading numberOfRows={numberOfPresentedRows} />;
  } else if (errors?.length > 0) {
    return <Errors errors={errors} />;
  } else if (!suggestions) {
    return null;
  } else if (suggestions.length > 0) {
    return (
      <Results
        suggestions={suggestions}
        tag={tag}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
        getHrefToGroupedView={getHrefToGroupedView}
        setNumberOfPresentedRows={setNumberOfPresentedRows}
        customLabelMapper={customLabelMapper}
        dataSource={dataSource}
        enableUseAsGroup={enableUseAsGroup}
      />
    );
  } else {
    return <NoResults />;
  }
}

function Loading({ numberOfRows = 5 }) {
  return range(numberOfRows + 1).map((e, i) => (
    <div key={i} className={locals.suggestion}>
      <div className={locals.addSuggestion}>
        <Skeleton className={locals.skeletonContainer} darkMode />
      </div>
    </div>
  ));
}

function Errors({ errors }) {
  return errors.map(error => (
    <Message key={error.code} type="error" small>
      {error.message}
    </Message>
  ));
}

function Results({
  suggestions,
  tag,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  setNumberOfPresentedRows,
  customLabelMapper = identity,
  dataSource,
  enableUseAsGroup
}) {
  const [showMore, setShowMore] = useState(DEFAULT_SUGGESTIONS_SIZE);
  const nextBatch = Math.min(suggestions.length - showMore, 20);
  const presentedSuggestions = suggestions.slice(0, showMore ? showMore : undefined);

  useEffect(() => {
    setNumberOfPresentedRows(presentedSuggestions.length);
  }, [presentedSuggestions, setNumberOfPresentedRows]);

  return (
    <Stack space="small">
      {presentedSuggestions.map((suggestion, i) => {
        return (
          <div key={i} className={locals.suggestion}>
            <Tooltip
              content={
                customLabelMapper === identity
                  ? customLabelMapper(suggestion.name)
                  : `${customLabelMapper(suggestion.name)} (${suggestion.name})`
              }
              align="rightMiddle"
              delay={1000}
            >
              <Link
                href={getUpdatedTagExpressionHref({
                  add: [
                    {
                      type: TAG,
                      name: tag,
                      operator: EQUALS,
                      value: suggestion.value
                    }
                  ]
                })}
                onClick={() => ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: tag })}
                className={locals.addSuggestion}
                style={{ textDecoration: 'none' }}
              >
                <span className={locals.label}>{customLabelMapper(suggestion.name)}</span>
                {suggestion.metrics && (
                  <span className={locals.count}>
                    {siPrefix.detailed(suggestion.metrics.facetedSearchMetric[0][1])}
                  </span>
                )}
              </Link>
            </Tooltip>
          </div>
        );
      })}
      <div className={locals.buttonRow}>
        {nextBatch > 0 && (
          <Button className={locals.loadMore} kind="action" onClick={() => setShowMore(showMore + nextBatch)}>
            {t('in-new-components:analyze.loadMore')}
          </Button>
        )}
        <div />
        {enableUseAsGroup && (
          <Button
            className={locals.addAsGroup}
            kind="action"
            href={getHrefToGroupedView(tag)}
            onClick={() => ua2FacetedSearchGroupChangedTracker({ dataSource, tagName: tag })}
          >
            {t('in-new-components:analyze.addAsGroup')}
          </Button>
        )}
      </div>
    </Stack>
  );
}

function NoResults() {
  return <div>{t('in-new-components:analyze.noResults')}</div>;
}
