/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  userSettings,
  securityAndAccess,
  securityAndAccessAudit,
  accessControl,
  globalSettingsAlertingMaintenanceConfigurations,
  globalSettingsAlertingEvents,
  globalSettingsAlertingAlerts,
  globalSettingsAlertingAlertChannels,
  globalSettingsAlertingCustomPayloadConfiguration,
  logManagement
} from 'in-settings/navigation/paths';
import {
  isSyntheticMonitoringView,
  syntheticSmartAlertsPath,
  syntheticLocationPath
} from 'in-synthetics/navigation/paths';
//@ts-expect-error TS migration needed
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
//@ts-expect-error TS migration needed
import { openstack } from 'in-openstack/navigation/paths';
import { physicalPath, agentsPath, eventsPath } from 'in-stores/navigation/paths/mainPaths';
//@ts-expect-error TS migration needed
import { ibmp } from 'in-phmc/navigation/paths';
//@ts-expect-error TS migration needed
import { sap } from 'in-sap/navigation/paths';
import { automationRoot, actionHistoryPath } from 'in-automation/navigation/paths';
import { alertsList, isApplicationsView } from 'in-applications/navigation/paths';
import { mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';
import { cloudfoundry } from 'in-cloudfoundry/navigation/paths';
import { isSloView } from 'in-service-levels/navigation/path';
import { kubernetes } from 'in-kubernetes/navigation/paths';
import { isBizOpsView } from 'in-bizops/navigation/paths';
import { analyze } from 'in-analyze/navigation/constants';
import { explore } from 'in-kubernetes/navigation/paths';
import { powervc } from 'in-powervc/navigation/paths';
import { vsphere } from 'in-vsphere/navigation/paths';
import { ibmz } from 'in-zhmc/navigation/paths';
import { t } from 'in-i18n';

export default function AssistMeSearchKeyword() {
  const { matchLocation } = useNavigation();

  if (matchLocation(isBizOpsView)) {
    return t('in-plg:assistme.dataSearchContext.businessMonitoring');
  }

  if (matchLocation(isApplicationsView)) {
    if (matchLocation(alertsList)) {
      return t('in-plg:assistme.dataSearchContext.smartAlerts');
    }

    return t('in-plg:assistme.dataSearchContext.application');
  }

  if (matchLocation(isSyntheticMonitoringView)) {
    if (matchLocation(syntheticSmartAlertsPath)) {
      return t('in-plg:assistme.dataSearchContext.syntheticAlerts');
    }

    if (matchLocation(syntheticLocationPath)) {
      return t('in-plg:assistme.dataSearchContext.syntheticPop');
    }

    return t('in-plg:assistme.dataSearchContext.synthetic');
  }

  if (matchLocation(isSloView)) {
    return t('in-plg:assistme.dataSearchContext.serviceLevel');
  }

  for (const [path, searchWord] of Object.entries(SEARCH_WORD_MAP)) {
    if (matchLocation(path)) {
      return searchWord;
    }
  }
  return t('in-plg:assistme.dataSearchContext.gettingStarted');
}

const SEARCH_WORD_MAP = {
  [websiteMonitoringPath]: t('in-plg:assistme.dataSearchContext.websites'),
  [mobileAppMonitoringPath]: t('in-plg:assistme.dataSearchContext.mobileApps'),
  [cloudfoundry]: t('in-plg:assistme.dataSearchContext.cloudFoundry'),
  [ibmp]: t('in-plg:assistme.dataSearchContext.powerHmc'),
  [openstack]: t('in-plg:assistme.dataSearchContext.configuringAndMonitoring'),
  [powervc]: t('in-plg:assistme.dataSearchContext.configuringAndMonitoring'),
  [ibmz]: t('in-plg:assistme.dataSearchContext.configuringAndMonitoring'),
  [kubernetes]: t('in-plg:assistme.dataSearchContext.kubernetes'),
  [sap]: t('in-plg:assistme.dataSearchContext.sap'),
  [vsphere]: t('in-plg:assistme.dataSearchContext.configuringAndMonitoring'),
  [physicalPath]: t('in-plg:assistme.dataSearchContext.infrastructureMap'),
  [analyze]: t('in-plg:assistme.dataSearchContext.analyzeCalls'),
  [explore]: t('in-plg:assistme.dataSearchContext.infrastructureMap'),
  [eventsPath]: t('in-plg:assistme.dataSearchContext.eventsPage'),
  [automationRoot]: t('in-plg:assistme.dataSearchContext.automation'),
  [actionHistoryPath]: t('in-plg:assistme.dataSearchContext.automation'),
  [accessControl]: t('in-plg:assistme.dataSearchContext.settingsTab'),
  [userSettings]: t('in-plg:assistme.dataSearchContext.userSettings'),
  [globalSettingsAlertingEvents]: t('in-plg:assistme.dataSearchContext.customEvents'),
  [globalSettingsAlertingAlerts]: t('in-plg:assistme.dataSearchContext.configuringAlerts'),
  [globalSettingsAlertingAlertChannels]: t('in-plg:assistme.dataSearchContext.alertChannel'),
  [globalSettingsAlertingMaintenanceConfigurations]: t('in-plg:assistme.dataSearchContext.maintenanceWindow'),
  [globalSettingsAlertingCustomPayloadConfiguration]: t('in-plg:assistme.dataSearchContext.customPayload'),
  [logManagement]: t('in-plg:assistme.dataSearchContext.logManagement'),
  [securityAndAccessAudit]: t('in-plg:assistme.dataSearchContext.auditLogs'),
  [securityAndAccess]: t('in-plg:assistme.dataSearchContext.securityAndAccess'),
  [agentsPath]: t('in-plg:assistme.dataSearchContext.installAgent'),
  [customDashboardsPath]: t('in-plg:assistme.dataSearchContext.customDashboard')
};
