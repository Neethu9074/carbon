/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getAccountAsResultObservable } from 'in-amp/api/account';
import { hasError, isLoading } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import config from 'in-services/config';
import { days } from 'in-services/time';

export default function WithAccountInformationResultWrapper({ children }) {
  const accountResult = useObservable(getAccountAsResultObservable, []);
  if (!accountResult || hasError(accountResult) || isLoading(accountResult)) {
    return <ApiItemView hideFooter result={accountResult ?? pendingResult} />;
  }

  return (
    <WithAccountInformation environments={accountResult.data.environments.filter(containsValidLicense)}>
      {children}
    </WithAccountInformation>
  );
}

function WithAccountInformation({ children, environments }) {
  const canShowAggregatedMetrics = containsPaidLicenses(environments);
  const unitSelectorOptions = environments.map(mapEnvironmentToComboBoxItem);

  return children({
    getCurrentTenantOption,
    unitSelectorOptions,
    canShowAggregatedMetrics
  });
}

function getCurrentTenantOption(unitSelectorOptions) {
  return (
    unitSelectorOptions.find(({ value }) => value.tenant === config.tenant && value.unit === config.tenantUnit) ??
    unitSelectorOptions[0]
  );
}

function containsValidLicense(environment) {
  return containsActiveLicense(environment) || containsLicenseWhichIsNotOlderThan30Days(environment);
}

function containsActiveLicense({ activeLicenses }) {
  activeLicenses = activeLicenses ?? [];
  return activeLicenses.length > 0;
}

function containsLicenseWhichIsNotOlderThan30Days({ expiredLicenses }) {
  expiredLicenses = expiredLicenses ?? [];
  const now = Date.now();
  const thirtyDays = days.toMillis(30);

  for (const { expire } of expiredLicenses) {
    if (now - expire <= thirtyDays) {
      return true;
    }
  }
  return false;
}

function containsPaidLicenses(environments) {
  for (const { activeLicenses, expiredLicenses } of environments) {
    if (containsPaidLicense(activeLicenses) || containsPaidLicense(expiredLicenses)) {
      return true;
    }
  }
  return false;
}

function containsPaidLicense(licenses) {
  for (const { paid } of licenses) {
    if (paid) {
      return true;
    }
  }
  return false;
}

function mapEnvironmentToComboBoxItem({ tenant, unit, activeLicenses, expiredLicenses }) {
  const label = `${unit}-${tenant} (${getLicenseTypeLabel(activeLicenses, expiredLicenses)})`;
  return {
    label,
    value: { tenant, unit, label }
  };
}

function getLicenseTypeLabel(activeLicenses, expiredLicenses) {
  const licenseType = getLicenseType(activeLicenses) ?? getLicenseType(expiredLicenses);
  return licenseType === 'free' ||
    licenseType === 'selfService' ||
    licenseType === 'quota' ||
    licenseType === 'free_not_for_resale'
    ? 'free'
    : 'paid';
}

function getLicenseType(license) {
  if (license && license.length > 0) {
    return license[0].type;
  }
}
