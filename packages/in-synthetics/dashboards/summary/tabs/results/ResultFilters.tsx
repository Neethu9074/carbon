/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { ResultsFilterSectionProps, failureValue, successValue } from 'in-synthetics/utils/constants';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './ResultFilters.mless';

export default function ResultFilters({
  setFilter,
  status,
  locationLabels,
  locationsDisplayLabels
}: ResultsFilterSectionProps) {
  return (
    <Fragment>
      <ComboBox
        value={status}
        onChange={t => Array.isArray(t) && setFilter({ status: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.resultsListPage.status')}
        isMulti
        options={getStatusOptions()}
        className={locals.filter}
      />
      <ComboBox
        value={locationLabels}
        onChange={t => Array.isArray(t) && setFilter({ locationLabels: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.resultsListPage.locationLabel')}
        isMulti
        options={getDisplayLabels(locationsDisplayLabels)}
        className={locals.filter}
      />
    </Fragment>
  );
}

type Option = {
  label: string;
  value: string;
};

function getStatusOptions() {
  const statusOptions: Option[] = [
    {
      label: t('in-synthetics:dashboard.resultsListPage.failures'),
      value: failureValue
    },
    {
      label: t('in-synthetics:dashboard.resultsListPage.success'),
      value: successValue
    }
  ];

  return statusOptions;
}

function getDisplayLabels(labels: string[]) {
  let locationLabelOptions: Option[] = [];

  labels.forEach((locationDisplayLabel: string) => {
    locationLabelOptions.push({
      label: locationDisplayLabel,
      value: locationDisplayLabel
    });
  });

  return locationLabelOptions;
}
