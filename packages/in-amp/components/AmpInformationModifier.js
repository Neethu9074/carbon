/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getAccountAsResultObservable, getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import PresentationSelection from 'in-amp/components/PresentationSelection';
import DropdownButton from 'in-components/Button/DropdownButton';
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
  let showFupMessage = false;
  const licenses = licenseObservableResult?.data?.items;
  if (licenses) {
    const paidLicenses = licenses.filter(eachLicense => eachLicense?.license?.paid);
    if (paidLicenses.length > 0) {
      showFupMessage = paidLicenses.every(eachLicense => eachLicense?.license?.licenseSpecs?.limitedDataUsage === true);
    }
  }
  return (
    <div
      className={classNames({
        [locals.buttonHeader]: true,
        [locals.buttonHeaderReverse]: !unitSelectorOptions
      })}
    >
      <Stack>
        {!fupOverride && showFupMessage && (
          <Message
            type="neutral"
            dismissible
            title={t('in-amp:components.fairUsePolicyMessage.title')}
            fullInlineWidth
          />
        )}
        <Stack direction="horizontal" distribution="spaceBetween">
          {unitSelectorOptions && (
            <ComboBoxBehavior
              align="bottomRight"
              value={unitSelectorOptions.find(({ label }) => label === tenantUnit.label)?.value}
              options={unitSelectorOptions}
              onChange={setTenantUnit}
              disableAutomaticOptionSorting
            >
              {({ elementProps, isOpen }) => (
                <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
                  {tenantUnit.label}
                </DropdownButton>
              )}
            </ComboBoxBehavior>
          )}
          <div>
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
