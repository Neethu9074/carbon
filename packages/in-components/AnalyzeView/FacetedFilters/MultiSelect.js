/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { Stack, SearchInput, Button } from '@instana/components';

import { MultiSelectSuggestions } from 'in-components/AnalyzeView/FacetedFilters/MultiSelectSuggestions';
import { CheckableSuggestion } from 'in-components/AnalyzeView/FacetedFilters/CheckableSuggestion';
import { getFuzzyMatchingRegex } from 'in-components/AnalyzeView/fuzzyMatch';
import { useSuggestions } from 'in-components/AnalyzeView/useSuggestions';
import { compareIgnoreCase, isBlank } from 'in-services/util/string';
import { identity } from 'in-services/util/function';
import { isLoading } from 'in-services/entityUtils';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './MultiSelect.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export function MultiSelect(props) {
  const {
    tag,
    selectedValues,
    setIsDisabledWithNoValues,
    removeFromSelection,
    valueFilter,
    setValueFilter,
    resetFacets,
    tracker,
    fallbackValues
  } = props;

  const tagSuggestions$ = useSuggestions({
    ...props,
    valueFilter
  });
  useEffect(() => {
    setIsDisabledWithNoValues(
      valueFilter === '' &&
        !isLoading(tagSuggestions$) &&
        selectedValues.length === 0 &&
        tagSuggestions$?.data?.items?.length === 0 &&
        !fallbackValues &&
        !hasError(tagSuggestions$)
    );
  }, [setIsDisabledWithNoValues, valueFilter, selectedValues, tagSuggestions$, fallbackValues]);

  const loading = tagSuggestions$?.progress?.loading;
  const suggestions = tagSuggestions$?.data?.items;
  const errors = tagSuggestions$?.errors;

  const [showMore, setShowMore] = useState(DEFAULT_SUGGESTIONS_SIZE);
  const [nextBatch, setNextBatch] = useState(0);
  const [numberOfPresentedRows, setNumberOfPresentedRows] = useState(1);

  return (
    <>
      <Stack gap="xxsmall">
        {(!isBlank(valueFilter) ||
          suggestions?.length >= DEFAULT_SUGGESTIONS_SIZE ||
          selectedValues.length >= DEFAULT_SUGGESTIONS_SIZE ||
          numberOfPresentedRows >= DEFAULT_SUGGESTIONS_SIZE) && (
          <SearchInput
            onChange={setValueFilter}
            query={valueFilter}
            className={locals.searchContainer}
            inputClassName={locals.search}
            withoutIcon
            placeholder={t('in-components:searchInput.placeholderSearch')}
          />
        )}
        {selectedValues.length > 0 && (
          <CurrentSelection
            selection={selectedValues}
            onChange={selection => {
              setNumberOfPresentedRows(prev => prev + 1);
              removeFromSelection?.(selection);
            }}
            {...props}
          />
        )}
        <MultiSelectSuggestions
          suggestions={suggestions}
          loading={loading}
          errors={errors}
          alreadySelectedValues={selectedValues}
          setNextBatch={setNextBatch}
          showMore={showMore}
          numberOfPresentedRows={numberOfPresentedRows}
          setNumberOfPresentedRows={setNumberOfPresentedRows}
          tracker={tracker}
          {...props}
        />
      </Stack>
      <div className={locals.buttonRow}>
        {(suggestions?.length > 0 || (errors?.length > 0 && props.fallbackValues?.length > 0)) && nextBatch > 0 && (
          <Button className={locals.loadMore} kind="action" onClick={() => setShowMore(showMore + nextBatch)}>
            {t('in-components:analyze.loadMore')}
          </Button>
        )}
        <div />
        {selectedValues.length > 0 && (
          <Button kind="action" href={resetFacets?.(tag)} className={locals.clearFacet}>
            {t('in-components:analyze.clearFacet')}
          </Button>
        )}
      </div>
    </>
  );
}

function CurrentSelection({ selection, valueFilter, customLabelMapper = identity, onChange }) {
  const valueRegex = getFuzzyMatchingRegex(valueFilter);

  return selection
    .filter(suggestion => valueRegex.test(customLabelMapper(suggestion)))
    .sort(compareIgnoreCase)
    .map(selection => {
      return (
        <CheckableSuggestion
          key={selection}
          label={customLabelMapper(selection)}
          checked
          onChange={() => onChange(selection)}
        />
      );
    });
}
