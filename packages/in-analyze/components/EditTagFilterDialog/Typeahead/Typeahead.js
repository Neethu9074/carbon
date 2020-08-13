import Downshift from 'downshift';
import React from 'react';

import DefaultRenderer from 'in-analyze/components/EditTagFilterDialog/Typeahead/DefaultRenderer';
import DefaultInput from 'in-analyze/components/EditTagFilterDialog/Typeahead/DefaultInput';

import locals from './Typeahead.mless';

export default function Typeahead({
  options,
  placeholder,
  value,
  onChange,
  resultsToShow = 50,
  maxLength = 512,
  InputRenderer = DefaultInput,
  ListRenderer = DefaultRenderer,
  ...remainingProps
}) {
  const handleStateChange = changes => {
    if (changes.hasOwnProperty('selectedItem')) {
      onChange({ value: changes.selectedItem || '' });
    } else if (changes.hasOwnProperty('inputValue')) {
      onChange({ value: changes.inputValue || '' });
    }
  };

  return (
    <Downshift selectedItem={value} onStateChange={handleStateChange}>
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
        openMenu
      }) => {
        const lowerCaseInputValue = inputValue.toLowerCase();
        const filteredOptions = options
          .map(item => item.substring(0, maxLength))
          .filter(item => !inputValue || item.toLowerCase().includes(lowerCaseInputValue));

        return (
          <div className={locals.wrapper}>
            <InputRenderer
              isOpen={isOpen}
              getInputProps={getInputProps}
              getToggleButtonProps={getToggleButtonProps}
              openMenu={openMenu}
              placeholder={placeholder}
              maxLength={maxLength}
            />
            {isOpen && filteredOptions.length > 0 && (
              <ListRenderer
                {...remainingProps}
                onChange={onChange}
                getItemProps={getItemProps}
                getMenuProps={getMenuProps}
                filteredOptions={filteredOptions.slice(0, resultsToShow)}
                highlightedIndex={highlightedIndex}
                selectedItem={selectedItem}
                inputValue={inputValue}
              />
            )}
          </div>
        );
      }}
    </Downshift>
  );
}
