/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
          title: t('in-settings:tabs.accountBilling'),
          pages: [
            ...(ampCompanyInfoEnabled
              ? [
                  {
                    path: ampUsage,
                    label: t('in-settings:tabs.usage'),
                    component: Usage
                  },
                  {
                    path: ampTechnologies,
                    label: t('in-settings:tabs.technologiesReporting'),
                    component: TechnologiesReporting
                  },
                  {
                    path: ampAccountSettings,
                    label: t('in-settings:tabs.accountSettings'),
                    component: AccountSettings
                  }
                ]
              : [
                  {
                    path: ampUsage,
                    label: t('in-settings:tabs.usage'),
                    component: RestrictedUsage
                  },
                  {
                    path: ampTechnologies,
                    label: t('in-settings:tabs.technologiesReporting'),
                    component: RestrictedTechnologiesReporting
                  }
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
