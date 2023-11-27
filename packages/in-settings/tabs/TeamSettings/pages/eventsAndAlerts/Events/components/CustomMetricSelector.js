/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { escapeRegExp } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import React from 'react';

import { SvgIcon } from '@instana/components';

import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './CustomMetricSelector.mless';

export default function CustomMetricSelector({ onChange, value, metrics, disabled }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : [];
  const parentItemForValue = metricsList.find(it => it.value === value);

  return (
    <AutoComplete
      disabled={disabled}
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
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const AutoComplete = ({ options, resultsToShow, placeholder, onChange, item, disabled }) => (
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
      let filteredOptions = options.filter(
        item => !inputValue || item.label.toLowerCase().includes(lowerCaseInputValue)
      );
      const toggleButtonProps = getToggleButtonProps();
      const onClick = disabled ? undefined : toggleButtonProps.onClick;

      function metricClearClick() {
        onChange('metricName', '', updatedForm => {
          updatedForm = updatedForm
            .updateIn(['formatter'], f => f.setValue(null).setTouched(false))
            .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
            .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));
          return updatedForm;
        });
      }
      return (
        <div className={locals.wrapper}>
          <div
            className={classNames({
              [locals.inputGroup]: true,
              [locals.inputGroupOpen]: isOpen
            })}
          >
            <Input
              disabled={disabled}
              className={locals.input}
              {...getInputProps({ onFocus: openMenu })}
              placeholder={placeholder}
            />
            <SvgIcon
              className={locals.toggleButton}
              {...toggleButtonProps}
              onClick={onClick}
              type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
            />
            {selectedItem && (
              <Tooltip content={t('in-settings:tabs.team.events.clearMetricSeclection')} align="topMiddle" delay={300}>
                <SvgIcon className={locals.clearButton} onClick={metricClearClick} type="lib_openclose_cancel" />
              </Tooltip>
            )}
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
