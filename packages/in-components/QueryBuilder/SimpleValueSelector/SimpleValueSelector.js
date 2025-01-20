/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Li, Ul } from '@instana/components';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import useThemedLocals from 'in-hooks/useThemedLocals';
import { number } from 'in-services/formatters/number';
import { isLoading } from 'in-services/util/result';
import Typeahead from 'in-components/Typeahead';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import styleDefs from './SimpleValueSelector.mless';

export default function SimpleValueSelector({
  onChange,
  value,
  close,
  getSuggestions,
  fieldsToWatch,
  inputProps = {},
  autoFocus = false,
  tagName,
  getSuggestionLabel
}) {
  const locals = useThemedLocals(styleDefs);

  return (
    <Typeahead
      render={render}
      resultsToShow={42}
      value={value}
      onChange={e => onChange(e.value.trim())}
      close={close}
      inputProps={{ ...inputProps, autoFocus, locals }}
      getSuggestions={getSuggestions}
      fieldsToWatch={fieldsToWatch}
      locals={locals}
      tagName={tagName}
      getSuggestionLabel={getSuggestionLabel}
    />
  );
}

function render({ inputProps, getInputProps, isOpen, openMenu, ...remainingProps }) {
  const { inputValue } = remainingProps;
  const { locals, valid, hideValidityInformationOnFocus, autoFocus, ...remainingInputProps } = inputProps;

  return (
    <>
      <Tooltip content={inputValue} align={'topMiddle'} delay={300}>
        {/*This div is used to attach the tooltip to AutosizeInput*/}
        {/*We do not want to mess with passing refs down to 3rd party dependencies which could possible break in the future,*/}
        {/*so we're using this workaround*/}
        <div>
          <AutosizeInput
            minWidth={32}
            inputClassName={classNames({
              [locals.input]: true,
              [locals.invalid]: !valid,
              [locals.hideValidityInformationOnFocus]: hideValidityInformationOnFocus
            })}
            {...remainingInputProps}
            {...getInputProps({ onFocus: openMenu })}
            autoFocus={autoFocus || isOpen}
          />
        </div>
      </Tooltip>
      {isOpen && <SuggestionsList {...remainingProps} />}
    </>
  );
}

export function SuggestionsList({
  lowerCaseInputValue,
  inputValue,
  getMenuProps,
  getSuggestions,
  getItemProps,
  highlightedIndex,
  close,
  fieldsToWatch,
  locals,
  tagName,
  getSuggestionLabel = ({ item }) => item
}) {
  const suggestionsResult = useObservable(getSuggestions, fieldsToWatch);

  if (isLoading(suggestionsResult)) {
    return <LoadingList className={locals.list} skeletonClassName={locals.skeleton} size="compact" />;
  }

  const suggestions = suggestionsResult?.data?.suggestions ?? [];
  const totalHits = suggestionsResult?.data?.totalHits ?? 0;

  const filteredOptions = suggestions.filter(
    item =>
      !inputValue ||
      item.toLowerCase().includes(lowerCaseInputValue) ||
      getSuggestionLabel({
        item,
        tagName
      })
        .toLowerCase()
        .includes(lowerCaseInputValue)
  );
  if (filteredOptions.length === 0) {
    return null;
  }

  const menuProps = getMenuProps();

  return (
    <Ul
      className={locals.list}
      aria-labelledby={menuProps['aria-labelledby']}
      id={menuProps.id}
      role={menuProps.role}
      ref={menuProps.ref}
    >
      {filteredOptions
        .filter(item => item !== '')
        .map((item, index) => {
          const itemProps = getItemProps({
            index,
            item
          });

          return (
            <OverlayOption
              key={index}
              className={classNames({
                [locals.option]: true,
                [locals.highlighted]: highlightedIndex === index
              })}
              {...itemProps}
              onChange={itemProps.onClick}
              close={close}
              value={item}
            >
              <Tooltip content={getSuggestionLabel({ item, tagName })} align={'rightMiddle'} delay={300}>
                <span className={locals.ellipsis}>{getSuggestionLabel({ item, tagName })}</span>
              </Tooltip>
            </OverlayOption>
          );
        })}
      {totalHits > suggestions.length && (
        <Li className={locals.moreOptionsLabel} size="compact">
          {number.compact(totalHits - suggestions.length)} {t('in-components:queryBuilder.simpleValueSelectorMore')}
        </Li>
      )}
    </Ul>
  );
}
