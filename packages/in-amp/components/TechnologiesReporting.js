import React from 'react';

import TechnologiesReportingTable from 'in-amp/components/TechnologiesReportingTable';
import { getReportingTechnologiesAsResultObservable } from 'in-amp/api/account';
import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';

export default function UsageWithAccountInfo() {
  return <WithAccountInformation>{props => <TechnologiesReporting {...props} />}</WithAccountInformation>;
}

function TechnologiesReporting({ unitSelectorOptions }) {
  const { windowSize, setWindowSize, tenantUnit, setTenantUnit } = useAmpUrlInformation(
    '/technologies',
    unitSelectorOptions[0]?.value
  );

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
          getReportingTechnologiesAsResultObservable(tenant, unit, windowSize, page, pageSize, orderBy, orderDirection)
        }
      />
    </>
  );
}
