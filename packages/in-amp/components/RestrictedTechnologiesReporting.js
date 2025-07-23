/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import TechnologiesReportingTable from 'in-amp/components/TechnologiesReportingTable';
import { getReportingTechnologiesAsResultObservable } from 'in-amp/api/account';
import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import { newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import config from 'in-services/config';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

export default function TechnologiesReporting() {
  const { windowSize, setWindowSize, tenantUnit } = useAmpUrlInformation({
    tenant: config.tenant,
    unit: config.tenantUnit
  });
  const [to] = useState(Date.now());

  return newAccountAndBillingPageEnabled ? (
    <div className={locals.bottomMargin}>
      <AmpInformationModifier windowSize={windowSize} setWindowSize={setWindowSize} tenantUnit={tenantUnit} />

      <TechnologiesReportingTable
        get={({ page, pageSize, orderBy, orderDirection }) =>
          getReportingTechnologiesAsResultObservable(
            null,
            null,
            to,
            windowSize,
            page,
            pageSize,
            orderBy,
            orderDirection
          )
        }
      />
    </div>
  ) : (
    <>
      <AmpInformationModifier windowSize={windowSize} setWindowSize={setWindowSize} tenantUnit={tenantUnit} />

      <TechnologiesReportingTable
        get={({ page, pageSize, orderBy, orderDirection }) =>
          getReportingTechnologiesAsResultObservable(
            null,
            null,
            to,
            windowSize,
            page,
            pageSize,
            orderBy,
            orderDirection
          )
        }
      />
    </>
  );
}
