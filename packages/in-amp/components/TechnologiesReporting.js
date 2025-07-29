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
import { newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

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

  return newAccountAndBillingPageEnabled ? (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.account_and_billing,
          pageRootName: pageNames.technologies_reporting
        }}
      />

      <div className={locals.bottomMargin}>
        <AmpInformationModifier
          unitSelectorOptions={unitSelectorOptions}
          windowSize={windowSize}
          setWindowSize={setWindowSize}
          tenantUnit={tenantUnit}
          setTenantUnit={setTenantUnit}
          isTechnologiesReporting
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
      </div>
    </>
  ) : (
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
