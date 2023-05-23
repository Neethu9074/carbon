/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';

import {
  teamSettings,
  teamSettingsAccessControlApiTokenEdit,
  teamSettingsAccessControlApiTokens,
  teamSettingsAccessControlGroupEdit,
  teamSettingsAccessControlGroupNew,
  teamSettingsAccessControlGroups,
  teamSettingsAccessControlInvites,
  teamSettingsAccessControlUserEdit,
  teamSettingsAccessControlUsers,
  teamSettingsAccessLog,
  teamSettingsActionLog,
  teamSettingsAlertingAlertChannelEdit,
  teamSettingsAlertingAlertChannelEditDetails,
  teamSettingsAlertingAlertChannelNew,
  teamSettingsAlertingAlertChannels,
  teamSettingsAlertingAlertEdit,
  teamSettingsAlertingAlertNew,
  teamSettingsAlertingAlerts,
  teamSettingsAlertingCustomPayloadConfiguration,
  teamSettingsAlertingEventBuiltInEdit,
  teamSettingsAlertingEventCustomEdit,
  teamSettingsAlertingEventCustomNew,
  teamSettingsAlertingEvents,
  teamSettingsAlertingHub,
  teamSettingsAlertingMaintenanceConfigurationEdit,
  teamSettingsAlertingMaintenanceConfigurationNew,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsLogManagementCoralogix,
  teamSettingsLogManagementDeleteLogs,
  teamSettingsLogManagementElk,
  teamSettingsLogManagementHumio,
  teamSettingsLogManagementLogDna,
  teamSettingsLogManagementSplunk
} from 'in-settings/navigation/paths';
import RecurrentMaintenanceWindowsListPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceWindowsList';
import MaintenanceWindowsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurations';
import MaintenanceWindowPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration';
import AlertChannelModificationPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelModification';
import RecurrentMaintenanceWindowFormPage from './pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import GlobalCustomPayloadPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/GlobalCustomPayloadPage';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import AlertChannelsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import AlertChannelPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannel';
import { applicationSmartAlertsEnabled, recurrentMaintenanceWindowEnabled } from 'in-services/featureFlags';
import BuiltInEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/BuiltInEvent';
import CustomEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEvent';
import DeleteLogsPage from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/DeleteLogs';
import ApiTokensPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import CoralogixPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Coralogix/Coralogix';
import ApiTokenPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import InvitesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/Invites';
import EventsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import AlertsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alerts';
import AccessLogPage from 'in-settings/tabs/TeamSettings/pages/audit/AccessLog/AccessLog';
import ActionLogPage from 'in-settings/tabs/TeamSettings/pages/audit/ActionLog/ActionLog';
import AlertPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SplunkPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Splunk/Splunk';
import LogDnaPage from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/LogDna';
import GroupsPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Groups';
import GroupPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Group';
import HumioPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/Humio';
import UsersPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Users';
import UserPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/User';
import AlertsHub from 'in-alerting/smart-alerts/components/alerts-hub/AlertsHub';
import ElkPage from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/Elk';
import { findFirstPermittedTeamPage } from 'in-settings/tabs/permissions';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function navigationTreeForRole(role) {
  const navigationTree = [];

  if (role.canConfigureUsers || role.canConfigureTeams || role.canConfigureApiTokens) {
    const accessControlPages = [];

    if (role.canConfigureUsers) {
      accessControlPages.push({
        path: teamSettingsAccessControlUsers,
        label: t('in-settings:tabs.users'),
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
        label: t('in-settings:tabs.pendingInvitations'),
        component: InvitesPage
      });
    }

    if (role.canConfigureTeams) {
      accessControlPages.push({
        path: teamSettingsAccessControlGroups,
        label: t('in-settings:tabs.groups'),
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
        label: t('in-settings:tabs.apiTokens'),
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
      title: t('in-settings:tabs.accessControl'),
      pages: accessControlPages
    });
  }

  if (role.canConfigureCustomAlerts || role.canConfigureIntegrations) {
    const eventsAndAlertsPages = [];

    if (role.canConfigureCustomAlerts) {
      if (applicationSmartAlertsEnabled) {
        eventsAndAlertsPages.push({
          path: teamSettingsAlertingHub,
          label: t('in-alerting:smartAlerts.components.alertsHub.title'),
          component: AlertsHub
        });
      }

      eventsAndAlertsPages.push({
        path: teamSettingsAlertingEvents,
        label: t('in-settings:tabs.events'),
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
        label: t('in-settings:tabs.alerts'),
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
        label: t('in-settings:tabs.alertChannels'),
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
      if (recurrentMaintenanceWindowEnabled) {
        eventsAndAlertsPages.push({
          path: teamSettingsAlertingMaintenanceConfigurations,
          label: t('in-settings:tabs.maintenanceWindows'),
          component: RecurrentMaintenanceWindowsListPage,
          isBeta: true,
          subPages: [
            {
              path: teamSettingsAlertingMaintenanceConfigurationEdit,
              component: RecurrentMaintenanceWindowFormPage
            }
          ]
        });
      } else {
        eventsAndAlertsPages.push({
          path: teamSettingsAlertingMaintenanceConfigurations,
          label: t('in-settings:tabs.maintenanceWindows'),
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
    }

    eventsAndAlertsPages.push({
      path: teamSettingsAlertingCustomPayloadConfiguration,
      label: t('in-settings:tabs.customPayload'),
      component: GlobalCustomPayloadPage
    });

    navigationTree.push({
      title: t('in-settings:tabs.eventsAlerts'),
      pages: eventsAndAlertsPages
    });
  }

  if (role.canConfigureLogManagement) {
    const pages = [
      {
        path: teamSettingsLogManagementCoralogix,
        label: t('in-settings:tabs.coralogix'),
        component: CoralogixPage
      },
      {
        path: teamSettingsLogManagementElk,
        label: t('in-settings:tabs.elk'),
        component: ElkPage
      },
      {
        path: teamSettingsLogManagementHumio,
        label: t('in-settings:tabs.humio'),
        component: HumioPage
      },
      {
        path: teamSettingsLogManagementLogDna,
        label: t('in-settings:tabs.logDna'),
        component: LogDnaPage
      },
      {
        path: teamSettingsLogManagementSplunk,
        label: t('in-settings:tabs.splunk'),
        component: SplunkPage
      }
    ];

    /**
     TODO: change this when implemented on BE
     Also add the permissions settings in
     in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants.ts
     **/
    if (__DEV__)
      pages.push({
        path: teamSettingsLogManagementDeleteLogs,
        label: t('in-settings:tabs.deleteLogs.deleteLogs'),
        component: DeleteLogsPage
      });

    navigationTree.push({
      title: t('in-settings:tabs.logManagement'),
      pages
    });
  }

  if (role.canViewAuditLog) {
    navigationTree.push({
      title: t('in-settings:tabs.audit'),
      pages: [
        {
          path: teamSettingsActionLog,
          label: t('in-settings:tabs.actionLog'),
          component: ActionLogPage
        },
        {
          path: teamSettingsAccessLog,
          label: t('in-settings:tabs.accessLog'),
          component: AccessLogPage
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

      <StickySidebarNavigationAndContent
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
