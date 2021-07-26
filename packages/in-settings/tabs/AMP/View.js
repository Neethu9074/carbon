/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  ampSettings,
  ampAccountSettings,
  ampUsage,
  ampTechnologies,
  ampActivationAdoption
} from 'in-settings/navigation/paths';
import RestrictedTechnologiesReporting from 'in-amp/components/RestrictedTechnologiesReporting';
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent';
import TechnologiesReporting from 'in-amp/components/TechnologiesReporting';
import ActivationAdoption from 'in-amp/components/ActivationAdoption';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import AccountSettings from 'in-amp/components/AccountSettings';
import RestrictedUsage from 'in-amp/components/RestrictedUsage';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import Usage from 'in-amp/components/Usage';
import { t } from 'in-i18n';

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
                    path: ampActivationAdoption,
                    label: t('in-settings:tabs.activationAdoption'),
                    component: ActivationAdoption
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
