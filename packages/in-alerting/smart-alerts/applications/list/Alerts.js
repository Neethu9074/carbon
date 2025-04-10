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
  linkedListNameColumnDefinition,
  createTableColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { getAllGlobalAlertConfigsRelatedToApplicationId } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { CreateSmartAlertButtonForCarbonTable } from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { alertsTab } from 'in-applications/navigation/paths';
import Footer from 'in-components/Footer/Footer';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

export default function Alerts({ applicationId, boundaryScope, location, data }) {
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);
  const { trackCta } = useSegmentTracking();

  return (
    <>
      {smartAlertCarbonTableEnabled ? (
        <SmartAlertsTableWithUrlState
          columnDefinitions={createTableColumnDefinition(configsCategory, trackCta)}
          getLocalAlertConfigsFetchFunction={() => getAllAlertConfigs(applicationId, { asObservable: true })}
          getGlobalAlertConfigFetchFunction={() =>
            getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, { asObservable: true })
          }
          configsCategory={configsCategory}
          setConfigsCategory={setConfigsCategory}
          getLocalAlertConfigTitle={() => t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsTable')}
          getGlobalAlertConfigTitle={() =>
            t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsTable')
          }
          isSelectable={false}
          toolBarContent={
            role.canConfigureApplicationSmartAlerts && (
              <CreateSmartAlertButtonForCarbonTable
                isGlobal={isCategoryGlobal(configsCategory)}
                applicationId={applicationId}
                location={location}
                boundaryScope={boundaryScope}
                defaultBoundaryScope={data?.boundaryScope}
                buttonName={t('in-alerting:smartAlerts.createSmartAlert')}
              />
            )
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
      )}
      <Footer />
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

Alerts.propTypes = {
  applicationId: PropTypes.string.isRequired,
  boundaryScope: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.object
};
