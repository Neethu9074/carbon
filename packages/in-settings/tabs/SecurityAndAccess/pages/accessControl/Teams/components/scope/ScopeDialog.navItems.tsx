/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { just } from '@instana/observables';

import {
  getAllSyntheticCredentialsForEntitySelectionWithDefaults,
  getAllSyntheticTestsForEntitySelectionWithDefaults
} from 'in-synthetics/subscriptions/getAllSyntheticTestsForEntitySelection';
import { getAllBusinessPerspectivesForEntitySelectionWithDefaults } from 'in-bizops/subscriptions/helpers/getAllBusinessPerspectivesForEntitySelectionWithDefaults';
import LimitedAccessSwitcher from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import { getAllMobileAppsForEntitySelectionWithDefaults } from 'in-mobile-apps/subscriptions/getAllMobileAppsForEntitySelection';
import { getAllWebsitesForEntitySelectionWithDefaults } from 'in-websites/subscriptions/getAllWebsitesForEntitySelection';
import ScopeSection from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection';
import { TeamScopeEntity } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { LimitedAccessScope } from 'in-stores/permission';
import { success } from 'in-services/util/result';
import { TimeConfig } from 'in-types';
import { Trans, t } from 'in-i18n';

export const extractName = (entity: TeamScopeEntity) => {
  return entity.name;
};

export const extractId = (entity: TeamScopeEntity): string => {
  return entity.id;
};

export const createNavItems = (timeConfig: TimeConfig) => {
  return [
    {
      content: <Trans i18nKey={'in-settings:dialogs.scope.generalSectionDescription'} />,
      label: t('in-settings:dialogs.scope.generalSectionTitle'),
      scrollId: 'general-section',
      title: undefined,
      valid: true
    },
    {
      content: (
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="websites"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_WEBSITES_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedWebsitesSwitchLabel')}
          observable={() => getAllWebsitesForEntitySelectionWithDefaults({ timeConfig })}
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
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="mobileApps"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedMobileAppsSwitchLabel')}
          observable={() => getAllMobileAppsForEntitySelectionWithDefaults({ timeConfig })}
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
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="businessPerspectives"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_BIZOPS_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedBusinessMonitoringSwitchLabel')}
          observable={() => getAllBusinessPerspectivesForEntitySelectionWithDefaults({ timeConfig })}
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
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="applications"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedApplicationsSwitchLabel')}
          observable={() => getAllApplicationsForEntitySelectionWithDefaults({ timeConfig })}
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
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="kubernetesClusters"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_KUBERNETES_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedPlatformsSwitchLabel')}
          tableAddLabel={t('in-settings:dialogs.scope.addClustersLabel')}
          tableTitle={t('in-settings:dialogs.scope.platformsSectionTitle')}
          observable={() => just(success([]))}
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
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="syntheticTests"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedSyntheticTestsSwitchLabel')}
          observable={() => getAllSyntheticTestsForEntitySelectionWithDefaults({ timeConfig })}
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
        <ScopeSection<TeamScopeEntity>
          extractId={extractId}
          extractName={extractName}
          fieldName="syntheticCredentials"
          limitedAccessScopes={[LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedSyntheticCredentialsSwitchLabel')}
          observable={() => getAllSyntheticCredentialsForEntitySelectionWithDefaults({ timeConfig })}
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
        <LimitedAccessSwitcher
          limitedAccessScopes={['LIMITED_ALERT_CHANNELS_SCOPE']}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedAlertChannelsSwitchLabel')}
        />
      ),
      label: t('in-settings:dialogs.scope.eventsAndAlertsSectionTitle'),
      scrollId: 'events-and-alerts-section',
      title: t('in-settings:dialogs.scope.eventsAndAlertsSectionTitle'),
      valid: true
    },
    {
      content: (
        <LimitedAccessSwitcher
          limitedAccessScopes={[LimitedAccessScope.LIMITED_AUTOMATION_SCOPE]}
          limitedAccessSwitchLabel={t('in-settings:dialogs.scope.limitedAutomationsSwitchLabel')}
        />
      ),
      label: t('in-settings:dialogs.scope.automationSectionTitle'),
      scrollId: 'automation-section',
      title: t('in-settings:dialogs.scope.automationSectionTitle'),
      valid: true
    }
  ];
};
