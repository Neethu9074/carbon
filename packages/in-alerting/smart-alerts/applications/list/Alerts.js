/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { getAllGlobalAlertConfigsRelatedToApplicationId } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { useSmartAlertCreateUrl as useSmartAlertEditUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { createTableColumnDefinition } from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsTableWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import { CreateSmartAlertButtonForCarbonTable } from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { useUrlBasedCategory } from 'in-alerting/smart-alerts/applications/hooks/useUrlBasedCategory';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { alertsTab } from 'in-applications/navigation/paths';
import Footer from 'in-components/Footer/Footer';
import { t, Trans } from 'in-i18n';

export default function Alerts({ applicationId, boundaryScope, location, data }) {
  const [role] = useCurrentUserRole();
  const [configsCategory, setConfigsCategory] = useUrlBasedCategory(categoryLocal);
  const { trackCta } = useSegmentTracking();
  const getLinkToEditSmartAlert = useSmartAlertEditUrl();
  const urlParams = {
    isGlobal: isCategoryGlobal(configsCategory)
  };

  return (
    <>
      <SmartAlertsTableWithUrlState
        columnDefinitions={createTableColumnDefinition(
          configsCategory,
          trackCta,
          getLinkToEditSmartAlert,
          urlParams,
          role
        )}
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

Alerts.propTypes = {
  applicationId: PropTypes.string.isRequired,
  boundaryScope: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.object
};
