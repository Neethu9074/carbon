/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { Link, Stack, Button } from '@instana/components';

import { approximateValueIndicator } from 'in-components/AnalyzeView/FacetedFilters/approximateValueIndicator';
import { Errors, Loading } from 'in-components/AnalyzeView/FacetedFilters/Placeholders';
import { addFacetItem } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import { twoDigitApproximation } from 'in-components/AnalyzeView/utils.ts';
import { identity } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './SuggestionsPresenter.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export default function SuggestionsPresenter({
  loading = false,
  errors = [],
  suggestions = [],
  orderSuggestions,
  getMetric,
  facets,
  tag,
  getUpdatedFacetedSearchHref,
  customLabelMapper,
  dataSource,
  tracker,
  fallbackValues
}) {
  const [numberOfPresentedRows, setNumberOfPresentedRows] = useState(DEFAULT_SUGGESTIONS_SIZE);
  if (loading) {
    return <Loading numberOfRows={numberOfPresentedRows} />;
  } else if (errors?.length > 0) {
    if (fallbackValues?.length > 0) {
      return (
        <Results
          suggestions={fallbackValues}
          getMetric={getDefaultMetric}
          orderSuggestions={orderSuggestions}
          facets={facets}
          tag={tag}
          getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
          setNumberOfPresentedRows={setNumberOfPresentedRows}
          customLabelMapper={customLabelMapper}
          dataSource={dataSource}
          tracker={tracker}
        />
      );
    } else {
      return (
        <Errors
          errors={errors}
          numberOfPresentedRows={numberOfPresentedRows}
          setNumberOfPresentedRows={setNumberOfPresentedRows}
        />
      );
    }
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
        getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
        setNumberOfPresentedRows={setNumberOfPresentedRows}
        customLabelMapper={customLabelMapper}
        dataSource={dataSource}
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
  getUpdatedFacetedSearchHref,
  setNumberOfPresentedRows,
  customLabelMapper = identity,
  dataSource,
  tracker
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
              overwriteBlock
            >
              <Link
                href={getUpdatedFacetedSearchHref(addFacetItem(facets, tag, suggestion.value))}
                onClick={() => tracker.suggestionClicked({ dataSource, tagName: tag })}
                className={locals.addSuggestion}
                style={{ textDecoration: 'none' }}
              >
                <span className={locals.label}>{customLabelMapper(suggestion.name)}</span>
                {suggestion.metrics && (
                  <div className={locals.count}>
                    <span>{approximateValueIndicator} </span>
                    <span>{withSiPrefixOneDecimalPlace(twoDigitApproximation(getMetric(suggestion)))}</span>
                  </div>
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
      </div>
    </Stack>
  );
}

function getDefaultMetric() {
  return '';
}
