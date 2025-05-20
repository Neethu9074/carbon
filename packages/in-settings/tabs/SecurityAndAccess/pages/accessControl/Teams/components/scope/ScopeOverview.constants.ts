/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { just } from '@instana/observables';

import {
  getAllSyntheticCredentialsForEntitySelectionWithDefaults,
  getAllSyntheticTestsForEntitySelectionWithDefaults
} from 'in-synthetics/subscriptions/getAllSyntheticTestsForEntitySelection';
import { getAllBusinessPerspectivesForEntitySelectionWithDefaults } from 'in-bizops/subscriptions/helpers/getAllBusinessPerspectivesForEntitySelectionWithDefaults';
import {
  extractId,
  extractName
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.navItems';
import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import { getAllMobileAppsForEntitySelectionWithDefaults } from 'in-mobile-apps/subscriptions/getAllMobileAppsForEntitySelection';
import { ScopeArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeOverview.types';
import { getAllWebsitesForEntitySelectionWithDefaults } from 'in-websites/subscriptions/getAllWebsitesForEntitySelection';
import { TeamScopeEntity } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

export const SCOPE_AREAS: Array<ScopeArea<TeamScopeEntity>> = [
  {
    id: 'websites-mobile-apps',
    title: t('in-settings:tabs.teams.scopeWebsitesAndMobileApps'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeWebsitesAndMobileAppsSubtitle', {
        websitesCount: scope?.websites?.length ?? 0,
        mobileAppsCount: scope?.mobileApps?.length ?? 0
      });
    },
    items: (scope, timeConfig) => {
      return [
        {
          id: 'websites',
          title: t('in-settings:tabs.teams.scopeSectionWebsites'),
          items: scope?.websites,
          observable: () => getAllWebsitesForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        },
        {
          id: 'mobile-apps',
          title: t('in-settings:tabs.teams.scopeSectionMobileApps'),
          items: scope?.mobileApps,
          observable: () => getAllMobileAppsForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  },
  {
    id: 'business-monitoring',
    title: t('in-settings:tabs.teams.scopeBusinessMonitoring'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeBusinessMonitoringSubtitle', {
        count: scope?.businessPerspectives?.length ?? 0
      });
    },
    items: (scope, timeConfig) => {
      return [
        {
          id: 'business-perspectives',
          items: scope?.businessPerspectives,
          observable: () => getAllBusinessPerspectivesForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  },
  {
    id: 'applications',
    title: t('in-settings:tabs.teams.scopeApplications'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeApplicationsSubtitle', { count: scope?.applications?.length ?? 0 });
    },
    items: (scope, timeConfig) => {
      return [
        {
          id: 'application-perspectives',
          items: scope?.applications,
          observable: () => getAllApplicationsForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  },
  {
    id: 'platforms-infrastructure',
    title: t('in-settings:tabs.teams.scopePlatformsAndInfrastructure'),
    subtitle: () => {
      return t('in-settings:tabs.teams.scopePlatformsAndInfrastructureSubtitle', {
        count: 0
      });
    },
    items: () => {
      return [
        {
          id: 'entities',
          items: [],
          observable: () => just(success([])),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  },
  {
    id: 'synthetic-monitoring',
    title: t('in-settings:tabs.teams.scopeSyntheticMonitoring'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeSyntheticMonitoringSubtitle', {
        testsCount: scope?.syntheticTests?.length ?? 0,
        credentialsCount: scope?.syntheticCredentials?.length ?? 0
      });
    },
    items: (scope, timeConfig) => {
      return [
        {
          id: 'synthetic-tests',
          title: t('in-settings:tabs.teams.scopeSectionTests'),
          items: scope?.syntheticTests,
          observable: () => getAllSyntheticTestsForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        },
        {
          id: 'synthetic-credentials',
          title: t('in-settings:tabs.teams.scopeSectionCredentials'),
          items: scope?.syntheticCredentials,
          observable: () => getAllSyntheticCredentialsForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  },
  {
    id: 'alert-channels',
    title: t('in-settings:tabs.teams.scopeAlertChannels'),
    subtitle: () => {
      return t('in-settings:tabs.teams.scopeAlertChannelsSubtitle', { count: 0 });
    },
    items: () => {
      return [
        {
          id: 'channels',
          items: [],
          observable: () => just(success([])),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  },
  {
    id: 'automations',
    title: t('in-settings:tabs.teams.scopeAutomations'),
    subtitle: () => {
      return t('in-settings:tabs.teams.scopeAutomationsSubtitle', { count: 0 });
    },
    items: () => {
      return [
        {
          id: 'automations',
          items: [],
          observable: () => just(success([])),
          extractId: extractId,
          extractName: extractName
        }
      ];
    }
  }
];
