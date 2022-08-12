/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { TestResultListItem } from '@instana/types';

import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './Filters.mless';

type filterProps = {
  /*
  locationLabels: string[];
  applicationLabels: string[];
  syntheticTypes: string[];*/
  setFilter: any;
  props: ServerTablePresenterProps<TestResultListItem>;
};

export default function Filters({ setFilter, props }: filterProps) {
  const syntheticTypes: string[] = getSyntheticTypes(props);
  return (
    <Fragment>
      <ComboBox
        value={syntheticTypes}
        onChange={t => setFilter({ anyOption: t ? t : '' })}
        placeholder={t('in-synthetics:dashboard.testList.type')}
        isMulti
        options={getSyntheticTypeComboboxItems(syntheticTypes)}
        className={locals.filter}
      />
      <ComboBox
        value={getLocationLabels(props)}
        onChange={t => setFilter({ anyOption: t ? t : '' })}
        placeholder={t('in-synthetics:dashboard.testList.locationLabel')}
        isMulti
        options={[]}
        className={locals.filter}
      />
      <ComboBox
        value={getApplicationLabels(props)}
        onChange={t => setFilter({ anyOption: t ? t : null })}
        placeholder={t('in-synthetics:dashboard.testList.applicationLabel')}
        isMulti
        options={[]}
        className={locals.filter}
      />
    </Fragment>
  );
}

type Option = {
  label: string;
  value: string;
};

function getSyntheticTypeComboboxItems(syntheticTypes: string[]) {
  let syntheticTypeOptions: Option[] = syntheticTypes?.map(syntheticType => {
    return {
      label: syntheticType,
      value: syntheticType
    };
  });
  return syntheticTypeOptions;
}

function getSyntheticTypes(props: ServerTablePresenterProps<TestResultListItem>) {
  let syntheticTypes: string[] = [];

  //Get labels from results
  if (!props.result?.progress) {
    props?.result?.data?.items?.forEach(function(item) {
      syntheticTypes.push(item.testResultCommonProperties?.testCommonProperties?.type ?? '');
    });
  }
  //Clean up duplicate array elements
  syntheticTypes = syntheticTypes.filter(function(item, index, arrayRef) {
    return arrayRef.indexOf(item) === index;
  });

  return syntheticTypes;
}

function getLocationLabels(props: ServerTablePresenterProps<TestResultListItem>) {
  let locationLabels: string[] = [];

  //Get labels from results
  props?.result?.data?.items?.forEach(function(item) {
    locationLabels.push(item.testResultCommonProperties?.locationLabel ?? '');
  });
  //Clean up duplicate array elements
  locationLabels = locationLabels.filter(function(item, index, arrayRef) {
    return arrayRef.indexOf(item) === index;
  });

  return locationLabels;
}

function getApplicationLabels(props: ServerTablePresenterProps<TestResultListItem>) {
  let applicationLabels: string[] = [];

  //Get labels from results
  props?.result?.data?.items?.forEach(function(item) {
    applicationLabels.push(item.testResultCommonProperties.testCommonProperties?.applicationLabel ?? '');
  });
  //Clean up duplicate array elements
  applicationLabels = applicationLabels.filter(function(item, index, arrayRef) {
    return arrayRef.indexOf(item) === index;
  });

  return applicationLabels;
}
