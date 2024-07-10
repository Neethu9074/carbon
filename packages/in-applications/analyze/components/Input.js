/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';
import React from 'react';

import { Ul } from '@instana/components';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useThemedLocals from 'in-hooks/useThemedLocals';
import { isLoading } from 'in-services/util/result';
import Typeahead from 'in-components/Typeahead';
import Tooltip from 'in-components/Tooltip';

import styleDefs from './Input.mless';

export function Input({ value, placeholder, onChange, options, valid, autoFocus = false }) {
  const locals = useThemedLocals(styleDefs);
  const result = useDebouncedValue(value, onChange, 500);
  const suggestionsResult = options;
  const totalSuggestionHits = suggestionsResult?.data?.totalHits ?? 0;

  if (!valid) {
    valid = totalSuggestionHits === 0;
  }

  return (
    <Typeahead
      render={render}
      resultsToShow={42}
      value={result.value}
      onChange={e => result.onChange(e.value.trim())}
      close={() => {}}
      inputProps={{
        type: 'text',
        valid,
        placeholder,
        hideValidityInformationOnFocus: true,
        autoFocus,
        locals
      }}
      suggestionsResult={suggestionsResult}
      locals={locals}
      autoFocus={autoFocus}
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
            autoFocus={autoFocus}
          />
        </div>
      </Tooltip>
      {isOpen && <SuggestionsList locals={locals} {...remainingProps} />}
    </>
  );
}

function SuggestionsList({
  lowerCaseInputValue,
  inputValue,
  getMenuProps,
  suggestionsResult,
  getItemProps,
  highlightedIndex,
  close,
  locals
}) {
  if (isLoading(suggestionsResult)) {
    return <LoadingList className={locals.list} skeletonClassName={locals.skeleton} size="compact" />;
  }

  const suggestions = suggestionsResult;
  const filteredOptions = suggestions?.filter(item => !inputValue || item.toLowerCase().includes(lowerCaseInputValue));
  if (filteredOptions?.length === 0) {
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
      {filteredOptions?.map((item, index) => {
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
            <Tooltip content={item} align={'rightMiddle'} delay={300}>
              <span className={locals.ellipsis}>{item}</span>
            </Tooltip>
          </OverlayOption>
        );
      })}
    </Ul>
  );
}
