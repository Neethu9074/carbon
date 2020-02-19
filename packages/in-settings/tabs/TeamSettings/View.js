// @flow
import React from 'react';

import {
  teamSettings,
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlInvites,
  teamSettingsAccessControlRoles,
  teamSettingsAccessControlRoleEdit,
  teamSettingsAccessControlRoleNew,
  teamSettingsAccessControlTeams,
  teamSettingsAccessControlTeamEdit,
  teamSettingsAccessControlTeamNew,
  teamSettingsAccessControlPermissionSets,
  teamSettingsAccessControlPermissionSetEdit,
  teamSettingsAccessControlPermissionSetNew,
  teamSettingsAccessControlApiTokens,
  teamSettingsAccessControlApiTokenEdit,
  teamSettingsAlertingEventCustomNew,
  teamSettingsAlertingEventCustomEdit,
  teamSettingsAlertingEventBuiltInEdit,
  teamSettingsAlertingEvents,
  teamSettingsAlertingAlertEdit,
  teamSettingsAlertingAlertNew,
  teamSettingsAlertingAlerts,
  teamSettingsAlertingAlertChannelEdit,
  teamSettingsAlertingAlertChannelEditDetails,
  teamSettingsAlertingAlertChannelNew,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingMaintenanceConfigurationEdit,
  teamSettingsAlertingMaintenanceConfigurationNew,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsAuditLog,
  teamSettingsLogManagementCoralogix,
  teamSettingsLogManagementElk,
  teamSettingsLogManagementHumio,
  teamSettingsLogManagementLogDna,
  teamSettingsLogManagementSplunk
} from 'in-settings/navigation/paths';
import PermissionSetsPage from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/PermissionSets';
import MaintenanceWindowsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurations';
import AlertChannelsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import MaintenanceWindowPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration';
import PermissionSetPage from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/PermissionSet';
import AlertChannelPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannel';
import BuiltInEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/BuiltInEvent';
import CustomEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEvent';
import AlertChannelModificationPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelModification';
import ApiTokensPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import CoralogixPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Coralogix/Coralogix';
import ApiTokenPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import InvitesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/Invites';
import EventsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import AlertsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alerts';
import AlertPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import SplunkPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Splunk/Splunk';
import LogDnaPage from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/LogDna';
import type { NavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import HumioPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/Humio';
import UsersPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Users';
import RolesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Roles';
import TeamsPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Teams/Teams';
import TeamPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Teams/Team';
import RolePage from 'in-settings/tabs/TeamSettings/pages/accessControl/Roles/Role';
import ElkPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/Elk';
import AuditLogPage from 'in-settings/tabs/TeamSettings/pages/audit/AuditLog';
import { findFirstPermittedTeamPage } from 'in-settings/tabs/permissions';
import { Page } from 'in-new-components/layout/SideNavigationAndContent';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { isRbacEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

function navigationTreeForRole(role): NavigationTree {
  const navigationTree: NavigationTree = [];

  if (role.canConfigureUsers || role.canConfigureRoles || role.canConfigureTeams || role.canConfigureApiTokens) {
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

    if (isRbacEnabled && role.canConfigureTeams) {
      accessControlPages.push({
        path: teamSettingsAccessControlTeams,
        label: 'Teams',
        component: TeamsPage,
        subPages: [
          {
            path: teamSettingsAccessControlTeamNew,
            component: TeamPage
          },
          {
            path: teamSettingsAccessControlTeamEdit,
            component: TeamPage
          }
        ]
      });

      accessControlPages.push({
        path: teamSettingsAccessControlPermissionSets,
        label: 'Access Scopes',
        component: PermissionSetsPage,
        subPages: [
          {
            path: teamSettingsAccessControlPermissionSetNew,
            component: PermissionSetPage
          },
          {
            path: teamSettingsAccessControlPermissionSetEdit,
            component: PermissionSetPage
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

  if (role.canConfigureCustomAlerts || role.canConfigureIntegrations) {
    const eventsAndAlertsPages = [];

    if (role.canConfigureCustomAlerts) {
      eventsAndAlertsPages.push({
        path: teamSettingsAlertingEvents,
        label: 'Events',
        component: EventsPage,
        subPages: [
          {
            path: teamSettingsAlertingEventCustomNew,
            component: CustomEventPage
          },
          {
            path: teamSettingsAlertingEventCustomEdit,
            component: CustomEventPage
          },
          {
            path: teamSettingsAlertingEventBuiltInEdit,
            component: BuiltInEventPage
          }
        ]
      });

      eventsAndAlertsPages.push({
        path: teamSettingsAlertingAlerts,
        label: 'Alerts',
        component: AlertsPage,
        subPages: [
          {
            path: teamSettingsAlertingAlertNew,
            component: AlertPage
          },
          {
            path: teamSettingsAlertingAlertEdit,
            component: AlertPage
          }
        ]
      });
    }

    if (role.canConfigureIntegrations) {
      eventsAndAlertsPages.push({
        path: teamSettingsAlertingAlertChannels,
        label: 'Alert Channels',
        component: AlertChannelsPage,
        subPages: [
          {
            path: teamSettingsAlertingAlertChannelNew,
            component: AlertChannelModificationPage
          },
          {
            path: teamSettingsAlertingAlertChannelEdit,
            component: AlertChannelPage
          },
          {
            path: teamSettingsAlertingAlertChannelEditDetails,
            component: AlertChannelModificationPage
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

  if (role.canConfigureLogManagement) {
    navigationTree.push({
      title: 'Log Management',
      pages: [
        {
          path: teamSettingsLogManagementCoralogix,
          label: 'Coralogix',
          component: CoralogixPage
        },
        {
          path: teamSettingsLogManagementElk,
          label: 'ELK',
          component: ElkPage
        },
        {
          path: teamSettingsLogManagementHumio,
          label: 'Humio',
          component: HumioPage
        },
        {
          path: teamSettingsLogManagementLogDna,
          label: 'LogDNA',
          component: LogDnaPage
        },
        {
          path: teamSettingsLogManagementSplunk,
          label: 'Splunk',
          component: SplunkPage
        }
      ]
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
      redirectToDefaultPage={findFirstPermittedTeamPage()}
      redirectFrom={teamSettings}
      NotFoundPage={NotFoundPage}
      {...props}
    />
  );
}
