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
  teamSettingsAlertingConfigurations,
  teamSettingsAlertingConfigurationEdit,
  teamSettingsAlertingConfigurationNew,
  teamSettingsAlertingIntegrations,
  teamSettingsAlertingIntegrationEdit,
  teamSettingsAlertingIntegrationNew,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsAlertingMaintenanceConfigurationEdit,
  teamSettingsAlertingMaintenanceConfigurationNew,
  teamSettingsAuditLog,
  newServiceExtractionPath,
  serviceExtractionPath,
  generalServiceExtractionPath,
  httpServiceExtractionPath,
  batchServiceExtractionPath,
  ejbServiceExtractionPath,
  elasticsearchServiceExtractionPath,
  messageBrokerServiceExtractionPath
} from 'in-views/configurationView/navigation/paths';
import MessageBrokerServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/MessageBrokerServiceExtractionConfiguration';
import ElasticServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/ElasticServiceExtractionConfiguration';
import GeneralServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/GeneralServiceExtractionConfiguration';
import BatchServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/BatchServiceExtractionConfiguration';
import HttpServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/HttpServiceExtractionConfiguration';
import EjbServiceExtractionConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtraction/configs/EjbServiceExtractionConfiguration';
import ServiceExtractionRuleConfiguration from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtractionRuleConfig/ServiceExtractionRuleConfig';
import MaintenanceWindowsPage from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/MaintenanceConfigurations/MaintenanceConfigurations';
import MaintenanceWindowPage from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/MaintenanceConfigurations/MaintenanceConfiguration';
import CustomDynamicRulesPage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/CustomDynamicRules';
import CustomDynamicRulePage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/CustomDynamicRule';
import BuiltInRulesPage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/BuiltInRules/BuiltInRules';
import CustomIssuesPage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomIssues/CustomIssues';
import CustomIssuePage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomIssues/CustomIssue';
import BuiltInRulePage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/BuiltInRules/BuiltInRule';
import CustomRulesPage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomRules/CustomRules';
import CustomRulePage from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/CustomRules/CustomRule';
import ConfigurationsPage from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/Configurations';
import ConfigurationPage from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/Configuration';
import IntegrationsPage from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/Integrations';
import IntegrationPage from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/Integration';
import ApiTokensPage from 'in-views/configurationView/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import ApiTokenPage from 'in-views/configurationView/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import InvitesPage from 'in-views/configurationView/tabs/TeamSettings/pages/accessControl/Invites/Invites';
import UsersPage from 'in-views/configurationView/tabs/TeamSettings/pages/accessControl/Users/Users';
import RolesPage from 'in-views/configurationView/tabs/TeamSettings/pages/accessControl/Roles/Roles';
import RolePage from 'in-views/configurationView/tabs/TeamSettings/pages/accessControl/Roles/Role';
import AuditLogPage from 'in-views/configurationView/tabs/TeamSettings/pages/audit/AuditLog';
import type { NavigationTree, Page } from 'in-new-components/SideNavigationAndContent';
import SideNavigationAndContent from 'in-new-components/SideNavigationAndContent';
import { forecastsEnabled, twoZeroModeEnabled } from 'in-services/featureFlags';
import NotFoundPage from 'in-views/configurationView/tabs/pages/NotFound';
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

  if (role.canConfigureCustomAlerts) {
    const knowledgeManagementPages = [
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
      knowledgeManagementPages.push({
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
      pages: knowledgeManagementPages
    });
  }

  if (role.canConfigureIntegrations || role.canConfigureCustomAlerts) {
    const alertingPages: Array<Page> = [];

    if (role.canConfigureCustomAlerts) {
      alertingPages.push({
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
      alertingPages.push({
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
      alertingPages.push({
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
      pages: alertingPages
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
      navigationTree={navigationTreeForRole(role)}
      redirectToDefaultPage={teamSettingsAccessControlUsers}
      redirectFrom={teamSettings}
      NotFoundPage={NotFoundPage}
      {...props}
    />
  );
}
