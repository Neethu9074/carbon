/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getApplication from 'in-applications/subscriptions/getApplication';
import IconLabel from 'in-alerting/components/IconLabel';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/list/columns/ListColumns.mless';

export default function ListEntityNameColumn({ applications, isGlobalSmartAlertConfig }) {
  return (
    <div className={locals.ellipsis}>
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

  return label ? (
    <Tooltip themeStyle="light" content={label} align="topMiddle" delay={500}>
      <IconLabel text={label} type="lib_application" noBottomMargin ellipsis />
    </Tooltip>
  ) : null;
}

function GlobalAlertsSelectionLabel({ applications }) {
  const applicationIds = Object.values(applications);
  const label = t('in-alerting:smartAlerts.applications.inventory.numberOfApplicationsSelected', {
    count: applicationIds.length
  });
  return (
    <Tooltip themeStyle="light" content={label} align="topMiddle" delay={500}>
      <IconLabel text={label} type="lib_application" ellipsis noBottomMargin />
    </Tooltip>
  );
}

ListEntityNameColumn.propTypes = {
  applications: applicationsItemTreePropType.isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool
};
