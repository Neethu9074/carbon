/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';

import {
  teamSettings,
  teamSettingsAccessControlApiTokenDuplicate,
  teamSettingsAccessControlApiTokenEdit,
  teamSettingsAccessControlApiTokenNew,
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
  teamSettingsAlertingMaintenanceConfigurationEdit,
  teamSettingsAlertingMaintenanceConfigurationNew,
  teamSettingsAlertingMaintenanceConfigurations,
  teamSettingsLogManagementDeleteLogs,
  teamSettingsLogManagementLogVolume,
  teamSettingsLogManagementRetentionPeriod,
  teamSettingsIntegrationsLogging,
  teamSettingsIntegrationsLoggingCoralogix,
  teamSettingsIntegrationsLoggingElk,
  teamSettingsIntegrationsLoggingHumio,
  teamSettingsIntegrationsLoggingMezmo,
  teamSettingsIntegrationsLoggingSplunk,
  teamSettingsActionLogRetention,
  teamSettingsIntegrationsDatabase,
  teamSettingsIntegrationsDatabaseDbMarlin
} from 'in-settings/navigation/paths';
import RecurrentMaintenanceWindowsListPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceWindowsList';
import RecurrentMaintenanceWindowFormPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import {
  recurrentMaintenanceWindowEnabled,
  logRetentionPageEnabled,
  logVolumePageEnabled
} from 'in-services/featureFlags';
import MaintenanceWindowsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurations';
import MaintenanceWindowPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration';
import AlertChannelModificationPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelModification';
import GlobalCustomPayloadPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/GlobalCustomPayloadPage';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import RetentionPeriodPage from 'in-settings/tabs/TeamSettings/pages/logManagement/RententionPeriod/RetentionPeriod';
import DbIntegrations from 'in-settings/tabs/TeamSettings/pages/integrations/database/Integrations/DbIntegrations';
import LogIntegrations from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Integrations/Integrations';
import AlertChannelsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import ApiTokenFormDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokenFormDialog';
import AlertChannelPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannel';
import CoralogixPage from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Coralogix/Coralogix';
import BuiltInEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/BuiltInEvent';
import CustomEventPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEvent';
import DeleteLogsPage from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/DeleteLogs';
import DbMarlin from 'in-settings/tabs/TeamSettings/pages/integrations/database/DbMarlin/DbMarlin';
import LogVolumePage from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/LogVolume';
import ApiTokensPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import ApiTokenPage from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import SplunkPage from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Splunk/Splunk';
import MezmoPage from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Mezmo/Mezmo';
import HumioPage from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Humio/Humio';
import InvitesPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/Invites';
import EventsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import AlertsPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alerts';
import AccessLogPage from 'in-settings/tabs/TeamSettings/pages/audit/AccessLog/AccessLog';
import ActionLogPage from 'in-settings/tabs/TeamSettings/pages/audit/ActionLog/ActionLog';
import AlertPage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import GroupsPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Groups';
import GroupPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Group';
import ElkPage from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Elk/Elk';
import UsersPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Users';
import UserPage from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/User';
import { findFirstPermittedTeamPage } from 'in-settings/tabs/permissions';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';
import { apiTokenDialogEnabled } from 'in-services/featureFlags';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { pageNames } from 'in-services/tracking/pageNames';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function navigationTreeForRole(role, isAnyIDPActive) {
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
      if (!isAnyIDPActive) {
        accessControlPages.push({
          path: teamSettingsAccessControlInvites,
          label: t('in-settings:tabs.pendingInvitations'),
          component: InvitesPage
        });
      }
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
        subPages: apiTokenDialogEnabled
          ? [
              {
                path: teamSettingsAccessControlApiTokenEdit,
                component: ApiTokenFormDialog
              },
              {
                path: teamSettingsAccessControlApiTokenNew,
                component: ApiTokenFormDialog
              },
              {
                path: teamSettingsAccessControlApiTokenDuplicate,
                component: ApiTokenFormDialog
              }
            ]
          : [
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

  if (
    role.canConfigureEventsAndAlerts ||
    role.canConfigureIntegrations ||
    role.canConfigureMaintenanceWindows ||
    role.canConfigureGlobalAlertPayload
  ) {
    const eventsAndAlertsPages = [];

    if (role.canConfigureEventsAndAlerts) {
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

    if (role.canConfigureMaintenanceWindows) {
      if (recurrentMaintenanceWindowEnabled) {
        eventsAndAlertsPages.push({
          path: teamSettingsAlertingMaintenanceConfigurations,
          label: t('in-settings:tabs.maintenanceWindows'),
          component: RecurrentMaintenanceWindowsListPage,
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

    if (role.canConfigureGlobalAlertPayload) {
      eventsAndAlertsPages.push({
        path: teamSettingsAlertingCustomPayloadConfiguration,
        label: t('in-settings:tabs.customPayload'),
        component: GlobalCustomPayloadPage
      });
    }

    navigationTree.push({
      title: t('in-settings:tabs.eventsAlerts'),
      pages: eventsAndAlertsPages
    });
  }

  const deleteLogsPage = {
    path: teamSettingsLogManagementDeleteLogs,
    label: t('in-settings:tabs.deleteLogs.deleteLogs'),
    component: DeleteLogsPage
  };

  const retentionPeriodPage = {
    path: teamSettingsLogManagementRetentionPeriod,
    label: 'Retention Period',
    component: RetentionPeriodPage
  };
  const logVolumePage = {
    path: teamSettingsLogManagementLogVolume,
    label: t('in-settings:tabs.logVolume.logVolume'),
    component: LogVolumePage
  };

  if (role.canDeleteLogs || role.canViewLogVolume || role.canConfigureLogRetentionPeriod) {
    let pages = [];

    if (role.canDeleteLogs) {
      pages.push(deleteLogsPage);
    }
    if (role.canConfigureLogRetentionPeriod && logRetentionPageEnabled) {
      pages.unshift(retentionPeriodPage);
    }

    if (role.canViewLogVolume && logVolumePageEnabled) {
      pages.push(logVolumePage);
    }

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
          component: ActionLogPage,
          subPages: [
            {
              path: teamSettingsActionLogRetention,
              component: ActionLogPage
            }
          ]
        },
        {
          path: teamSettingsAccessLog,
          label: t('in-settings:tabs.accessLog'),
          component: AccessLogPage
        }
      ]
    });
  }

  if (role.canConfigureLogManagement || role.canConfigureDatabaseManagement) {
    let pages = [];

    if (role.canConfigureDatabaseManagement) {
      const dbIntegrationPages = {
        path: teamSettingsIntegrationsDatabase,
        label: t('in-settings:tabs.team.integrations.database.database'),
        component: DbIntegrations,
        subPages: [
          {
            path: teamSettingsIntegrationsDatabaseDbMarlin,
            label: t('in-settings:tabs.team.integrations.database.dbMarlin'),
            component: DbMarlin
          }
        ]
      };
      pages.push(dbIntegrationPages);
    }

    if (role.canConfigureLogManagement) {
      const logIntegrationPages = {
        path: teamSettingsIntegrationsLogging,
        label: 'Logging',
        component: LogIntegrations,
        subPages: [
          {
            path: teamSettingsIntegrationsLoggingCoralogix,
            label: t('in-settings:tabs.coralogix'),
            component: CoralogixPage
          },
          {
            path: teamSettingsIntegrationsLoggingElk,
            label: t('in-settings:tabs.elk'),
            component: ElkPage
          },
          {
            path: teamSettingsIntegrationsLoggingHumio,
            label: t('in-settings:tabs.humio'),
            component: HumioPage
          },
          {
            path: teamSettingsIntegrationsLoggingMezmo,
            label: t('in-settings:tabs.mezmo'),
            component: MezmoPage
          },
          {
            path: teamSettingsIntegrationsLoggingSplunk,
            label: t('in-settings:tabs.splunk'),
            component: SplunkPage
          }
        ]
      };
      pages.push(logIntegrationPages);
    }

    navigationTree.push({
      title: t('in-settings:tabs.integrations.integrations'),
      pages
    });
  }

  return navigationTree;
}

export default function View(props) {
  const isAnyIDPActive = useIsAnyIdPActive();
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.team_settings
        }}
      />

      <StickySidebarNavigationAndContent
        navigationTree={navigationTreeForRole(role, isAnyIDPActive)}
        redirectToDefaultPage={findFirstPermittedTeamPage()}
        redirectFrom={teamSettings}
        NotFoundPage={NotFoundPage}
        {...props}
      />
    </Fragment>
  );
}
