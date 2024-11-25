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
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { alertsTab } from 'in-applications/navigation/paths';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function Alerts({ applicationId }) {
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);
  const { trackCta } = useSegmentTracking();

  return (
    <>
      <Card>
        <SmartAlertsListWithUrlState
          configsCategory={configsCategory}
          setConfigsCategory={setConfigsCategory}
          getLocalAlertConfigsFetchFunction={() => getAllAlertConfigs(applicationId, { asObservable: true })}
          getGlobalAlertConfigFetchFunction={() =>
            getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, { asObservable: true })
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
      </Card>
      <Footer />
    </>
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

Alerts.propTypes = {
  applicationId: PropTypes.string.isRequired
};
