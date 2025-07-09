/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error - Cannot find module
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent';
//@ts-expect-error - Cannot find module
import { getAccountAsResultObservable } from 'in-amp/api/account';
import CustomerAdoption from 'in-amp/pages/AccountAndBilling/tabs/ActivationAdoption/CustomerAdoption';
import { ampActivationAdoption, customerAdoption, userUsage } from 'in-amp/navigation/paths';
import UserUsage from 'in-amp/pages/AccountAndBilling/tabs/ActivationAdoption/UserUsage';

export default function ViewContainer(props: any) {
  const accountInfo = useObservable(getAccountAsResultObservable, []);

  return <View {...props} accountInfo={accountInfo} />;
}

function View(props: any) {
  return (
    <>
      <SideNavigationAndContent
        navigationTree={[
          {
            pages: [
              {
                path: customerAdoption,
                label: t('in-amp:accountAndBilling.tabs.customerAdoption'),
                component: CustomerAdoption
              },
              {
                path: userUsage,
                label: t('in-amp:accountAndBilling.tabs.userUsage'),
                component: UserUsage
              }
            ]
          }
        ]}
        redirectToDefaultPage={customerAdoption}
        redirectFrom={ampActivationAdoption}
        NotFoundPage={() => null}
        {...props}
      />
    </>
  );
}
