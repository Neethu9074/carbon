/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Card } from '@instana/components';

import {
  evaluationInfoColumnDefinition,
  entityNameColumnDefinition,
  editActionsColumnDefinition,
  linkedListNameColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { getAllGlobalAlertConfigsRelatedToApplicationId } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';
import Footer from 'in-components/Footer/Footer';

export default function Alerts({ applicationId }) {
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);

  return (
    <>
      <Card>
        <SmartAlertsBaseList
          configsCategory={configsCategory}
          setConfigsCategory={setConfigsCategory}
          getLocalAlertConfigsFetchFunction={() => getAllAlertConfigs(applicationId, { asObservable: true })}
          getGlobalAlertConfigFetchFunction={() =>
            getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, { asObservable: true })
          }
          columnDefinitions={getColumnDefinitions(isCategoryGlobal(configsCategory))}
          sortOptions={sortOptions}
          createRowLinkLocation={createRowLinkLocation(configsCategory)}
        />
      </Card>
      <Footer />
    </>
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

Alerts.propTypes = {
  applicationId: PropTypes.string.isRequired
};
