/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

//@ts-expect-error - needs TS migration
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent';
//@ts-expect-error - needs TS migration
import NoLicenseAvailableMessage from 'in-amp/components/NoLicenseAvailableMessage';
import { activeEntitlements, ampEntitlements, expiredEntitlements, queuedEntitlements } from 'in-amp/navigation/paths';
//@ts-expect-error - needs TS migration
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
//@ts-expect-error - needs TS migration
import ExpiredLicenses from 'in-amp/components/ExpiredLicenses';
//@ts-expect-error - needs TS migration
import ActiveLicenses from 'in-amp/components/ActiveLicenses';
//@ts-expect-error - needs TS migration
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

export default function ViewContainer(props: any) {
  if (ampCompanyInfoEnabled) {
    return (
      <WithAccountInformation>
        {(accountInformationProps: { unitSelectorOptions: string | any[] }) =>
          accountInformationProps.unitSelectorOptions?.length === 0 ? (
            <NoLicenseAvailableMessage />
          ) : (
            <View {...props} />
          )
        }
      </WithAccountInformation>
    );
  }
  return <View {...props} />;
}

function View(props: any) {
  return (
    <>
      <SideNavigationAndContent
        navigationTree={[
          {
            pages: [
              {
                path: activeEntitlements,
                label: t('in-amp:accountAndBilling.tabs.activeEntitlements'),
                component: entitlementsTableWrapper(ActiveLicenses)
              },
              {
                path: expiredEntitlements,
                label: t('in-amp:accountAndBilling.tabs.expiredEntitlements'),
                component: entitlementsTableWrapper(ExpiredLicenses)
              },
              {
                path: queuedEntitlements,
                label: t('in-amp:accountAndBilling.tabs.queuedEntitlements'),
                component: entitlementsTableWrapper(QueuedLicenses)
              }
            ]
          }
        ]}
        redirectToDefaultPage={activeEntitlements}
        redirectFrom={ampEntitlements}
        NotFoundPage={() => null}
        {...props}
      />
    </>
  );
}

function entitlementsTableWrapper(Component: React.ComponentType<any>) {
  return function withMargin(props: any) {
    return (
      <div className={locals.bottomMargin}>
        <Component {...props} />
      </div>
    );
  };
}
