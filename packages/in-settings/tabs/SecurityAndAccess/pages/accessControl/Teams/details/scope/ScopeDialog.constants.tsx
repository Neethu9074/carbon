/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import ScopeSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/scope/ScopeSection';
import { Trans, t } from 'in-i18n';

export const SCOPE_FORM_ID = 'rbac-scope-form';
export const SCOPE_FORM_ACTIONS = Object.freeze({
  clone: () => {},
  edit: () => {},
  new: () => {}
} as const);

export const SCOPE_NAV_ITEMS = [
  {
    content: <Trans i18nKey={'in-settings:dialogs.scope.generalSectionDescription'} />,
    label: t('in-settings:dialogs.scope.generalSectionTitle'),
    scrollId: 'general-section',
    title: undefined,
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedWebsitesSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addWebsitesLabel')}
        tableTitle={t('in-settings:dialogs.scope.websiteSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.websiteSectionTitle'),
    scrollId: 'websites-section',
    title: t('in-settings:dialogs.scope.websiteSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedMobileAppsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addMobileAppsLabel')}
        tableTitle={t('in-settings:dialogs.scope.mobileAppsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.mobileAppsSectionTitle'),
    scrollId: 'mobile-apps-section',
    title: t('in-settings:dialogs.scope.mobileAppsSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedBusinessMonitoringSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addBusinessPerspectivesLabel')}
        tableTitle={t('in-settings:dialogs.scope.businessMonitoringSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.businessMonitoringSectionTitle'),
    scrollId: 'business-monitoring-section',
    title: t('in-settings:dialogs.scope.businessMonitoringSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedApplicationsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addApplicationsLabel')}
        tableTitle={t('in-settings:dialogs.scope.applicationsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.applicationsSectionTitle'),
    scrollId: 'applications-section',
    title: t('in-settings:dialogs.scope.applicationsSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedPlatformsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addClustersLabel')}
        tableTitle={t('in-settings:dialogs.scope.platformsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.platformsSectionTitle'),
    scrollId: 'platforms-section',
    title: t('in-settings:dialogs.scope.platformsSectionTitle'),
    valid: true
  },
  {
    content: <></>,
    label: t('in-settings:dialogs.scope.infrastructureSectionTitle'),
    scrollId: 'infrastructure-section',
    title: t('in-settings:dialogs.scope.infrastructureSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedCustomDashboardsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addCustomDashboardsLabel')}
        tableTitle={t('in-settings:dialogs.scope.customDashboardsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.customDashboardsSectionTitle'),
    scrollId: 'custom-dashboards-section',
    title: t('in-settings:dialogs.scope.customDashboardsSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedSyntheticTestsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addSyntheticTestsLabel')}
        tableTitle={t('in-settings:dialogs.scope.syntheticTestsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.syntheticTestsSectionTitle'),
    scrollId: 'synthetic-tests-section',
    title: t('in-settings:dialogs.scope.syntheticTestsSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedSyntheticCredentialsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addSyntheticCredentialsLabel')}
        tableTitle={t('in-settings:dialogs.scope.syntheticCredentialsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.syntheticCredentialsSectionTitle'),
    scrollId: 'synthetic-credentials-section',
    title: t('in-settings:dialogs.scope.syntheticCredentialsSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedAlertChannelsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addAlertChannelsLabel')}
        tableTitle={t('in-settings:dialogs.scope.eventsAndAlertsSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.eventsAndAlertsSectionTitle'),
    scrollId: 'events-and-alerts-section',
    title: t('in-settings:dialogs.scope.eventsAndAlertsSectionTitle'),
    valid: true
  },
  {
    content: (
      <ScopeSection
        limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedAutomationsSwitchLabel')}
        tableAddLabel={t('in-settings:dialogs.scope.addAutomationsLabel')}
        tableTitle={t('in-settings:dialogs.scope.automationSectionTitle')}
      />
    ),
    label: t('in-settings:dialogs.scope.automationSectionTitle'),
    scrollId: 'automation-section',
    title: t('in-settings:dialogs.scope.automationSectionTitle'),
    valid: true
  }
];
