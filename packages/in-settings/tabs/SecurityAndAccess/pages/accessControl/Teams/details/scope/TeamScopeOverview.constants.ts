/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TeamScopeArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/scope/TeamScopeOverview.types';
import { t } from 'in-i18n';

export const TEAM_SCOPE_AREAS: Array<TeamScopeArea> = [
  {
    id: 'websites-mobile-apps',
    title: t('in-settings:tabs.teams.scopeWebsitesAndMobileApps'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeWebsitesAndMobileAppsSubtitle', {
        websitesCount: scope?.websites?.length,
        mobileAppsCount: scope?.mobileApps?.length
      });
    },
    items: scope => {
      return [
        { id: 'websites', title: t('in-settings:tabs.teams.scopeSectionWebsites'), items: scope?.websites },
        { id: 'mobile-apps', title: t('in-settings:tabs.teams.scopeSectionMobileApps'), items: scope?.mobileApps }
      ];
    }
  },
  {
    id: 'business-monitoring',
    title: t('in-settings:tabs.teams.scopeBusinessMonitoring'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeBusinessMonitoringSubtitle', {
        count: scope?.businessPerspectives?.length
      });
    },
    items: scope => {
      return [{ id: 'business-perspectives', items: scope?.businessPerspectives }];
    }
  },
  {
    id: 'applications',
    title: t('in-settings:tabs.teams.scopeApplications'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeApplicationsSubtitle', { count: scope?.applications?.length });
    },
    items: scope => {
      return [{ id: 'application-perspectives', items: scope?.applications }];
    }
  },
  {
    id: 'platforms-infrastructure',
    title: t('in-settings:tabs.teams.scopePlatformsAndInfrastructure'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopePlatformsAndInfrastructureSubtitle', {
        count: scope?.applications?.length
      });
    },
    items: scope => {
      return [{ id: 'entities', items: scope?.applications }];
    }
  },
  {
    id: 'synthetic-monitoring',
    title: t('in-settings:tabs.teams.scopeSyntheticMonitoring'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeSyntheticMonitoringSubtitle', {
        testsCount: scope?.syntheticTests?.length,
        credentialsCount: scope?.syntheticCredentials?.length
      });
    },
    items: scope => {
      return [
        { id: 'synthetic-tests', title: t('in-settings:tabs.teams.scopeSectionTests'), items: scope?.syntheticTests },
        {
          id: 'synthetic-credentials',
          title: t('in-settings:tabs.teams.scopeSectionCredentials'),
          items: scope?.syntheticCredentials
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
      return [{ id: 'automations', items: [] }];
    }
  },
  {
    id: 'alert-channels',
    title: t('in-settings:tabs.teams.scopeAlertChannels'),
    subtitle: () => {
      return t('in-settings:tabs.teams.scopeAlertChannelsSubtitle', { count: 0 });
    },
    items: () => {
      return [{ id: 'channels', items: [] }];
    }
  },
  {
    id: 'custom-dashboards',
    title: t('in-settings:tabs.teams.scopeCustomDashboards'),
    subtitle: () => {
      return t('in-settings:tabs.teams.scopeCustomDashboardsSubtitle', { count: 0 });
    },
    items: () => {
      return [{ id: 'dashboards', items: [] }];
    }
  }
];
