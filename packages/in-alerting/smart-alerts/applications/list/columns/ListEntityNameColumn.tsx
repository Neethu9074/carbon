/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ApplicationNode } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { firstApplicationId } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import getApplication from 'in-applications/subscriptions/getApplication';
import IconLabel from 'in-alerting/components/IconLabel';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/list/columns/ListColumns.mless';

type Applications = Record<string, ApplicationNode>;
interface ListEntityNameColumnProps {
  applications: Applications;
  isGlobalSmartAlertConfig: boolean;
}

export default function ListEntityNameColumn({ applications, isGlobalSmartAlertConfig }: ListEntityNameColumnProps) {
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

interface SelectionLabelProps {
  applications: Applications;
}

function IndividualAlertsSelectionLabel({ applications }: SelectionLabelProps) {
  const applicationId = firstApplicationId(applications) ?? '';

  const application = useObservable(
    () => getApplication({ id: applicationId }).map(({ data }) => data),
    [applicationId]
  );

  const { label } = application ?? {};

  return label ? (
    <Tooltip themeStyle="light" content={label} align="topMiddle" delay={500}>
      <IconLabel text={label} type="lib_application" noBottomMargin ellipsis />
    </Tooltip>
  ) : null;
}

function GlobalAlertsSelectionLabel({ applications }: SelectionLabelProps) {
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
