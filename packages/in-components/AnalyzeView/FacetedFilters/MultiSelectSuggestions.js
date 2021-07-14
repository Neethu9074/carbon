/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useMemo } from 'react';

import { CheckableSuggestion } from 'in-components/AnalyzeView/FacetedFilters/CheckableSuggestion';
import { Errors, Loading } from 'in-components/AnalyzeView/FacetedFilters/Placeholders';
import { identity } from 'in-services/util/function';

import locals from './MultiSelectSuggestions.mless';

export function MultiSelectSuggestions({
  tag,
  dataSource,
  loading = false,
  suggestions,
  errors,
  orderSuggestions,
  showMore,
  setNextBatch,
  getMetric,
  alreadySelectedValues = [],
  numberOfPresentedRows,
  setNumberOfPresentedRows,
  addToSelection,
  customLabelMapper,
  tracker
}) {
  if (loading) {
    return <Loading numberOfRows={numberOfPresentedRows} loadingSkeletonClass={locals.multiselectPlaceholder} />;
  } else if (errors?.length > 0) {
    return <Errors errors={errors} setNumberOfPresentedRows={setNumberOfPresentedRows} />;
  } else if (!suggestions) {
    return null;
  } else if (suggestions?.length > 0) {
    return (
      <Suggestions
        tag={tag}
        dataSource={dataSource}
        suggestions={suggestions}
        orderSuggestions={orderSuggestions}
        getMetric={getMetric}
        selection={alreadySelectedValues}
        setNumberOfPresentedRows={setNumberOfPresentedRows}
        showMore={showMore}
        setNextBatch={setNextBatch}
        customLabelMapper={customLabelMapper}
        addToSelection={addToSelection}
        tracker={tracker}
      />
    );
  }
  return null;
}

function Suggestions({
  tag,
  dataSource,
  suggestions,
  orderSuggestions,
  getMetric,
  selection,
  setNumberOfPresentedRows,
  showMore,
  setNextBatch,
  customLabelMapper = identity,
  addToSelection,
  tracker
}) {
  const presentedSuggestions = useMemo(
    () =>
      (orderSuggestions?.(suggestions) ?? suggestions)
        .filter(possibleSuggestion => selection.indexOf(possibleSuggestion.value) === -1)
        .slice(0, showMore ? showMore : undefined),
    [suggestions, orderSuggestions, selection, showMore]
  );

  useEffect(() => {
    setNumberOfPresentedRows(presentedSuggestions.length);
    setNextBatch(Math.min(suggestions.length - showMore, 20));
  }, [showMore, suggestions, presentedSuggestions, setNumberOfPresentedRows, setNextBatch]);

  return presentedSuggestions.map((suggestion, idx) => {
    return (
      <CheckableSuggestion
        key={idx}
        label={customLabelMapper(suggestion.name)}
        checked={false}
        count={getMetric(suggestion)}
        onChange={() => {
          setNumberOfPresentedRows(prev => Math.max(prev - 1, 0));
          tracker.suggestionClicked({ dataSource, tagName: tag });
          addToSelection?.(suggestion.value);
        }}
      />
    );
  });
}
