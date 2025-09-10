/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { FormGroup } from '@instana/carbon';
import { Dropdown } from '@instana/carbon';
import { Link } from '@instana/carbon';

import {
  SETTINGS_ACCOUNT_BILLING_PRESENTATION,
  SETTINGS_ACCOUNT_BILLING_TENANT_UNIT,
  SETTINGS_ACCOUNT_BILLING_TIMERANGE,
  ACCOUNT_BILLING_PRESENTATION,
  ACCOUNT_BILLING_TENANT_UNIT,
  ACCOUNT_BILLING_TIMERANGE
} from 'in-services/tracking/eventNames';
import { dataUsageNotificationEnabled, newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import { getAccountAsResultObservable, getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import LearnMoreAboutDataConsumption from 'in-amp/components/LearnMoreAboutDataConsumption';
import LearnMoreAboutDataGranularity from 'in-amp/components/LearnMoreAboutDataGranularity';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import PresentationSelection from 'in-amp/components/PresentationSelection';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import config from 'in-services/config';
import { t } from 'in-i18n';

import locals from './AmpInformationModifier.mless';

const aggregatedState = { label: t('in-amp:components.ampInformationModifier.allPaidUnitsAggregated') };

export default function AmpInformationModifier({
  unitSelectorOptions,
  windowSize,
  setWindowSize,
  tenantUnit,
  setTenantUnit,
  timeRange,
  setTimeRange,
  setTo,
  presentation,
  setPresentation,
  isAddOn = false,
  isTechnologiesReporting = false,
  isFup = false,
  fupTimeRange,
  setFupTimeRange,
  fupWindowSize,
  setFupWindowSize,
  fupTo,
  fupSetTo
}) {
  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;
  const licenseObservableResult = useObservable(getActiveLicensesAsResultObservable(1, 60000), []);
  const accountObservableResult = useObservable(getAccountAsResultObservable(), []);
  const fupOverride = accountObservableResult?.data?.fupOverride;
  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

  //Check whether limitedDataUsage flag is set for active paid licenses
  let limitedDataUsageCheck = false;
  const licenses = licenseObservableResult?.data?.items;
  if (licenses) {
    const paidLicenses = licenses.filter(eachLicense => eachLicense?.license?.paid);
    if (paidLicenses.length > 0) {
      limitedDataUsageCheck = paidLicenses.every(
        eachLicense => eachLicense?.license?.licenseSpecs?.limitedDataUsage === true
      );
    }
  }
  const showFupMessage = limitedDataUsageCheck && !fupOverride;

  const { trackCta } = useSegmentTracking();

  const handleTenantUnitChange = newTenantUnit => {
    setTenantUnit(newTenantUnit);
    trackCta(newAccountAndBillingPageEnabled ? ACCOUNT_BILLING_TENANT_UNIT : SETTINGS_ACCOUNT_BILLING_TENANT_UNIT, {
      tenantUnit: newTenantUnit.label
    });
  };
  const handlePresentationChange = newPresentation => {
    setPresentation(newPresentation);
    trackCta(newAccountAndBillingPageEnabled ? ACCOUNT_BILLING_PRESENTATION : SETTINGS_ACCOUNT_BILLING_PRESENTATION, {
      presentation: newPresentation.label
    });
  };
  const handleTimeRangeChange = newTimeRange => {
    setTimeRange(newTimeRange);
    trackCta(newAccountAndBillingPageEnabled ? ACCOUNT_BILLING_TIMERANGE : SETTINGS_ACCOUNT_BILLING_TIMERANGE, {
      timeRange: newTimeRange.label
    });
  };
  const handleWindowSizeChange = newWindowSize => {
    setWindowSize(newWindowSize);
    trackCta(ACCOUNT_BILLING_TIMERANGE, {
      timeRange: newWindowSize.label
    });
  };

  return (
    <div
      className={classNames({
        [locals.buttonHeader]: true,
        [locals.buttonHeaderReverse]: !unitSelectorOptions
      })}
    >
      <Stack>
        {dataUsageNotificationEnabled && showFupMessage && !isAddOn && <LearnMoreAboutDataConsumption />}
        {isFup && <LearnMoreAboutDataGranularity />}
        {!isAddOn && !isFup && (
          <Message
            type="neutral"
            dismissible
            title={
              showFupMessage
                ? t('in-amp:components.fairUsePolicyMessage.title')
                : t('in-amp:components.fairUsePolicyNotActive.title')
            }
            fullInlineWidth
          />
        )}
        <Stack direction="horizontal" distribution="spaceBetween">
          <Stack direction="horizontal">
            {unitSelectorOptions && (
              <Dropdown
                titleText={t('in-amp:accountAndBilling.label.unit')}
                id="unitDropdown"
                label={t('in-amp:accountAndBilling.label.unit')}
                items={unitSelectorOptions}
                itemToString={item => (item ? item.label : '')}
                initialSelectedItem={unitSelectorOptions.find(opt => opt.label === tenantUnit.label)}
                onChange={({ selectedItem }) => {
                  handleTenantUnitChange(selectedItem);
                }}
                size="md"
                className={locals.unitSelector}
                disabled={isFup}
              />
            )}
            {isFup && (
              <Link
                target="_blank"
                href={tenantSwitcherLink}
                renderIcon={() => <SvgIcon type="lib_views_external_link" size="xs" />}
                className={locals.switchTenant}
              >
                {t('in-amp:fairUsePolicy.tenantSwitcher')}
              </Link>
            )}
          </Stack>
          <div className={locals.ampTimeSelectionWrapper}>
            {newAccountAndBillingPageEnabled ? (
              <FormGroup legendText={t('in-amp:accountAndBilling.label.timeRange')}>
                <AmpTimeSelection
                  windowSize={windowSize}
                  setWindowSize={isTechnologiesReporting ? handleWindowSizeChange : setWindowSize}
                  timeRange={timeRange}
                  setTimeRange={handleTimeRangeChange}
                  setTo={setTo}
                  presentation={presentation}
                  setPresentation={handlePresentationChange}
                  fupTimeRange={fupTimeRange}
                  setFupTimeRange={setFupTimeRange}
                  fupWindowSize={fupWindowSize}
                  setFupWindowSize={setFupWindowSize}
                  fupTo={fupTo}
                  fupSetTo={fupSetTo}
                />
              </FormGroup>
            ) : (
              <AmpTimeSelection
                windowSize={windowSize}
                setWindowSize={setWindowSize}
                timeRange={timeRange}
                setTimeRange={handleTimeRangeChange}
                setTo={setTo}
                presentation={presentation}
                setPresentation={handlePresentationChange}
                fupTimeRange={fupTimeRange}
                setFupTimeRange={setFupTimeRange}
                fupWindowSize={fupWindowSize}
                setFupWindowSize={setFupWindowSize}
                fupTo={fupTo}
                fupSetTo={fupSetTo}
              />
            )}
            {presentation &&
              (newAccountAndBillingPageEnabled ? (
                <FormGroup legendText={t('in-amp:accountAndBilling.label.values')}>
                  <PresentationSelection
                    presentation={presentation}
                    setPresentation={handlePresentationChange}
                    timeRange={timeRange}
                  />
                </FormGroup>
              ) : (
                <PresentationSelection
                  presentation={presentation}
                  setPresentation={handlePresentationChange}
                  timeRange={timeRange}
                />
              ))}
          </div>
        </Stack>
        {unitSelectorOptions && showAggregatedMetrics && !isAddOn && (
          <Message
            className={locals.message}
            withIcon
            title={t(
              'in-amp:components.ampInformationModifier.customerUsageIsReportedAcrossAllUnitsOfYourAccountWithAPaidLicense'
            )}
            fullInlineWidth
          />
        )}
      </Stack>
    </div>
  );
}
