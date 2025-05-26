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
import { getAllKubernetesNamespacesForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesNamespacesForEntitySelection';
import {
  extractId,
  extractName
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.navItems';
import { getAllKubernetesClustersForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesClustersForEntitySelection';
import { getAllApplicationsForEntitySelectionWithDefaults } from 'in-applications/subscriptions/getAllApplicationsForEntitySelection';
import { parseActionFilter } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { getAllMobileAppsForEntitySelectionWithDefaults } from 'in-mobile-apps/subscriptions/getAllMobileAppsForEntitySelection';
import { ScopeArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeOverview.types';
import { getAllWebsitesForEntitySelectionWithDefaults } from 'in-websites/subscriptions/getAllWebsitesForEntitySelection';
import { TeamScopeEntity } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { ACTION_TRANSLATIONS, ACTION_TYPES } from 'in-automation/constants';
import { success, successObservable } from 'in-services/util/result';
import { getActionTags } from 'in-automation/api';
import { t } from 'in-i18n';

export const SCOPE_AREAS: Array<ScopeArea<TeamScopeEntity>> = [
  {
    id: 'websites-mobile-apps',
    title: t('in-settings:tabs.teams.scopeWebsitesAndMobileApps'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeWebsitesAndMobileAppsSubtitle', {
        websites: t('in-settings:tabs.teams.scopeWebsitesAndMobileAppsSubtitleWebsites', {
          count: scope?.websites?.length ?? 0
        }),
        mobileApps: t('in-settings:tabs.teams.scopeWebsitesAndMobileAppsSubtitleMobileApps', {
          count: scope?.mobileApps?.length ?? 0
        })
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
    id: 'business-processes',
    title: t('in-settings:tabs.teams.scopeBusinessProcesses'),
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeBusinessProcessesSubtitle', {
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
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopePlatformsAndInfrastructureSubtitle', {
        count: (scope?.kubernetesClusters?.length ?? 0) + (scope?.kubernetesNamespaces?.length ?? 0),
        infraDfq: scope?.infraDfqFilter ? ', DFQ' : null
      });
    },
    items: (scope, timeConfig) => {
      return [
        {
          id: 'kubernetes-namespaces',
          title: t('in-settings:tabs.teams.scopeSectionKubernetesNameSpaces'),
          items: scope?.kubernetesNamespaces,
          observable: () => getAllKubernetesNamespacesForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        },
        {
          id: 'kubernetes-clusters',
          title: t('in-settings:tabs.teams.scopeSectionKubernetesClusters'),
          items: scope?.kubernetesClusters,
          observable: () => getAllKubernetesClustersForEntitySelectionWithDefaults({ timeConfig }),
          extractId: extractId,
          extractName: extractName
        },
        {
          id: 'infrastructure',
          title: t('in-settings:tabs.teams.scopeInfrastructure'),
          items: ['dfqId'],
          observable: () => successObservable([{ id: 'dfqId', name: scope?.infraDfqFilter ?? '' }]),
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
        tests: t('in-settings:tabs.teams.scopeSyntheticMonitoringSubtitleTests', {
          count: scope?.syntheticTests?.length ?? 0
        }),
        credentials: t('in-settings:tabs.teams.scopeSyntheticMonitoringSubtitleCredentials', {
          count: scope?.syntheticCredentials?.length ?? 0
        })
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
    subtitle: scope => {
      return t('in-settings:tabs.teams.scopeAutomationsSubtitle', {
        actionTypes: t('in-settings:tabs.teams.scopeAutomationsSubtitleActionTypes', {
          count: parseActionFilter(scope?.actionFilter ?? '')?.actionTypes?.length ?? 0
        }),
        actionTags: t('in-settings:tabs.teams.scopeAutomationsSubtitleActionTags', {
          count: parseActionFilter(scope?.actionFilter ?? '')?.actionTags?.length ?? 0
        })
      });
    },
    items: scope => {
      return [
        {
          id: 'actionTypes',
          title: t('in-settings:tabs.teams.scopeSectionActionTypes'),
          items: parseActionFilter(scope?.actionFilter ?? '').actionTypes,
          observable: () =>
            just(
              success(
                ACTION_TYPES.map(type => ({
                  id: type,
                  name: ACTION_TRANSLATIONS[type]
                }))
              )
            ),
          extractId: extractId,
          extractName: extractName,
          displayType: 'tagSet'
        },
        {
          id: 'actionTags',
          title: t('in-settings:tabs.teams.scopeSectionActionTags'),
          items: parseActionFilter(scope?.actionFilter ?? '').actionTags,
          observable: () =>
            getActionTags().map(data =>
              success(
                data.data?.tags.map(tag => {
                  return { id: tag, name: tag };
                }) ?? []
              )
            ),
          extractId: extractId,
          extractName: extractName,
          displayType: 'tagSet'
        }
      ];
    }
  }
];
