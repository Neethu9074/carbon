/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';

import { Stack, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Dropdown } from '@instana/components';

import {
  SETTINGS_ACCOUNT_BILLING_PRESENTATION,
  SETTINGS_ACCOUNT_BILLING_TENANT_UNIT,
  SETTINGS_ACCOUNT_BILLING_TIMERANGE
} from 'in-services/tracking/eventNames';
import { getAccountAsResultObservable, getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import LearnMoreAboutDataConsumption from 'in-amp/components/LearnMoreAboutDataConsumption';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import PresentationSelection from 'in-amp/components/PresentationSelection';
import { dataUsageNotificationEnabled } from 'in-services/featureFlags';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
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
  setPresentation
}) {
  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;
  const licenseObservableResult = useObservable(getActiveLicensesAsResultObservable(1, 60000), []);
  const accountObservableResult = useObservable(getAccountAsResultObservable(), []);
  const fupOverride = accountObservableResult?.data?.fupOverride;

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

  useEffect(() => {
    trackCta(SETTINGS_ACCOUNT_BILLING_TENANT_UNIT, { tenantUnit: tenantUnit?.label });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantUnit?.label]);

  useEffect(() => {
    trackCta(SETTINGS_ACCOUNT_BILLING_TIMERANGE, { timeRange });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    trackCta(SETTINGS_ACCOUNT_BILLING_PRESENTATION, { presentation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentation]);

  return (
    <div
      className={classNames({
        [locals.buttonHeader]: true,
        [locals.buttonHeaderReverse]: !unitSelectorOptions
      })}
    >
      <Stack>
        {dataUsageNotificationEnabled && showFupMessage && <LearnMoreAboutDataConsumption />}
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
        <Stack direction="horizontal" distribution="spaceBetween">
          {unitSelectorOptions && (
            <Dropdown
              items={unitSelectorOptions}
              size="md"
              value={unitSelectorOptions.find(({ label }) => label === tenantUnit.label)?.value}
              onChange={setTenantUnit}
              className={locals.unitSelector}
            />
          )}
          <div className={locals.ampTimeSelectionWrapper}>
            <AmpTimeSelection
              windowSize={windowSize}
              setWindowSize={setWindowSize}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              setTo={setTo}
              presentation={presentation}
              setPresentation={setPresentation}
            />
            {presentation && (
              <PresentationSelection
                presentation={presentation}
                setPresentation={setPresentation}
                timeRange={timeRange}
              />
            )}
          </div>
        </Stack>
        {unitSelectorOptions && showAggregatedMetrics && (
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
