/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Card } from '@instana/components';

import {
  linkedListNameColumnDefinition,
  evaluationInfoColumnDefinition,
  entityNameColumnDefinition,
  editActionsColumnDefinition,
  createTableColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { CreateSmartAlertButtonForCarbonTable } from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';
import { carbonTableEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { alertsTab } from 'in-applications/navigation/paths';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const displayCarbonTable = smartAlertCarbonTableEnabled && carbonTableEnabled;

export default function GlobalInventorySmartAlertsList({ onNoData }) {
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);
  const { trackCta } = useSegmentTracking();

  return (
    <>
      {displayCarbonTable ? (
        <SmartAlertsTableWithUrlState
          columnDefinitions={createTableColumnDefinition(configsCategory, trackCta)}
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
          configsCategory={configsCategory}
          setConfigsCategory={setConfigsCategory}
          getLocalAlertConfigTitle={() => t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsTable')}
          getGlobalAlertConfigTitle={() =>
            t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsTable')
          }
          isSelectable={false}
          toolBarContent={
            role.canConfigureGlobalApplicationSmartAlerts && <CreateSmartAlertButtonForCarbonTable isGlobal />
          }
          noDataHeader={
            isCategoryGlobal(configsCategory)
              ? t('in-alerting:smartAlerts.applications.inventory.noGlobalAlertDataHeader')
              : t('in-alerting:smartAlerts.applications.inventory.noLocalAlertDataHeader')
          }
          noDataDescription={getNoDataMessage(configsCategory)}
          alertsTab={alertsTab}
          sortOptions={sortOptions}
        />
      ) : (
        <Card>
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
        </Card>
      )}
    </>
  );
}

function getNoDataMessage(configsCategory) {
  if (isCategoryGlobal(configsCategory)) {
    return <Trans i18nKey="in-alerting:smartAlerts.applications.inventory.noGlobalAlertDataDescription" />;
  }
  return <Trans i18nKey="in-alerting:smartAlerts.applications.inventory.noLocalAlertDataDescription" />;
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
