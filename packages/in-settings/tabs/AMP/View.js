// @flow
import React from 'react';

import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import { ampSettings, ampAccountSettings, ampUsage } from 'in-settings/navigation/paths';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import AccountSettings from 'in-amp/components/AccountSettings';
import RestrictedUsage from 'in-amp/components/RestrictedUsage';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import Usage from 'in-amp/components/Usage';

export default function View(props: any) {
  return (
    <SideNavigationAndContent
      stickySidebar
      navigationTree={[
        {
          title: 'Account & Billing',
          pages: ampCompanyInfoEnabled
            ? [
                {
                  path: ampUsage,
                  label: 'Usage',
                  component: Usage
                },
                {
                  path: ampAccountSettings,
                  label: 'Account Settings',
                  component: AccountSettings
                }
              ]
            : [
                {
                  path: ampUsage,
                  label: 'Usage',
                  component: RestrictedUsage
                }
              ]
        }
      ]}
      redirectToDefaultPage={ampUsage}
      redirectFrom={ampSettings}
      NotFoundPage={NotFoundPage}
      {...props}
    />
  );
}
