/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Downshift from 'downshift';
import React from 'react';

import DefaultRenderer from 'in-components/Typeahead/DefaultRenderer';
import DefaultInput from 'in-components/Typeahead/DefaultInput';

import locals from './Typeahead.mless';

export default function Typeahead({ value, onChange, render = renderDefault, ...remainingProps }) {
  const handleStateChange = changes => {
    if (changes.hasOwnProperty('selectedItem')) {
      onChange({ value: changes.selectedItem || '' });
    } else if (changes.hasOwnProperty('inputValue')) {
      onChange({ value: changes.inputValue || '' });
    }
  };

  return (
    <Downshift selectedItem={value} onStateChange={handleStateChange}>
      {downShiftProps => {
        const lowerCaseInputValue = downShiftProps.inputValue.toLowerCase();
        return (
          <div className={locals.wrapper}>{render({ lowerCaseInputValue, ...downShiftProps, ...remainingProps })}</div>
        );
      }}
    </Downshift>
  );
}

function renderDefault({
  options,
  placeholder,
  resultsToShow = 50,
  maxLength = 512,
  InputRenderer = DefaultInput,
  ListRenderer = DefaultRenderer,
  inputProps,
  getInputProps,
  lowerCaseInputValue,
  isOpen,
  inputValue,
  getToggleButtonProps,
  openMenu,
  ...remainingProps
}) {
  const filteredOptions = options
    .map(item => item.substring(0, maxLength))
    .filter(item => !inputValue || item.toLowerCase().includes(lowerCaseInputValue));
  return (
    <>
      <InputRenderer
        isOpen={isOpen}
        getInputProps={getInputProps}
        getToggleButtonProps={getToggleButtonProps}
        openMenu={openMenu}
        placeholder={placeholder}
        maxLength={maxLength}
        {...inputProps}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ListRenderer
          {...remainingProps}
          filteredOptions={filteredOptions.slice(0, resultsToShow)}
          options={options}
          inputValue={inputValue}
        />
      )}
    </>
  );
}
