import React from 'react';

import { ampSettings, ampAccountSettings, ampUsage, ampTechnologies } from 'in-settings/navigation/paths';
import RestrictedTechnologiesReporting from 'in-amp/components/RestrictedTechnologiesReporting';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import TechnologiesReporting from 'in-amp/components/TechnologiesReporting';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import AccountSettings from 'in-amp/components/AccountSettings';
import RestrictedUsage from 'in-amp/components/RestrictedUsage';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import Usage from 'in-amp/components/Usage';

export default function View(props) {
  return (
    <SideNavigationAndContent
      stickySidebar
      navigationTree={[
        {
          title: 'Account & Billing',
          pages: [
            ...(ampCompanyInfoEnabled
              ? [
                  {
                    path: ampUsage,
                    label: 'Usage',
                    component: Usage
                  },
                  { path: ampTechnologies, label: 'Technologies Reporting', component: TechnologiesReporting },
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
                  },
                  { path: ampTechnologies, label: 'Technologies Reporting', component: RestrictedTechnologiesReporting }
                ])
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
