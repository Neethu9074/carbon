/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { Result, SyntheticTest } from '@instana/types';

import { syntheticDnsEnabled, syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { association, FilterSectionProps } from 'in-synthetics/utils/constants';
import { getDisplayType } from 'in-synthetics/utils/syntheticTypeMap';
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
  isAssociationsContext,
  setFilter,
  result,
  syntheticTypes,
  locationIds,
  applicationIds = [],
  entityIds = []
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
      {!isAssociationsContext && (
        <ComboBox
          value={syntheticRbacLimitedEnabled ? entityIds : applicationIds}
          onChange={t =>
            Array.isArray(t) &&
            setFilter(
              syntheticRbacLimitedEnabled ? { entityIds: t.map(a => a.value) } : { applicationIds: t.map(a => a.value) }
            )
          }
          placeholder={t('in-synthetics:dashboard.testList.associationLabel')}
          isMulti
          options={syntheticRbacLimitedEnabled ? getAssociationLabels(result) : getApplicationLabels(result)}
          className={locals.filter}
        />
      )}
    </Fragment>
  );
}

function getSyntheticTypes(result: Result<SyntheticTest[]> | undefined) {
  // Get syntheticTypes from SyntheticTest
  // result can be undefined, isLoading(Result<x>) cannot be used here
  let syntheticTypes: string[];
  if (!result?.progress?.loading) {
    if (syntheticDnsEnabled) {
      syntheticTypes = result?.data?.map(item => item?.configuration.syntheticType ?? '') ?? [];
    } else {
      syntheticTypes =
        result?.data
          ?.filter(item => item?.configuration.syntheticType !== 'DNS')
          .map(item => item?.configuration.syntheticType ?? '') ?? [];
    }

    // Clean up duplicate and empty array elements
    syntheticTypes = syntheticTypes.filter(function (item, index, arrayRef) {
      return arrayRef.indexOf(item) === index && item !== '';
    });

    syntheticTypeOptions = syntheticTypes.map(syntheticType => {
      return {
        label: getDisplayType(syntheticType),
        value: syntheticType
      };
    });

    // Sorting on the display labels
    syntheticTypeOptions.sort((a, b) => a.label.localeCompare(b.label));
  }

  // return syntheticTypeOptions;
  return syntheticTypeOptions;
}

function getLocationLabels(result: Result<SyntheticTest[]> | undefined) {
  // Get locationDisplayLabels and locationIds from SyntheticTest
  if (!result?.progress?.loading) {
    result?.data?.forEach((item: SyntheticTest) => {
      if (item?.locationDisplayLabels) {
        item?.locationDisplayLabels.forEach((locationDisplayLabel, i) => {
          locationLabelOptions.push({
            label: locationDisplayLabel,
            value: item?.locations?.at(i) ?? ''
          });
        });
      }
    });

    // Clean up duplicate and empty array elements
    locationLabelOptions = locationLabelOptions.filter(
      (item, index, arrayRef) =>
        index ===
        arrayRef.findIndex(
          t => t.label === item?.label && t.value === item?.value && (t.label !== '' || t.value !== '')
        )
    );
  }

  locationLabelOptions.sort((a, b) => (a.label < b.label ? -1 : 1));

  // return location display labels and ids;
  return locationLabelOptions;
}

function getApplicationLabels(result: Result<SyntheticTest[]> | undefined) {
  // Get applicationLabels and applicationIds from SyntheticTest
  if (!result?.progress?.loading) {
    result?.data?.forEach(function (item: SyntheticTest) {
      if (item?.applications) {
        item?.applications.forEach((applicationId, i) => {
          applicationLabelOptions.push({
            label: item?.applicationLabels?.at(i) ?? '',
            value: applicationId
          });
        });
      }
    });

    // Clean up duplicate and empty array elements
    applicationLabelOptions = applicationLabelOptions.filter(
      (item, index, arrayRef) =>
        index ===
        arrayRef.findIndex(
          t => t.label === item?.label && t.value === item?.value && (t.label !== '' || t.value !== '')
        )
    );
  }

  applicationLabelOptions.sort((a, b) => (a.label < b.label ? -1 : 1));

  // return application labels and ids;
  return applicationLabelOptions;
}

function getAssociationLabels(result: Result<SyntheticTest[]> | undefined) {
  const associationLabels: Option[] = [];
  let showApplications = false;
  let showWebsites = false;
  let showMobileApplications = false;

  if (!result?.progress?.loading) {
    result?.data?.forEach(function (item: SyntheticTest) {
      if (!showApplications && (item.applications ?? []).length! > 0) {
        showApplications = true;
      }
      if (!showWebsites && (item.websites ?? []).length > 0) {
        showWebsites = true;
      }
      if (!showMobileApplications && (item.mobileApps ?? []).length > 0) {
        showMobileApplications = true;
      }
    });
    if (showApplications) {
      associationLabels.push({
        label: association.applications,
        value: 'applications'
      });
    }
    if (showWebsites) {
      associationLabels.push({
        label: association.websites,
        value: 'websites'
      });
    }
    if (showMobileApplications) {
      associationLabels.push({
        label: association.mobileApps,
        value: 'mobileApps'
      });
    }
  }
  return associationLabels;
}
