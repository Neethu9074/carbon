/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import UsageCharts from 'in-amp/components/UsageCharts';
import config from 'in-services/config';
import Title from 'in-components/Title';

export default function RestrictedUsage() {
  const { windowSize, setWindowSize, tenantUnit } = useAmpUrlInformation({
    tenant: config.tenant,
    unit: config.tenantUnit
  });

  return (
    <>
      <Title title="Account Usage" />

      <AmpInformationModifier windowSize={windowSize} setWindowSize={setWindowSize} tenantUnit={tenantUnit} />

      <UsageCharts windowSize={windowSize} tenantUnit={tenantUnit} showPurchasedMetric={false} />
    </>
  );
}
