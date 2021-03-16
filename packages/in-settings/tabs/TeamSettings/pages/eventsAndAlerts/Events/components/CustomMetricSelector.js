/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { escapeRegExp } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './CustomMetricSelector.mless';

export default function CustomMetricSelector({ onChange, value, metrics }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : [];
  const parentItemForValue = metricsList.find(it => it.value === value);

  return (
    <AutoComplete
      value={value}
      resultsToShow={100}
      options={metricsList}
      onChange={onChange}
      item={parentItemForValue}
    />
  );
}

CustomMetricSelector.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
  onChange: PropTypes.func
};

const AutoComplete = ({ options, resultsToShow, placeholder, onChange, item }) => (
  <Downshift itemToString={item => (item ? item.label : '')} onChange={onChange} initialSelectedItem={item}>
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
      openMenu,
      getToggleButtonProps
    }) => {
      const lowerCaseInputValue = inputValue.toLowerCase();
      const filteredOptions = options.filter(
        item => !inputValue || item.label.toLowerCase().includes(lowerCaseInputValue)
      );

      return (
        <div className={locals.wrapper}>
          <div
            className={classNames({
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
              className={classNames({
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
                        key: item.label,
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
          )}
        </div>
      );
    }}
  </Downshift>
);

function getHighlightedText(text, highlight) {
  if (!highlight) {
    return text;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={classNames({
            [locals.higlightedText]: part.toLowerCase() === highlight.toString().toLowerCase()
          })}
        >
          {part}
        </span>
      ))}
    </span>
  );
}
