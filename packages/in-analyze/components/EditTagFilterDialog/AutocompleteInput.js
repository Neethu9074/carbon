import Downshift from 'downshift';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './AutocompleteInput.mless';

export default function AutocompleteInput({ options, placeholder, onChange, resultsToShow = 50 }) {
  return (
    <Downshift onChange={onChange} itemToString={item => (item ? item.value : '')}>
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
        const filteredOptions = options.filter(item => !inputValue || item.label.includes(inputValue));

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
            <ul
              className={evaluateClassNames({
                [locals.list]: isOpen,
                [locals.listClosed]: !isOpen
              })}
              {...getMenuProps()}
            >
              {isOpen &&
                filteredOptions.length === 0 && (
                  <li key="noresult" className={locals.listItemNoResult}>
                    No results found
                  </li>
                )}
              {isOpen
                ? filteredOptions.slice(0, resultsToShow).map((item, index) => (
                    <li
                      className={locals.listItem}
                      {...getItemProps({
                        key: item.value,
                        index,
                        item,
                        style: {
                          backgroundColor: highlightedIndex === index ? '#edf5ff' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal'
                        }
                      })}
                    >
                      {getHighlightedText(item.label, inputValue)}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        );
      }}
    </Downshift>
  );
}

function getHighlightedText(text, higlight) {
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
