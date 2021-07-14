/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { Button, Link, Stack } from '@instana/components';

import { ua2FacetedSearchFilterAddedTracker, ua2FacetedSearchGroupChangedTracker } from 'in-components/tracker';
import { Errors, Loading } from 'in-components/AnalyzeView/FacetedFilters/Placeholders';
import { addFacetItem } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import { identity } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './SuggestionsPresenter.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

const ua2FacetedTracker = {
  groupClicked: ua2FacetedSearchGroupChangedTracker,
  suggestionClicked: ua2FacetedSearchFilterAddedTracker
};

export default function SuggestionsPresenter({
  loading = false,
  errors = [],
  suggestions = [],
  orderSuggestions,
  getMetric,
  facets,
  tag,
  entity,
  getUpdatedFacetedSearchHref,
  getHrefToGroupedView,
  customLabelMapper,
  dataSource,
  enableUseAsGroup = true,
  tracker = ua2FacetedTracker
}) {
  const [numberOfPresentedRows, setNumberOfPresentedRows] = useState(DEFAULT_SUGGESTIONS_SIZE);
  if (loading) {
    return <Loading numberOfRows={numberOfPresentedRows} />;
  } else if (errors?.length > 0) {
    return (
      <Errors
        errors={errors}
        numberOfPresentedRows={numberOfPresentedRows}
        setNumberOfPresentedRows={setNumberOfPresentedRows}
      />
    );
  } else if (!suggestions) {
    return null;
  } else if (suggestions.length > 0) {
    return (
      <Results
        suggestions={suggestions}
        getMetric={getMetric}
        orderSuggestions={orderSuggestions}
        facets={facets}
        tag={tag}
        entity={entity}
        getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
        getHrefToGroupedView={getHrefToGroupedView}
        setNumberOfPresentedRows={setNumberOfPresentedRows}
        customLabelMapper={customLabelMapper}
        dataSource={dataSource}
        enableUseAsGroup={enableUseAsGroup}
        tracker={tracker}
      />
    );
  }
  return null;
}

function Results({
  suggestions,
  getMetric,
  orderSuggestions,
  facets,
  tag,
  entity,
  getUpdatedFacetedSearchHref,
  getHrefToGroupedView,
  setNumberOfPresentedRows,
  customLabelMapper = identity,
  dataSource,
  tracker,
  enableUseAsGroup
}) {
  const [showMore, setShowMore] = useState(DEFAULT_SUGGESTIONS_SIZE);
  const nextBatch = Math.min(suggestions.length - showMore, 20);

  const presentedSuggestions = (orderSuggestions?.(suggestions) ?? suggestions).slice(
    0,
    showMore ? showMore : undefined
  );

  useEffect(() => {
    setNumberOfPresentedRows(presentedSuggestions.length);
  }, [presentedSuggestions, setNumberOfPresentedRows]);

  return (
    <Stack gap="small">
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
                href={getUpdatedFacetedSearchHref(addFacetItem(facets, tag, suggestion.value))}
                onClick={() => tracker.suggestionClicked({ dataSource, tagName: tag })}
                className={locals.addSuggestion}
                style={{ textDecoration: 'none' }}
              >
                <span className={locals.label}>{customLabelMapper(suggestion.name)}</span>
                {suggestion.metrics && (
                  <span className={locals.count}>{withSiPrefixOneDecimalPlace(getMetric(suggestion))}</span>
                )}
              </Link>
            </Tooltip>
          </div>
        );
      })}
      <div className={locals.buttonRow}>
        {nextBatch > 0 && (
          <Button className={locals.loadMore} kind="action" onClick={() => setShowMore(showMore + nextBatch)}>
            {t('in-components:analyze.loadMore')}
          </Button>
        )}
        <div />
        {enableUseAsGroup && (
          <Button
            className={locals.addAsGroup}
            kind="action"
            href={getHrefToGroupedView({ tag, tagEntity: entity })}
            onClick={() => tracker.groupClicked({ dataSource, tagName: tag })}
          >
            {t('in-components:analyze.addAsGroup')}
          </Button>
        )}
      </div>
    </Stack>
  );
}
