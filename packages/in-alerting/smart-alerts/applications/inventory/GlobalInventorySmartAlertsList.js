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
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';

export default function GlobalInventorySmartAlertsList({ onNoData }) {
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);

  return (
    <SmartAlertsBaseList
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
      columnDefinitions={getColumnDefinitions(isCategoryGlobal(configsCategory))}
      sortOptions={sortOptions}
      createRowLinkLocation={createRowLinkLocation(configsCategory)}
    />
  );
}

function getColumnDefinitions(isGlobalSmartAlertConfig) {
  return [
    linkedListNameColumnDefinition(),
    evaluationInfoColumnDefinition({ isGlobalSmartAlertConfig }),
    entityNameColumnDefinition({ isGlobalSmartAlertConfig }),
    editActionsColumnDefinition({ actionHandlers: actionHandlers(isGlobalSmartAlertConfig) })
  ];
}

GlobalInventorySmartAlertsList.propTypes = {
  onNoData: PropTypes.func
};
