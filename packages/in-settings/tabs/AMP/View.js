// @flow
import React from 'react';

import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import { ampSettings, ampCompanyInfo, ampUsage } from 'in-settings/navigation/paths';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import CompanyInfo from 'in-amp/components/CompanyInfo';
import Usage from 'in-amp/components/Usage';

export default function View(props: any) {
  return (
    <SideNavigationAndContent
      stickySidebar
      navigationTree={[
        {
          title: 'Account',
          pages: [
            {
              path: ampUsage,
              label: 'Usage',
              component: Usage
            },
            {
              path: ampCompanyInfo,
              label: 'Company Info',
              component: CompanyInfo
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
