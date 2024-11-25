/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  linkedListNameColumnDefinition,
  evaluationInfoColumnDefinition,
  entityNameColumnDefinition,
  editActionsColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { alertsTab } from 'in-applications/navigation/paths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function GlobalInventorySmartAlertsList({ onNoData }) {
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);
  const { trackCta } = useSegmentTracking();

  return (
    <SmartAlertsListWithUrlState
      configsCategory={configsCategory}
      setConfigsCategory={setConfigsCategory}
      onNoData={onNoData}
      getLocalAlertConfigsFetchFunction={() =>
        getAllAlertConfigsForAllApplications([], {
          asObservable: true
        })
      }
      getGlobalAlertConfigFetchFunction={() =>
        getAllGlobalAlertConfigs([], {
          asObservable: true
        })
      }
      getLocalAlertConfigTitle={numberOfAlerts =>
        t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsList', {
          numberOfAlerts
        })
      }
      getGlobalAlertConfigTitle={numberOfAlerts =>
        t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsList', {
          numberOfAlerts
        })
      }
      columnDefinitions={getColumnDefinitions(isCategoryGlobal(configsCategory), trackCta)}
      sortOptions={sortOptions}
      extraSearchAttributes={[getMetricName]}
      createRowLinkLocation={createRowLinkLocation(configsCategory)}
      alertsTab={alertsTab}
    />
  );
}

function getColumnDefinitions(isGlobalSmartAlertConfig, trackCta) {
  const showActionButtons = isGlobalSmartAlertConfig
    ? role.canConfigureGlobalApplicationSmartAlerts
    : role.canConfigureApplicationSmartAlerts;
  return [
    linkedListNameColumnDefinition(),
    evaluationInfoColumnDefinition({ isGlobalSmartAlertConfig }),
    entityNameColumnDefinition({ isGlobalSmartAlertConfig }),
    showActionButtons &&
      editActionsColumnDefinition({
        actionHandlers: actionHandlers(isGlobalSmartAlertConfig, trackCta)
      })
  ].filter(Boolean);
}

GlobalInventorySmartAlertsList.propTypes = {
  onNoData: PropTypes.func
};
