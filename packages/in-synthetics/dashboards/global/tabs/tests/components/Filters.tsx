/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { PaginatedResult, Result, TestResultListItem } from 'in-types';
import { FilterSectionProps } from 'in-synthetics/utils/constants';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './Filters.mless';

export default function Filters({
  isAppcontext,
  setFilter,
  result,
  syntheticTypes,
  locationIds,
  applicationIds = []
}: FilterSectionProps) {
  return (
    <Fragment>
      <ComboBox
        value={syntheticTypes}
        onChange={t => Array.isArray(t) && setFilter({ syntheticTypes: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.testList.type')}
        isMulti
        options={getSyntheticTypes(result)}
        className={locals.filter}
      />
      <ComboBox
        value={locationIds}
        onChange={t => Array.isArray(t) && setFilter({ locationIds: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.testList.locationLabel')}
        isMulti
        options={getLocationLabels(result)}
        className={locals.filter}
      />
      {!isAppcontext && (
        <ComboBox
          value={applicationIds}
          onChange={t => Array.isArray(t) && setFilter({ applicationIds: t.map(a => a.value) })}
          placeholder={t('in-synthetics:dashboard.testList.applicationLabel')}
          isMulti
          options={getApplicationLabels(result)}
          className={locals.filter}
        />
      )}
    </Fragment>
  );
}

type Option = {
  label: string;
  value: string;
};

function getSyntheticTypes(result: Result<PaginatedResult<TestResultListItem>> | undefined) {
  let syntheticTypeOptions: Option[] = [];

  // Get syntheticTypes from result
  if (!result?.progress?.loading) {
    let syntheticTypes: string[] = [];
    result?.data?.items?.forEach(function(item) {
      syntheticTypes.push(item.testResultCommonProperties?.testCommonProperties?.type ?? '');
    });

    // Clean up duplicate and empty array elements
    syntheticTypes = syntheticTypes.filter(function(item, index, arrayRef) {
      return arrayRef.indexOf(item) === index && item !== '';
    });

    syntheticTypeOptions = syntheticTypes?.map(syntheticType => {
      return {
        label: syntheticType,
        value: syntheticType
      };
    });
  }

  // return syntheticTypeOptions;
  return syntheticTypeOptions;
}

function getLocationLabels(result: Result<PaginatedResult<TestResultListItem>> | undefined) {
  let locationLabelOptions: Option[] = [];

  // Get locationDisplayLabels and locationIds from result
  if (!result?.progress?.loading) {
    result?.data?.items?.forEach((item: TestResultListItem) => {
      if (item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels) {
        item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels.forEach(
          (locationDisplayLabel, i) => {
            locationLabelOptions.push({
              label: locationDisplayLabel,
              value: item.testResultCommonProperties.testCommonProperties?.locationIds?.at(i) ?? ''
            });
          }
        );
      }
    });

    // Clean up duplicate and empty array elements
    locationLabelOptions = locationLabelOptions.filter(
      (item, index, arrayRef) =>
        index ===
        arrayRef.findIndex(t => t.label === item.label && t.value === item.value && (t.label !== '' || t.value !== ''))
    );
  }

  // return location display labels and ids;
  return locationLabelOptions;
}

function getApplicationLabels(result: Result<PaginatedResult<TestResultListItem>> | undefined) {
  let applicationLabelOptions: Option[] = [];

  // Get applicationLabels and applicationIds from result
  if (!result?.progress?.loading) {
    result?.data?.items?.forEach(function(item) {
      const applicationitem = {
        label: item.testResultCommonProperties.testCommonProperties?.applicationLabel ?? '',
        value: item.testResultCommonProperties.testCommonProperties?.applicationId ?? ''
      };
      applicationLabelOptions.push(applicationitem);
    });

    // Clean up duplicate and empty array elements
    applicationLabelOptions = applicationLabelOptions.filter(
      (item, index, arrayRef) =>
        index ===
        arrayRef.findIndex(t => t.label === item.label && t.value === item.value && (t.label !== '' || t.value !== ''))
    );
  }

  // return application labels and ids;
  return applicationLabelOptions;
}
