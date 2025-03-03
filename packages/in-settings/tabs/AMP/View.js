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
  ampActivationAdoption,
  ampLicense
} from 'in-settings/navigation/paths';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import RestrictedTechnologiesReporting from 'in-amp/components/RestrictedTechnologiesReporting';
import TechnologiesReporting from 'in-amp/components/TechnologiesReporting';
import ActivationAdoption from 'in-amp/components/ActivationAdoption';
import RestrictedLicense from 'in-amp/components/RestrictedLicense';
import { ampCompanyInfoEnabled } from 'in-services/featureFlags';
import { productAreas } from 'in-services/tracking/productAreas';
import AccountSettings from 'in-amp/components/AccountSettings';
import RestrictedUsage from 'in-amp/components/RestrictedUsage';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { pageNames } from 'in-services/tracking/pageNames';
import Licenses from 'in-amp/components/Licenses';
import Usage from 'in-amp/components/Usage';
import { t } from 'in-i18n';

export default function View(props) {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.account_and_billing
        }}
      />
      <StickySidebarNavigationAndContent
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
                      path: ampLicense,
                      label: t('in-settings:tabs.licenses'),
                      component: Licenses
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
                      path: ampLicense,
                      label: t('in-settings:tabs.licenses'),
                      component: RestrictedLicense
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
    </>
  );
}
