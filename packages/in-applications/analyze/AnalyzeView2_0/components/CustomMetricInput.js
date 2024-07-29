/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';
import React from 'react';

import { Li, Ul } from '@instana/components';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useThemedLocals from 'in-hooks/useThemedLocals';
import { isLoading } from 'in-services/util/result';
import Typeahead from 'in-components/Typeahead';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import styleDefs from './CustomMetricInput.mless';

export function CustomMetricInput({ value, onChange, options = [] }) {
  const locals = useThemedLocals(styleDefs);
  const result = useDebouncedValue(value, onChange, 500);
  return (
    <Typeahead
      render={render}
      resultsToShow={42}
      value={result.value}
      onChange={e => result.onChange(e.value.trim())}
      close={() => {}}
      inputProps={{
        type: 'text',
        locals
      }}
      suggestionsResult={options}
      locals={locals}
    />
  );
}

function render({ inputProps, getInputProps, isOpen, openMenu, value, ...remainingProps }) {
  const { inputValue } = remainingProps;
  const { locals, ...remainingInputProps } = inputProps;

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
              [locals.input]: true
            })}
            {...remainingInputProps}
            {...getInputProps({ onFocus: openMenu })}
          />
        </div>
      </Tooltip>
      {(isOpen || !value) && <SuggestionsList locals={locals} {...remainingProps} />}
    </>
  );
}

function SuggestionsList({
  lowerCaseInputValue,
  inputValue,
  getMenuProps,
  suggestionsResult,
  getItemProps,
  close,
  locals
}) {
  if (isLoading(suggestionsResult)) {
    return <LoadingList className={locals.list} skeletonClassName={locals.skeleton} size="compact" />;
  }

  const filteredOptions = suggestionsResult?.filter(
    item => !inputValue || item.toLowerCase().includes(lowerCaseInputValue)
  );

  const menuProps = getMenuProps();
  if (suggestionsResult?.length && !filteredOptions?.length) {
    return null;
  }
  return (
    <Ul
      className={locals.list}
      aria-labelledby={menuProps['aria-labelledby']}
      {...getMenuProps({}, { suppressRefError: true })}
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
              [locals.option]: true
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
      {!suggestionsResult?.length && (
        <Li className={locals.noCustomMetricsLabel} size="compact">
          {t('in-applications:analyze.noAvailableCustomMetrics')}
        </Li>
      )}
    </Ul>
  );
}
