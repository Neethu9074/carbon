/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs TS migration
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent.js';
// @ts-expect-error needs TS migration
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import ConsumptionOverview from 'in-amp/pages/AccountAndBilling/tabs/Usage/ConsumptionOverview';
// @ts-expect-error needs TS migration
import UsageCharts from 'in-amp/components/UsageCharts';
import { addOns, ampUsage, consumptionOverview, dataUsage } from 'in-amp/navigation/paths';
// @ts-expect-error needs TS migration
import Usage from 'in-amp/components/Usage';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import AddOns from 'in-amp/pages/AccountAndBilling/tabs/Usage/AddOns';
import { t } from 'in-i18n';

type AccountInfoProps = {
  hasPaidLicenses: boolean;
};

export default function ViewContainer(props: any) {
  return (
    <WithAccountInformation>
      {({ hasPaidLicenses }: AccountInfoProps) => <View hasPaidLicenses={hasPaidLicenses} {...props} />}
    </WithAccountInformation>
  );
}

function View(props: any) {
  const pages = [
    {
      path: dataUsage,
      label: t('in-amp:accountAndBilling.tabs.dataUsage'),
      component: Usage
    }
  ];
  if (props.hasPaidLicenses && !onPremLicenseInformationEnabled) {
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
  return (
    <>
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
