/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs TS migration
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent.js';
// @ts-expect-error needs TS migration
import RestrictedTechnologiesReporting from 'in-amp/components/RestrictedTechnologiesReporting';
// @ts-expect-error needs TS migration
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import { addOns, ampUsage, consumptionOverview, dataGranularity, dataUsage } from 'in-amp/navigation/paths';
//@ts-expect-error - needs TS migration
import RestrictedUsage from 'in-amp/components/RestrictedUsage';
import ConsumptionOverview from 'in-amp/pages/AccountAndBilling/tabs/Usage/ConsumptionOverview';
// @ts-expect-error needs TS migration
import UsageCharts from 'in-amp/components/UsageCharts';
import { ampCompanyInfoEnabled, fairUsagePolicyEnabled } from 'in-services/featureFlags';
import DataGranularity from 'in-amp/pages/AccountAndBilling/tabs/Usage/DataGranularity';
// @ts-expect-error needs TS migration
import Usage from 'in-amp/components/Usage';
import AddOns from 'in-amp/pages/AccountAndBilling/tabs/Usage/AddOns';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

type AccountInfoProps = {
  hasPaidLicenses: boolean;
};

export default function ViewContainer(props: any) {
  if (ampCompanyInfoEnabled) {
    return (
      <WithAccountInformation>
        {({ hasPaidLicenses }: AccountInfoProps) => <View hasPaidLicenses={hasPaidLicenses} {...props} />}
      </WithAccountInformation>
    );
  }
  return <View {...props} />;
}

function View(props: any) {
  const pages = [
    {
      path: dataUsage,
      label: t('in-amp:accountAndBilling.tabs.dataUsage'),
      component: ampCompanyInfoEnabled ? Usage : RestrictedUsage
    }
  ];
  if (props.hasPaidLicenses && ampCompanyInfoEnabled) {
    pages.push(
      {
        path: consumptionOverview,
        label: t('in-amp:accountAndBilling.tabs.consumptionOverview'),
        component: ConsumptionOverview
      },
      {
        path: addOns,
        label: t('in-amp:accountAndBilling.tabs.addOns'),
        component: AddOns
      }
    );
  }
  if (ampCompanyInfoEnabled && fairUsagePolicyEnabled) {
    pages.push({
      path: dataGranularity,
      label: t('in-amp:accountAndBilling.tabs.dataGranularity'),
      component: DataGranularity
    });
  }
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.account_and_billing,
          pageRootName: pageNames.usage
        }}
      />
      <SideNavigationAndContent
        navigationTree={[
          {
            pages
          }
        ]}
        redirectToDefaultPage={dataUsage}
        redirectFrom={ampUsage}
        NotFoundPage={() => null}
        {...props}
      />
    </>
  );
}
