/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NoLicenseAvailableMessage from 'in-amp/components/NoLicenseAvailableMessage';
import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import UsageCharts from 'in-amp/components/UsageCharts';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const aggregatedState = { label: t('in-amp:components.usages.allPaidUnitsAggregated') };

export default function UsageWithAccountInfo() {
  return (
    <WithAccountInformation>
      {props => (props.unitSelectorOptions?.length === 0 ? <NoLicenseAvailableMessage /> : <Usage {...props} />)}
    </WithAccountInformation>
  );
}

function Usage({
  unitSelectorOptions,
  getCurrentTenantOption,
  canShowAggregatedMetrics,
  hasSyntheticAddon,
  hasLoggingAddon
}) {
  const initialState =
    (canShowAggregatedMetrics ? aggregatedState : getCurrentTenantOption(unitSelectorOptions)?.value) ??
    aggregatedState;
  const {
    windowSize,
    setWindowSize,
    tenantUnit,
    setTenantUnit,
    timeRange,
    setTimeRange,
    to,
    setTo,
    presentation,
    setPresentation
  } = useAmpUrlInformation(initialState);

  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;
  if (canShowAggregatedMetrics) {
    unitSelectorOptions = unitSelectorOptions.slice();
    unitSelectorOptions.unshift({ label: aggregatedState.label, value: { label: aggregatedState.label } });
  }

  return (
    <>
      <Title title={t('in-amp:components.usages.accountUsage')} />

      <AmpInformationModifier
        unitSelectorOptions={unitSelectorOptions}
        windowSize={windowSize}
        setWindowSize={setWindowSize}
        tenantUnit={tenantUnit}
        setTenantUnit={setTenantUnit}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        setTo={setTo}
        presentation={presentation}
        setPresentation={setPresentation}
      />

      <UsageCharts
        windowSize={windowSize}
        timeRange={timeRange}
        to={to}
        tenantUnit={tenantUnit}
        showAggregatedMetrics={showAggregatedMetrics}
        hasSyntheticAddon={hasSyntheticAddon}
        hasLoggingAddon={hasLoggingAddon}
        presentation={presentation}
      />
    </>
  );
}
