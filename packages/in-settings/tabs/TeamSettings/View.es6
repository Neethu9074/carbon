// @flow
import React from 'react';

import {
  teamSettings,
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlInvites,
  teamSettingsAccessControlRoles,
  teamSettingsAccessControlRoleEdit,
  teamSettingsAccessControlRoleNew,
  teamSettingsAccessControlApiTokens,
  teamSettingsAccessControlApiTokenEdit,
  teamSettingsKnowledgeManagementBuiltInRules,
  teamSettingsKnowledgeManagementBuiltInRuleEdit,
  teamSettingsKnowledgeManagementCustomRules,
  teamSettingsKnowledgeManagementCustomRuleEdit,
  teamSettingsKnowledgeManagementCustomRuleNew,
  teamSettingsKnowledgeManagementCustomIssues,
  teamSettingsKnowledgeManagementCustomIssueEdit,
  teamSettingsKnowledgeManagementCustomIssueNew,
  teamSettingsKnowledgeManagementCustomDynamicRules,
  teamSettingsKnowledgeManagementCustomDynamicRuleEdit,
  teamSettingsKnowledgeManagementCustomDynamicRuleNew,
  teamSettingsAlertingEventEdit,
  teamSettingsAlertingEventNew,
  teamSettingsAlertingEvents,
  teamSettingsAlertingEventFilterEdit,
  teamSettingsAlertingEventFilterNew,
  teamSettingsAlertingEventFilters,
  teamSettingsAlertingAlertChannelEdit,
  teamSettingsAlertingAlertChannelNew,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingMaintenanceConfigurationEdit,
  teamSettingsAlertingMaintenanceConfigurationNew,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsAlertingConfigurations,
  teamSettingsAlertingConfigurationEdit,
  teamSettingsAlertingConfigurationNew,
  teamSettingsAlertingIntegrations,
  teamSettingsAlertingIntegrationEdit,
  teamSettingsAlertingIntegrationNew,
  teamSettingsAuditLog,
  newServiceExtractionPath,
  serviceExtractionPath,
  generalServiceExtractionPath,
  httpServiceExtractionPath,
  batchServiceExtractionPath,
  ejbServiceExtractionPath,
  elasticsearchServiceExtractionPath,
  messageBrokerServiceExtractionPath
} from 'in-settings/navigation/paths';
import MessageBrokerServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import ElasticServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import GeneralServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import BatchServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/BatchServiceExtractionConfiguration';
import HttpServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import EjbServiceExtractionConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/EjbServiceExtractionConfiguration';
import ServiceExtractionRuleConfiguration from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtractionRuleConfig/ServiceExtractionRuleConfig';
import MaintenanceWindowsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurations';
import MaintenanceWindowPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration';
import CustomDynamicRulesPage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomDynamicRules/CustomDynamicRules';
import CustomDynamicRulePage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomDynamicRules/CustomDynamicRule';
import BuiltInRulesPage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/BuiltInRules/BuiltInRules';
import CustomIssuesPage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomIssues/CustomIssues';
import CustomIssuePage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomIssues/CustomIssue';
import BuiltInRulePage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/BuiltInRules/BuiltInRule';
import CustomRulesPage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomRules/CustomRules';
import CustomRulePage from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomRules/CustomRule';
import ConfigurationsPage from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Configurations/Configurations';
import ConfigurationPage from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Configurations/Configuration';
import AlertChannelsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import AlertChannelPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannel';
import EventFiltersPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/EventFilters';
import IntegrationsPage from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Integrations/Integrations';
import EventFilterPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/EventFilter';
import IntegrationPage from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Integrations/Integration';
import ApiTokensPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import { forecastsEnabled, twoZeroModeEnabled, unifiedAlerting } from 'in-services/featureFlags';
import ApiTokenPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import type { NavigationTree, Page } from 'in-new-components/layout/SideNavigationAndContent';
import InvitesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/Invites';
import EventsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import EventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Event';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import UsersPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Users';
import RolesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Roles';
import RolePage from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Role';
import AuditLogPage from 'in-settings/tabs/TeamSettings/pages/audit/AuditLog';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { role } from 'in-stores/user';

function navigationTreeForRole(role): NavigationTree {
  const navigationTree: NavigationTree = [];

  if (role.canConfigureServiceMapping && !twoZeroModeEnabled) {
    navigationTree.push({
      title: 'Service Extraction',
      pages: [
        {
          path: generalServiceExtractionPath,
          label: 'General Rules',
          component: GeneralServiceExtractionConfiguration,
          subPages: [
            {
              path: newServiceExtractionPath,
              component: ServiceExtractionRuleConfiguration
            },
            {
              path: serviceExtractionPath,
              component: ServiceExtractionRuleConfiguration
            }
          ]
        },
        {
          path: httpServiceExtractionPath,
          label: 'HTTP Rules',
          component: HttpServiceExtractionConfiguration
        },
        {
          path: batchServiceExtractionPath,
          label: 'Batch Rules',
          component: BatchServiceExtractionConfiguration
        },
        {
          path: ejbServiceExtractionPath,
          label: 'EJB Rules',
          component: EjbServiceExtractionConfiguration
        },
        {
          path: elasticsearchServiceExtractionPath,
          label: 'Elasticsearch Rules',
          component: ElasticServiceExtractionConfiguration
        },
        {
          path: messageBrokerServiceExtractionPath,
          label: 'Message Broker Rules',
          component: MessageBrokerServiceExtractionConfiguration
        }
      ]
    });
  }

  if (role.canConfigureUsers || role.canConfigureRoles || role.canConfigureApiTokens) {
    const accessControlPages: Array<Page> = [];

    if (role.canConfigureUsers) {
      accessControlPages.push({
        path: teamSettingsAccessControlUsers,
        label: 'Users',
        component: UsersPage
      });
      accessControlPages.push({
        path: teamSettingsAccessControlInvites,
        label: 'Pending Invitations',
        component: InvitesPage
      });
    }

    if (role.canConfigureRoles) {
      accessControlPages.push({
        path: teamSettingsAccessControlRoles,
        label: 'Roles',
        component: RolesPage,
        subPages: [
          {
            path: teamSettingsAccessControlRoleNew,
            component: RolePage
          },
          {
            path: teamSettingsAccessControlRoleEdit,
            component: RolePage
          }
        ]
      });
    }

    if (role.canConfigureApiTokens) {
      accessControlPages.push({
        path: teamSettingsAccessControlApiTokens,
        label: 'API Tokens',
        component: ApiTokensPage,
        subPages: [
          {
            path: teamSettingsAccessControlApiTokenEdit,
            component: ApiTokenPage
          }
        ]
      });
    }

    navigationTree.push({
      title: 'Access Control',
      pages: accessControlPages
    });
  }

  if (unifiedAlerting && (role.canConfigureCustomAlerts || role.canConfigureIntegrations)) {
    const eventsAndAlertsPages = [];

    if (role.canConfigureCustomAlerts && role.canConfigureIntegrations) {
      eventsAndAlertsPages.push({
        path: teamSettingsAlertingEvents,
        label: 'Events',
        component: EventsPage,
        subPages: [
          {
            path: teamSettingsAlertingEventNew,
            component: EventPage
          },
          {
            path: teamSettingsAlertingEventEdit,
            component: EventPage
          }
        ]
      });

      eventsAndAlertsPages.push({
        path: teamSettingsAlertingEventFilters,
        label: 'Event Filters',
        component: EventFiltersPage,
        subPages: [
          {
            path: teamSettingsAlertingEventFilterNew,
            component: EventFilterPage
          },
          {
            path: teamSettingsAlertingEventFilterEdit,
            component: EventFilterPage
          }
        ]
      });

      eventsAndAlertsPages.push({
        path: teamSettingsAlertingAlertChannels,
        label: 'Alert Channels',
        component: AlertChannelsPage,
        subPages: [
          {
            path: teamSettingsAlertingAlertChannelNew,
            component: AlertChannelPage
          },
          {
            path: teamSettingsAlertingAlertChannelEdit,
            component: AlertChannelPage
          }
        ]
      });
    }

    if (role.canConfigureCustomAlerts) {
      eventsAndAlertsPages.push({
        path: teamSettingsAlertingMaintenanceConfigurations,
        label: 'Maintenance Windows',
        component: MaintenanceWindowsPage,
        subPages: [
          {
            path: teamSettingsAlertingMaintenanceConfigurationNew,
            component: MaintenanceWindowPage
          },
          {
            path: teamSettingsAlertingMaintenanceConfigurationEdit,
            component: MaintenanceWindowPage
          }
        ]
      });
    }

    navigationTree.push({
      title: 'Events & Alerts',
      pages: eventsAndAlertsPages
    });
  }

  if (!unifiedAlerting && role.canConfigureCustomAlerts) {
    const legacyKnowledgeManagementPages = [
      {
        path: teamSettingsKnowledgeManagementBuiltInRules,
        label: 'Built-in Rules',
        component: BuiltInRulesPage,
        subPages: [
          {
            path: teamSettingsKnowledgeManagementBuiltInRuleEdit,
            component: BuiltInRulePage
          }
        ]
      },
      {
        path: teamSettingsKnowledgeManagementCustomRules,
        label: 'Custom Rules',
        component: CustomRulesPage,
        subPages: [
          {
            path: teamSettingsKnowledgeManagementCustomRuleNew,
            component: CustomRulePage
          },
          {
            path: teamSettingsKnowledgeManagementCustomRuleEdit,
            component: CustomRulePage
          }
        ]
      },
      {
        path: teamSettingsKnowledgeManagementCustomIssues,
        label: 'Custom Issues',
        component: CustomIssuesPage,
        subPages: [
          {
            path: teamSettingsKnowledgeManagementCustomIssueNew,
            component: CustomIssuePage
          },
          {
            path: teamSettingsKnowledgeManagementCustomIssueEdit,
            component: CustomIssuePage
          }
        ]
      }
    ];

    if (forecastsEnabled) {
      legacyKnowledgeManagementPages.push({
        path: teamSettingsKnowledgeManagementCustomDynamicRules,
        label: 'Custom Dynamic Rules',
        component: CustomDynamicRulesPage,
        subPages: [
          {
            path: teamSettingsKnowledgeManagementCustomDynamicRuleNew,
            component: CustomDynamicRulePage
          },
          {
            path: teamSettingsKnowledgeManagementCustomDynamicRuleEdit,
            component: CustomDynamicRulePage
          }
        ]
      });
    }

    navigationTree.push({
      title: 'Knowledge',
      pages: legacyKnowledgeManagementPages
    });
  }

  if (!unifiedAlerting && (role.canConfigureIntegrations || role.canConfigureCustomAlerts)) {
    const legacyAlertingPages: Array<Page> = [];

    if (role.canConfigureCustomAlerts) {
      legacyAlertingPages.push({
        path: teamSettingsAlertingConfigurations,
        label: 'Configurations',
        component: ConfigurationsPage,
        subPages: [
          {
            path: teamSettingsAlertingConfigurationNew,
            component: ConfigurationPage
          },
          {
            path: teamSettingsAlertingConfigurationEdit,
            component: ConfigurationPage
          }
        ]
      });
    }

    if (role.canConfigureIntegrations) {
      legacyAlertingPages.push({
        path: teamSettingsAlertingIntegrations,
        label: 'Integrations',
        component: IntegrationsPage,
        subPages: [
          {
            path: teamSettingsAlertingIntegrationNew,
            component: IntegrationPage
          },
          {
            path: teamSettingsAlertingIntegrationEdit,
            component: IntegrationPage
          }
        ]
      });
    }

    if (role.canConfigureCustomAlerts) {
      legacyAlertingPages.push({
        path: teamSettingsAlertingMaintenanceConfigurations,
        label: 'Maintenance Windows',
        component: MaintenanceWindowsPage,
        subPages: [
          {
            path: teamSettingsAlertingMaintenanceConfigurationNew,
            component: MaintenanceWindowPage
          },
          {
            path: teamSettingsAlertingMaintenanceConfigurationEdit,
            component: MaintenanceWindowPage
          }
        ]
      });
    }

    navigationTree.push({
      title: 'Alerting',
      pages: legacyAlertingPages
    });
  }

  if (role.canViewAuditLog) {
    navigationTree.push({
      title: 'Audit',
      pages: [
        {
          path: teamSettingsAuditLog,
          label: 'Audit Log',
          component: AuditLogPage
        }
      ]
    });
  }

  return navigationTree;
}

export default function View(props: any) {
  return (
    <SideNavigationAndContent
      stickySidebar
      navigationTree={navigationTreeForRole(role)}
      redirectToDefaultPage={teamSettingsAccessControlUsers}
      redirectFrom={teamSettings}
      NotFoundPage={NotFoundPage}
      {...props}
    />
  );
}
