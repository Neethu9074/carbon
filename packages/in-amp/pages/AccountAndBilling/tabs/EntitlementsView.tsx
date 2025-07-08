/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import { Card } from '@instana/components';

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
import { t } from 'in-i18n';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

export default function ViewContainer(props: any) {
  return (
    <WithAccountInformation>
      {(accountInformationProps: { unitSelectorOptions: string | any[] }) =>
        accountInformationProps.unitSelectorOptions?.length === 0 ? <NoLicenseAvailableMessage /> : <View {...props} />
      }
    </WithAccountInformation>
  );
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
                component: renderHeader(ActiveLicenses, t('in-amp:accountAndBilling.tabs.activeEntitlements'))
              },
              {
                path: expiredEntitlements,
                label: t('in-amp:accountAndBilling.tabs.expiredEntitlements'),
                component: renderHeader(ExpiredLicenses, t('in-amp:accountAndBilling.tabs.expiredEntitlements'))
              },
              {
                path: queuedEntitlements,
                label: t('in-amp:accountAndBilling.tabs.queuedEntitlements'),
                component: renderHeader(QueuedLicenses, t('in-amp:accountAndBilling.tabs.queuedEntitlements'))
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

function renderHeader(Component: React.ComponentType<any>, title: any) {
  return function withHeader(props: any) {
    return (
      <div className={locals.bottomMargin}>
        <Card title={title}>
          <Component {...props} />
        </Card>
      </div>
    );
  };
}
