/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

//@ts-expect-error
import { createTableColumnDefinition } from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { useSmartAlertCreateUrl as useSmartAlertEditUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { CreateSmartAlertButtonForCarbonTable } from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import { getAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import { categoryLocal, sortOptions, categoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { eventsPath } from 'in-events/navigation/paths';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

export default function ApplicationSmartAlerts() {
  return (
    <Alerts
      configsCategory={categoryLocal}
      fetchFunction={() => getAlertConfigsForAllApplications()}
      noDataHeader={t('in-alerting:smartAlerts.applications.inventory.noLocalAlertDataHeader')}
      alertsTab={eventsPath}
      noDataDescription={<Trans i18nKey="in-alerting:smartAlerts.applications.inventory.noLocalAlertDataDescription" />}
    />
  );
}

export function Alerts({
  configsCategory,
  fetchFunction,
  noDataHeader,
  alertsTab,
  noDataDescription
}: {
  configsCategory: typeof categoryLocal | typeof categoryGlobal;
  fetchFunction: () => Observable<Result<AlertConfigType[]>>;
  noDataHeader: string;
  alertsTab: string;
  noDataDescription: any;
}) {
  const { trackCta } = useSegmentTracking();
  const getLinkToEditSmartAlert = useSmartAlertEditUrl();
  const location = useLocation();

  return (
    <SmartAlertsTableWithUrlState
      columnDefinitions={createTableColumnDefinition(configsCategory, trackCta, getLinkToEditSmartAlert, {})}
      getLocalAlertConfigsFetchFunction={fetchFunction}
      getLocalAlertConfigTitle={() => ''}
      getGlobalAlertConfigTitle={() => ''}
      isSelectable={false}
      //@ts-expect-error
      toolBarContent={
        role?.canConfigureGlobalApplicationSmartAlerts && (
          <CreateSmartAlertButtonForCarbonTable
            isGlobal
            buttonName={t('in-alerting:smartAlerts.createSmartAlert')}
            location={location}
          />
        )
      }
      noDataHeader={noDataHeader}
      noDataDescription={noDataDescription}
      sortOptions={sortOptions}
      alertsTab={alertsTab}
    />
  );
}
