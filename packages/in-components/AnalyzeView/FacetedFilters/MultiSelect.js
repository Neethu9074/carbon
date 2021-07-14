/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import { escapeRegExp } from 'lodash';

import { Button, Link, Stack } from '@instana/components';

import { MultiSelectSuggestions } from 'in-components/AnalyzeView/FacetedFilters/MultiSelectSuggestions';
import { CheckableSuggestion } from 'in-components/AnalyzeView/FacetedFilters/CheckableSuggestion';
import { compareIgnoreCase, isBlank } from 'in-services/util/string';
import { identity } from 'in-services/util/function';
import SearchInput from 'in-components/SearchInput';
import { t } from 'in-i18n';

import locals from './MultiSelect.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export function MultiSelect(props) {
  const {
    tag,
    isLoading,
    suggestions,
    errors,
    selectedValues,
    removeFromSelection,
    valueFilter,
    setValueFilter,
    resetFacets,
    tracker
  } = props;

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
          loading={isLoading}
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
        {suggestions?.length > 0 && nextBatch > 0 && (
          <Button className={locals.loadMore} kind="action" onClick={() => setShowMore(showMore + nextBatch)}>
            {t('in-components:analyze.loadMore')}
          </Button>
        )}
        <div />
        {selectedValues.length > 0 && (
          <Link href={resetFacets?.(tag)} className={locals.clearFacet}>
            {t('in-components:analyze.clearFacet')}
          </Link>
        )}
      </div>
    </>
  );
}

function CurrentSelection({ selection, valueFilter, customLabelMapper = identity, onChange }) {
  const valueRegex = new RegExp(
    valueFilter
      .split('')
      .map(escapeRegExp)
      .join('.*'),
    'i'
  );

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
