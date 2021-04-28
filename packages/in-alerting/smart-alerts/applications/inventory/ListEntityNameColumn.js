/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import PropTypes from 'prop-types';
import React from 'react';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getApplication from 'in-subscription/application/getApplication';
import IconLabel from 'in-alerting/components/IconLabel';
import { t } from 'in-i18n';

export default function ListEntityNameColumn({ applications, isGlobalSmartAlertConfig }) {
  return (
    <div>
      {isGlobalSmartAlertConfig ? (
        <GlobalAlertsSelectionLabel applications={applications} />
      ) : (
        <IndividualAlertsSelectionLabel applications={applications} />
      )}
    </div>
  );
}

function IndividualAlertsSelectionLabel({ applications }) {
  const applicationId = firstApplicationId(applications);

  const { label } =
    useObservable(() => getApplication({ id: applicationId }).map(({ data }) => data ?? ''), [applicationId]) ?? {};

  return label ? <IconLabel text={label} type="lib_application" noBottomMargin /> : null;
}

function GlobalAlertsSelectionLabel({ applications }) {
  const applicationIds = Object.values(applications);

  return (
    <IconLabel
      text={t('in-alerting:smartAlerts.applications.inventory.numberOfApplicationsSelected', {
        count: applicationIds.length
      })}
      type="lib_application"
      noBottomMargin
    />
  );
}

ListEntityNameColumn.propTypes = {
  applications: applicationsItemTreePropType.isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool
};
