import React, { Fragment } from 'react';

import {
  teamSettings,
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlUserEdit,
  teamSettingsAccessControlInvites,
  teamSettingsAccessControlGroups,
  teamSettingsAccessControlGroupEdit,
  teamSettingsAccessControlGroupNew,
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
  teamSettingsAlertingCustomPayloadConfiguration,
  teamSettingsAuditLog,
  teamSettingsLogManagementCoralogix,
  teamSettingsLogManagementElk,
  teamSettingsLogManagementHumio,
  teamSettingsLogManagementLogDna,
  teamSettingsLogManagementSplunk
} from 'in-settings/navigation/paths';
import MaintenanceWindowsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurations';
import MaintenanceWindowPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration';
import AlertChannelModificationPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelModification';
import AlertChannelsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import AlertChannelPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannel';
import CustomPayloadPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/CustomPayloadPage';
import BuiltInEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/BuiltInEvent';
import CustomEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEvent';
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
import GroupsPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Groups';
import GroupPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Group';
import HumioPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/Humio';
import UsersPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Users';
import UserPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/User';
import ElkPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/Elk';
import AuditLogPage from 'in-settings/tabs/TeamSettings/pages/audit/AuditLog';
import { findFirstPermittedTeamPage } from 'in-settings/tabs/permissions';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import { role } from 'in-stores/user';

function navigationTreeForRole(role) {
  const navigationTree = [];

  if (role.canConfigureUsers || role.canConfigureTeams || role.canConfigureApiTokens) {
    const accessControlPages = [];

    if (role.canConfigureUsers) {
      accessControlPages.push({
        path: teamSettingsAccessControlUsers,
        label: 'Users',
        component: UsersPage,
        subPages: [
          {
            path: teamSettingsAccessControlUserEdit,
            component: UserPage
          }
        ]
      });
      accessControlPages.push({
        path: teamSettingsAccessControlInvites,
        label: 'Pending Invitations',
        component: InvitesPage
      });
    }

    if (role.canConfigureTeams) {
      accessControlPages.push({
        path: teamSettingsAccessControlGroups,
        label: 'Groups',
        component: GroupsPage,
        subPages: [
          {
            path: teamSettingsAccessControlGroupNew,
            component: GroupPage
          },
          {
            path: teamSettingsAccessControlGroupEdit,
            component: GroupPage
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

    eventsAndAlertsPages.push({
      path: teamSettingsAlertingCustomPayloadConfiguration,
      label: 'Custom Payload',
      component: CustomPayloadPage
    });

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

export default function View(props) {
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: 'Settings',
          pageRootName: 'Team Settings'
        }}
      />

      <SideNavigationAndContent
        stickySidebar
        navigationTree={navigationTreeForRole(role)}
        redirectToDefaultPage={findFirstPermittedTeamPage()}
        redirectFrom={teamSettings}
        NotFoundPage={NotFoundPage}
        {...props}
      />
      <SetBodyColor color="#fff" />
    </Fragment>
  );
}
