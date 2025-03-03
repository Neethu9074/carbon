/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';

import { useObservable } from '@instana/hooks';

import {
  globalSettings,
  globalSettingsAlertingAlertChannelEdit,
  globalSettingsAlertingAlertChannelEditDetails,
  globalSettingsAlertingAlertChannelNew,
  globalSettingsAlertingAlertChannels,
  globalSettingsAlertingAlertEdit,
  globalSettingsAlertingAlertNew,
  globalSettingsAlertingAlerts,
  globalSettingsAlertingCustomPayloadConfiguration,
  globalSettingsAlertingEventBuiltInEdit,
  globalSettingsAlertingEventCustomEdit,
  globalSettingsAlertingEventCustomNew,
  globalSettingsAlertingEvents,
  globalSettingsAlertingMaintenanceConfigurationEdit,
  globalSettingsAlertingMaintenanceConfigurationNew,
  globalSettingsAlertingMaintenanceConfigurations,
  globalSettingsIntegrationsLogging,
  globalSettingsIntegrationsLoggingCoralogix,
  globalSettingsIntegrationsLoggingElk,
  globalSettingsIntegrationsLoggingFalconLogScale,
  globalSettingsIntegrationsLoggingMezmo,
  globalSettingsIntegrationsLoggingSplunk,
  globalSettingsIntegrationsDatabase,
  globalSettingsIntegrationsDatabaseDbMarlin
} from 'in-settings/navigation/paths';
import RecurrentMaintenanceWindowsListPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceWindowsList';
import RecurrentMaintenanceWindowFormPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigForm';
import MaintenanceWindowsPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurations';
import MaintenanceWindowPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfiguration';
import AlertChannelModificationPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelModification';
import GlobalCustomPayloadPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/GlobalCustomPayloadPage';
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import FalconLogScalePage from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/FalconLogScale/FalconLogScale';
import DbIntegrations from 'in-settings/tabs/GlobalSettings/pages/integrations/database/Integrations/DbIntegrations';
import LogIntegrations from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/Integrations';
import AlertChannelsPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannels';
import AlertChannelPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannel';
import CoralogixPage from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Coralogix/Coralogix';
import BuiltInEventPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/BuiltInEvent';
import CustomEventPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEvent';
import DbMarlin from 'in-settings/tabs/GlobalSettings/pages/integrations/database/DbMarlin/DbMarlin';
import SplunkPage from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Splunk/Splunk';
import MezmoPage from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Mezmo/Mezmo';
import EventsPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import AlertsPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alerts';
import AlertPage from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alert';
import ElkPage from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Elk/Elk';
import { recurrentMaintenanceWindowEnabled } from 'in-services/featureFlags';
import { findFirstPermittedGlobalPage } from 'in-settings/tabs/permissions';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { pageNames } from 'in-services/tracking/pageNames';
import { isAddonUserCached } from 'in-logging/api/licence';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function navigationTreeForRole(role) {
  const navigationTree = [];
  if (
    role.canConfigureEventsAndAlerts ||
    role.canConfigureIntegrations ||
    role.canConfigureMaintenanceWindows ||
    role.canConfigureGlobalAlertPayload
  ) {
    const eventsAndAlertsPages = [];

    if (role.canConfigureEventsAndAlerts) {
      eventsAndAlertsPages.push({
        path: globalSettingsAlertingEvents,
        label: t('in-settings:tabs.events'),
        component: EventsPage,
        subPages: [
          {
            path: globalSettingsAlertingEventCustomNew,
            component: CustomEventPage
          },
          {
            path: globalSettingsAlertingEventCustomEdit,
            component: CustomEventPage
          },
          {
            path: globalSettingsAlertingEventBuiltInEdit,
            component: BuiltInEventPage
          }
        ]
      });

      eventsAndAlertsPages.push({
        path: globalSettingsAlertingAlerts,
        label: t('in-settings:tabs.alerts'),
        component: AlertsPage,
        subPages: [
          {
            path: globalSettingsAlertingAlertNew,
            component: AlertPage
          },
          {
            path: globalSettingsAlertingAlertEdit,
            component: AlertPage
          }
        ]
      });
    }

    if (role.canConfigureIntegrations) {
      eventsAndAlertsPages.push({
        path: globalSettingsAlertingAlertChannels,
        label: t('in-settings:tabs.alertChannels'),
        component: AlertChannelsPage,
        subPages: [
          {
            path: globalSettingsAlertingAlertChannelNew,
            component: AlertChannelModificationPage
          },
          {
            path: globalSettingsAlertingAlertChannelEdit,
            component: AlertChannelPage
          },
          {
            path: globalSettingsAlertingAlertChannelEditDetails,
            component: AlertChannelModificationPage
          }
        ]
      });
    }

    if (role.canConfigureMaintenanceWindows) {
      if (recurrentMaintenanceWindowEnabled) {
        eventsAndAlertsPages.push({
          path: globalSettingsAlertingMaintenanceConfigurations,
          label: t('in-settings:tabs.maintenanceWindows'),
          component: RecurrentMaintenanceWindowsListPage,
          subPages: [
            {
              path: globalSettingsAlertingMaintenanceConfigurationEdit,
              component: RecurrentMaintenanceWindowFormPage
            }
          ]
        });
      } else {
        eventsAndAlertsPages.push({
          path: globalSettingsAlertingMaintenanceConfigurations,
          label: t('in-settings:tabs.maintenanceWindows'),
          component: MaintenanceWindowsPage,
          subPages: [
            {
              path: globalSettingsAlertingMaintenanceConfigurationNew,
              component: MaintenanceWindowPage
            },
            {
              path: globalSettingsAlertingMaintenanceConfigurationEdit,
              component: MaintenanceWindowPage
            }
          ]
        });
      }
    }

    if (role.canConfigureGlobalAlertPayload) {
      eventsAndAlertsPages.push({
        path: globalSettingsAlertingCustomPayloadConfiguration,
        label: t('in-settings:tabs.customPayload'),
        component: GlobalCustomPayloadPage
      });
    }

    navigationTree.push({
      title: t('in-settings:tabs.eventsAlerts'),
      pages: eventsAndAlertsPages
    });
  }

  if (role.canConfigureLogManagement || role.canConfigureDatabaseManagement) {
    let pages = [];

    if (role.canConfigureDatabaseManagement) {
      const dbIntegrationPages = {
        path: globalSettingsIntegrationsDatabase,
        label: t('in-settings:tabs.team.integrations.database.database'),
        component: DbIntegrations,
        subPages: [
          {
            path: globalSettingsIntegrationsDatabaseDbMarlin,
            label: t('in-settings:tabs.team.integrations.database.dbMarlin'),
            component: DbMarlin
          }
        ]
      };
      pages.push(dbIntegrationPages);
    }

    if (role.canConfigureLogManagement) {
      const logIntegrationPages = {
        path: globalSettingsIntegrationsLogging,
        label: 'Logging',
        component: LogIntegrations,
        subPages: [
          {
            path: globalSettingsIntegrationsLoggingCoralogix,
            label: t('in-settings:tabs.coralogix'),
            component: CoralogixPage
          },
          {
            path: globalSettingsIntegrationsLoggingElk,
            label: t('in-settings:tabs.elk'),
            component: ElkPage
          },
          {
            path: globalSettingsIntegrationsLoggingFalconLogScale,
            label: t('in-settings:tabs.falconLogScale'),
            component: FalconLogScalePage
          },
          {
            path: globalSettingsIntegrationsLoggingMezmo,
            label: t('in-settings:tabs.mezmo'),
            component: MezmoPage
          },
          {
            path: globalSettingsIntegrationsLoggingSplunk,
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
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.global_settings
        }}
      />

      <StickySidebarNavigationAndContent
        navigationTree={navigationTreeForRole(role, isLoggingAddonUser)}
        redirectToDefaultPage={findFirstPermittedGlobalPage()}
        redirectFrom={globalSettings}
        NotFoundPage={NotFoundPage}
        {...props}
      />
    </Fragment>
  );
}
