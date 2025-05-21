/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { escapeRegExp } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { ComboBox as CarbonComboBox, Typography } from '@instana/components';
import { LoadingSpinner } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { fillMetricType } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/ConditionItem';
import { getCustomMetricOptions } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { t } from 'in-i18n';

import locals from './CustomMetricSelector.mless';

export default function CustomMetricSelector({
  onChange,
  value,
  metrics,
  disabled,
  id,
  form,
  entityType,
  metricOnChange
}) {
  const { metricsList, parentItemForValue } = getItemForValue(metrics, value);

  return (
    <AutoComplete
      disabled={disabled}
      value={value}
      resultsToShow={100}
      options={metricsList}
      onChange={onChange}
      item={parentItemForValue}
      id={id}
      form={form}
      entityType={entityType}
      metricOnChange={metricOnChange}
    />
  );
}

CustomMetricSelector.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  form: PropTypes.object.isRequired,
  entityType: PropTypes.string.isRequired,
  metricOnChange: PropTypes.func
};

const AutoComplete = ({
  options,
  placeholder,
  resultsToShow,
  onChange,
  item,
  value,
  disabled,
  id,
  form,
  entityType,
  metricOnChange
}) => {
  const [searchKey, setSearchKey] = useState(null);
  const [userHasTyped, setUserHasTyped] = useState(false);

  const debounceOnChange = useMemo(
    () =>
      debounce(input => {
        setSearchKey(input);
      }, 600),
    []
  );

  const handleInputChange = inputText => {
    debounceOnChange(inputText);
  };

  const customMetrics = useObservable(() => {
    if (searchKey) {
      return getCustomMetricOptions(form, entityType, searchKey);
    }
    return null;
  }, [searchKey]);

  useEffect(() => {
    if (customMetrics?.length > 0) {
      setUserHasTyped(false);
    }
  }, [customMetrics]);

  const getHighlightedText = (text, highlight) => {
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

  const metricName = form.get('metricName')?.value;
  const filledMetrics = fillMetricType(customMetrics, metricName);

  const { metricsList, parentItemForValue } = getItemForValue(filledMetrics, value);

  const searchItemExists = searchKey && customMetrics?.length > 0;
  const defaultValue = searchItemExists ? parentItemForValue : item;

  const selOpt = options?.find(e => e.value === value) ?? value;
  const defOpt = options?.find(e => e.value === defaultValue) ?? selOpt;

  const placeholderText = placeholder || t('in-components:comboBox.placeholderSelect');

  const optionsList = getOptionsList(customMetrics, searchItemExists, metricsList, options, searchKey);

  return (
    <div className={locals.gap}>
      <div className={locals.elementsWrapper}>
        <CarbonComboBox
          itemToString={item => item?.label || ''}
          itemToElement={item => getHighlightedText(item?.label, searchKey) || ''}
          onChange={val => {
            if (typeof val === 'object') {
              setSearchKey(null);
              onChange(val, metricOnChange, searchItemExists ? metricsList : options);
            }
          }}
          isClearable
          onInputChange={inputText => {
            if (selOpt?.label !== inputText) {
              handleInputChange(inputText);
              setUserHasTyped(true);
            }
          }}
          defaultValue={defOpt}
          value={selOpt}
          options={optionsList}
          placeholder={placeholderText}
          disabled={disabled}
          id={id}
          highlightFilter
          resultsToShow={resultsToShow}
          allowCustomValue
        />
        {customMetrics === undefined && searchKey && userHasTyped && <LoadingSpinner small withOverlay={false} />}
      </div>
      {customMetrics?.length === 0 && <Typography variant="body-small"> {t('in-events:noMetricsFound')} </Typography>}
    </div>
  );
};

function getItemForValue(metrics, value) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : [];
  const parentItemForValue = metricsList.find(it => it.value === value);
  return { metricsList, parentItemForValue };
}

function getOptionsList(customMetrics, isSearchMode, metricsList, options, searchKey) {
  if (!searchKey) {
    return options;
  }
  if (customMetrics === undefined || customMetrics?.length === 0) {
    return [];
  }

  return isSearchMode ? metricsList : options;
}
