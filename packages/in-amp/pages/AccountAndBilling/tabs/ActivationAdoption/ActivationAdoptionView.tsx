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
import UserUsage from 'in-amp/pages/AccountAndBilling/tabs/ActivationAdoption/UserUsage';
import { ampActivationAdoption, userUsage } from 'in-amp/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

export default function ViewContainer(props: any) {
  const accountInfo = useObservable(getAccountAsResultObservable, []);

  return <View {...props} accountInfo={accountInfo} />;
}

function View(props: any) {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.account_and_billing,
          pageRootName: pageNames.activation_and_adoption
        }}
      />
      <SideNavigationAndContent
        navigationTree={[
          {
            pages: [
              {
                path: userUsage,
                label: t('in-amp:accountAndBilling.tabs.userUsage'),
                component: UserUsage
              }
            ]
          }
        ]}
        redirectToDefaultPage={userUsage}
        redirectFrom={ampActivationAdoption}
        NotFoundPage={() => null}
        {...props}
      />
    </>
  );
}
