import React from 'react';
import Downshift from 'downshift';

import { evaluateClassNames } from 'in-services/util/classnames';
import { getPlainMetricList } from 'in-sdk/metrics';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './MetricSelector.mless';

export default function MetricSelector({ plugin, onChange, value, metrics }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : getPlainMetricList(plugin);

  return <AutoComplete value={value} resultsToShow={100} options={metricsList} onChange={onChange} />;
}

const AutoComplete = ({ options, resultsToShow, placeholder, onChange }) => (
  <Downshift itemToString={item => (item ? item.label : '')} onChange={onChange}>
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
