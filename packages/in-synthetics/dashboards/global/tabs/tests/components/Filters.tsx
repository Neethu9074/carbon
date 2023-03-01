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

type Option = {
  label: string;
  value: string;
};

let syntheticTypeOptions: Option[] = [];
let locationLabelOptions: Option[] = [];
let applicationLabelOptions: Option[] = [];

export default function Filters({
  isAppcontext,
  setFilter,
  result,
  syntheticTypes,
  locationIds,
  applicationIds = []
}: FilterSectionProps) {
  let useTypeOptions: boolean = syntheticTypes != null && syntheticTypes.length > 0 ? true : false;
  let useLocationOptions: boolean = locationIds != null && locationIds.length > 0 ? true : false;
  let useApplicationOptions: boolean = applicationIds.length > 0 ? true : false;

  let resetOptions: boolean =
    syntheticTypes == null ||
    syntheticTypes.length == 0 ||
    locationIds == null ||
    locationIds.length == 0 ||
    applicationIds == null ||
    applicationIds.length == 0
      ? true
      : false;

  return (
    <Fragment>
      <ComboBox
        value={syntheticTypes}
        onChange={t => Array.isArray(t) && setFilter({ syntheticTypes: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.testList.type')}
        isMulti
        options={syntheticTypeOptions.length > 0 && useTypeOptions ? syntheticTypeOptions : getSyntheticTypes(result)}
        className={locals.filter}
      />
      <ComboBox
        value={locationIds}
        onChange={t => Array.isArray(t) && setFilter({ locationIds: t.map(a => a.value) })}
        placeholder={t('in-synthetics:dashboard.testList.locationLabel')}
        isMulti
        options={
          locationLabelOptions.length > 0 && useLocationOptions
            ? locationLabelOptions
            : getLocationLabels(result, resetOptions)
        }
        className={locals.filter}
      />
      {!isAppcontext && (
        <ComboBox
          value={applicationIds}
          onChange={t => Array.isArray(t) && setFilter({ applicationIds: t.map(a => a.value) })}
          placeholder={t('in-synthetics:dashboard.testList.applicationLabel')}
          isMulti
          options={
            applicationLabelOptions.length > 0 && useApplicationOptions
              ? applicationLabelOptions
              : getApplicationLabels(result, resetOptions)
          }
          className={locals.filter}
        />
      )}
    </Fragment>
  );
}

function getSyntheticTypes(result: Result<PaginatedResult<TestResultListItem>> | undefined) {
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

function getLocationLabels(result: Result<PaginatedResult<TestResultListItem>> | undefined, resetOptions: boolean) {
  // Reset locationLabelOptions
  if (resetOptions) {
    locationLabelOptions = [];
  }

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

function getApplicationLabels(result: Result<PaginatedResult<TestResultListItem>> | undefined, resetOptions: boolean) {
  // Reset applicationLabelOptions
  if (resetOptions) {
    applicationLabelOptions = [];
  }

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
