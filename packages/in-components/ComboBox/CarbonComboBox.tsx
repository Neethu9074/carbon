/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { escapeRegExp } from 'lodash';
import classNames from 'classnames';

// Carbon version of ComboBox for single select
import { ComboBox as CarbonComboBox, ComboBoxProps as CarbonComboBoxProps } from '@instana/components';

import type { ComboBoxProps, Option } from './types';
import { t } from 'in-i18n';

import locals from './CarbonComboBox.mless';

export default function ComboBox({ ...props }: ComboBoxProps): JSX.Element {
  const { options, resultsToShow, placeholder, value, components, highlightFilter } = props;
  const [filter, setFilter] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(resultsToShow ? options.slice(0, resultsToShow) : options);

  useEffect(() => {
    setFilteredOptions(resultsToShow ? options.slice(0, resultsToShow) : options);
  }, [options, resultsToShow]);

  const selopt = value !== null && value !== undefined ? options?.find(e => e.value === value) : value;

  const getHighlightedText = (text: string | null, highlight: string | null) => {
    if (!highlight || !text) {
      return text;
    }

    const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, 'gi'));

    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            className={classNames({
              [locals.comboHighlightedText]: part.toLowerCase() === highlight.toString().toLowerCase()
            })}
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  const itemToElement = (item: any) => {
    if (components) return components.Option({ data: item, getValue: () => {} });
    if (highlightFilter) return getHighlightedText(item.label, filter);
  };

  const shouldFilterItem = (input: any) => {
    const { inputValue, item, itemToString } = input;
    const selopt = value !== null && value !== undefined ? options?.find(e => e.value === value) : value;
    if (inputValue === itemToString(selopt)) return true;
    return inputValue && inputValue !== '' && item
      ? itemToString(item).toLowerCase().includes(inputValue.toLowerCase())
      : true;
  };

  const onInputChange =
    highlightFilter || resultsToShow
      ? (input: any) => {
          setFilter(input);
          if (resultsToShow) {
            let fo = options;
            if (input && input !== '') {
              fo = options.filter(item => item.label.toLowerCase().includes(input?.toLowerCase()));
            }
            fo = fo.slice(0, resultsToShow);
            setFilteredOptions(fo);
          }
        }
      : undefined;

  const cprops: CarbonComboBoxProps = {
    ...props,
    options: filteredOptions,
    placeholder: placeholder ? placeholder : t('in-components:comboBox.placeholderSelect'),
    value: selopt as Option,
    itemToElement: components?.Option || highlightFilter ? itemToElement : undefined,
    shouldFilterItem,
    onInputChange
  };
  return <CarbonComboBox {...cprops} />;
}
