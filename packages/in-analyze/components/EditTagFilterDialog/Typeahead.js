import Downshift from 'downshift';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './Typeahead.mless';

export default function Typeahead({ options, placeholder, value, onChange, resultsToShow = 50 }) {
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
        const filteredOptions = options.filter(item => !inputValue || item.toLowerCase().includes(lowerCaseInputValue));

        return (
          <div className={locals.wrapper}>
            <div
              className={evaluateClassNames({
                [locals.inputGroup]: true,
                [locals.inputGroupOpen]: isOpen
              })}
            >
              <input className={locals.input} {...getInputProps({ onFocus: openMenu })} placeholder={placeholder} />
              <SvgIcon
                className={locals.toggleButton}
                {...getToggleButtonProps()}
                type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
              />
            </div>
            {filteredOptions.length > 0 && (
              <ul
                className={evaluateClassNames({
                  [locals.list]: isOpen,
                  [locals.listClosed]: !isOpen
                })}
                {...getMenuProps()}
              >
                {isOpen
                  ? filteredOptions.slice(0, resultsToShow).map((item, index) => (
                      <li
                        className={locals.listItem}
                        {...getItemProps({
                          key: item,
                          index,
                          item,
                          style: {
                            backgroundColor: highlightedIndex === index ? '#edf5ff' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal'
                          }
                        })}
                      >
                        {getHighlightedText(item, inputValue)}
                      </li>
                    ))
                  : null}
              </ul>
            )}
          </div>
        );
      }}
    </Downshift>
  );
}

function getHighlightedText(text, higlight) {
  if (!higlight) {
    return text;
  }
  const parts = text.split(new RegExp(`(${higlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={evaluateClassNames({
            [locals.higlightedText]: part.toLowerCase() === higlight.toString().toLowerCase()
          })}
        >
          {part}
        </span>
      ))}
    </span>
  );
}
