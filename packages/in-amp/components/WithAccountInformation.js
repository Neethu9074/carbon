/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { getAccountAsResultObservable } from 'in-amp/api/account';
import { hasError, isLoading } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
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
  // Do not show aggregated metrics, based on feature flag
  const canShowAggregatedMetrics = !onPremLicenseInformationEnabled && containsPaidLicenses(environments);
  const unitSelectorOptions = environments.map(mapEnvironmentToComboBoxItem);
  const hasSyntheticAddon = syntheticAddons(environments);
  const hasLoggingAddon = loggingAddons(environments);
  return children({
    getCurrentTenantOption,
    unitSelectorOptions,
    canShowAggregatedMetrics,
    hasSyntheticAddon,
    hasLoggingAddon
  });
}

function syntheticAddons(licenses) {
  for (const license of licenses) {
    const active = license.activeLicenses?.some(lic => lic.licenseSpecs?.addons?.SYNTHETICS?.jobs > 0);
    const expired = license.expiredLicenses?.some(lic => lic.licenseSpecs?.addons?.SYNTHETICS?.jobs > 0);
    const queued = license.queuedLicense?.some(lic => lic.licenseSpecs?.addons?.SYNTHETICS?.jobs > 0);
    if (active || expired || queued) {
      return true;
    }
  }
  return false;
}

/**
 * This function checks if any of the active, expired or queued license has logging retention data
 * available? if not then return false, if there is, then return an array of retention days to be
 * displayed. If any of the license in any environment has the addon property then will be added to
 * the array. The function checks on expiredLicenses to see the retention period of old data.
 * @param {*} environments
 * @returns null | string[]
 */
function loggingAddons(environments) {
  const logAddonDays = [];

  environments.forEach(env => {
    const licenseLists = ['activeLicenses', 'expiredLicenses', 'queuedLicenses'];

    licenseLists.forEach(licenseList => {
      env[licenseList].forEach(license => {
        const retention = license.licenseSpecs?.addons?.LOGGING_RETENTION;

        if (retention?.bucket30Days > 0) logAddonDays.push('bucket30Days');
        if (retention?.bucket60Days > 0) logAddonDays.push('bucket60Days');
        if (retention?.bucket90Days > 0) logAddonDays.push('bucket90Days');
      });
    });
  });

  return logAddonDays.length > 0 ? logAddonDays : null;
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
