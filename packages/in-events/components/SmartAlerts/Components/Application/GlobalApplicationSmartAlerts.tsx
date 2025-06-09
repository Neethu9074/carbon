/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { getAllGlobalAlertConfigsForApplications } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { Alerts } from 'in-events/components/SmartAlerts/Components/Application/ApplicationAlerts';
import { categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { eventsPath } from 'in-events/navigation/paths';
import { t, Trans } from 'in-i18n';

export default function GlobalApplicationSmartAlerts() {
  return (
    <Alerts
      configsCategory={categoryGlobal}
      fetchFunction={() => getAllGlobalAlertConfigsForApplications()}
      noDataHeader={t('in-alerting:smartAlerts.applications.inventory.noGlobalAlertDataHeader')}
      noDataDescription={
        <Trans i18nKey="in-alerting:smartAlerts.applications.inventory.noGlobalAlertDataDescription" />
      }
      alertsTab={eventsPath}
    />
  );
}
