/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import { range } from 'lodash';

import { LoadingSkeleton } from '@instana/components';
import { Button } from '@instana/components';
import { Link } from '@instana/components';

import { ua2FacetedSearchFilterAddedTracker, ua2FacetedSearchGroupChangedTracker } from 'in-applications/tracker';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { identity } from 'in-services/util/function';
import Message from 'in-new-components/Message';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Suggestion.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export default function SuggestionsPresenter({
  loading = false,
  errors = [],
  suggestions = [],
  tag,
  entity,
  updateFilter,
  updateGroup,
  dataSource,
  customLabelMapper,
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
        entity={entity}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        dataSource={dataSource}
        setNumberOfPresentedRows={setNumberOfPresentedRows}
        customLabelMapper={customLabelMapper}
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
        <LoadingSkeleton className={locals.skeletonContainer} darkMode />
      </div>
    </div>
  ));
}

function Errors({ errors }) {
  return errors.map(error => (
    <Message key={error.code} className={locals.message} type="error" small>
      {error.message}
    </Message>
  ));
}

function Results({
  suggestions,
  tag,
  entity,
  updateFilter,
  updateGroup,
  dataSource,
  setNumberOfPresentedRows,
  customLabelMapper = identity,
  enableUseAsGroup
}) {
  const [showMore, setShowMore] = useState(DEFAULT_SUGGESTIONS_SIZE);
  const nextBatch = Math.min(suggestions.length - showMore, 20);
  const presentedSuggestions = sortBy(
    suggestions,
    suggestion => -1 * suggestion.metrics[dataSourceConstants[dataSource].metricKey][0][1]
  ).slice(0, showMore ? showMore : undefined);

  useEffect(() => {
    setNumberOfPresentedRows(presentedSuggestions.length);
  }, [presentedSuggestions, setNumberOfPresentedRows]);

  return (
    <>
      {presentedSuggestions.map((suggestion, i) => {
        return (
          <div key={i} className={locals.suggestion}>
            <Tooltip
              content={
                customLabelMapper === identity
                  ? customLabelMapper(suggestion.label)
                  : `${customLabelMapper(suggestion.label)} (${suggestion.label})`
              }
              align="rightMiddle"
              delay={1000}
            >
              <Link
                onClick={() => {
                  ua2FacetedSearchFilterAddedTracker({ dataSource, tagName: tag });
                  updateFilter({
                    add: [
                      {
                        type: TAG,
                        name: tag,
                        operator: EQUALS,
                        value: suggestion.value
                      }
                    ]
                  });
                }}
                className={locals.addSuggestion}
              >
                <span className={locals.label}>{customLabelMapper(suggestion.label)}</span>
                <span className={locals.count}>
                  {withSiPrefixOneDecimalPlace(suggestion.metrics[dataSourceConstants[dataSource].metricKey][0][1])}
                </span>
              </Link>
            </Tooltip>
          </div>
        );
      })}
      <div className={locals.buttonRow}>
        {nextBatch > 0 && (
          <Button className={locals.loadMore} kind="action" onClick={() => setShowMore(showMore + nextBatch)}>
            {t('in-applications:analyze.loadMore')}
          </Button>
        )}
        <div />
        {enableUseAsGroup && (
          <Button
            className={locals.addAsGroup}
            kind="action"
            onClick={() => {
              ua2FacetedSearchGroupChangedTracker({ dataSource, tagName: tag });
              updateGroup({
                groupbyTag: tag,
                ...(entity && { groupbyTagEntity: entity })
              });
            }}
          >
            {t('in-new-components:analyze.addAsGroup')}
          </Button>
        )}
      </div>
    </>
  );
}

function NoResults() {
  return <div className={locals.noResult}>{t('in-applications:analyze.noResults')}</div>;
}
