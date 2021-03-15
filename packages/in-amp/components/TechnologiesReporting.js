/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import TechnologiesReportingTable from 'in-amp/components/TechnologiesReportingTable';
import NoLicenseAvailableMessage from 'in-amp/components/NoLicenseAvailableMessage';
import { getReportingTechnologiesAsResultObservable } from 'in-amp/api/account';
import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';

export default function UsageWithAccountInfo() {
  return (
    <WithAccountInformation>
      {props =>
        props.unitSelectorOptions?.length === 0 ? <NoLicenseAvailableMessage /> : <TechnologiesReporting {...props} />
      }
    </WithAccountInformation>
  );
}

function TechnologiesReporting({ unitSelectorOptions, getCurrentTenantOption }) {
  const { windowSize, setWindowSize, tenantUnit, setTenantUnit } = useAmpUrlInformation(
    getCurrentTenantOption(unitSelectorOptions)?.value
  );
  const [to] = useState(Date.now());

  return (
    <>
      <AmpInformationModifier
        unitSelectorOptions={unitSelectorOptions}
        windowSize={windowSize}
        setWindowSize={setWindowSize}
        tenantUnit={tenantUnit}
        setTenantUnit={setTenantUnit}
      />

      <TechnologiesReportingTable
        tenant={tenantUnit.tenant}
        unit={tenantUnit.unit}
        get={({ tenant, unit, page, pageSize, orderBy, orderDirection }) =>
          getReportingTechnologiesAsResultObservable(
            tenant,
            unit,
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
