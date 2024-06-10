/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { BusinessPerspectiveItem, TimeConfig } from '@instana/types';

// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { businessPerspectiveDashboard, summaryTab } from 'in-bizops/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { selectBizopsListPerspectiveTracker } from 'in-bizops/tracker';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface bpListProps extends ServerTablePresenterProps<BusinessPerspectiveItem> {
  timeConfig: TimeConfig;
}

function BusinessPerspectiveNameColumnContent(item: BusinessPerspectiveItem) {
  const { location, createHref } = useNavigation();

  const businessPerspectiveId: string = item.businessPerspective.id;
  const businessPerspectiveName: string = item.businessPerspective.label;

  location.pathname = `${businessPerspectiveDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveId', businessPerspectiveId);
  setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveName', businessPerspectiveName);

  const perspectiveTracking = {
    perspectiveId: businessPerspectiveId,
    perspectiveName: businessPerspectiveName
  };

  return (
    <div className={locals.tracker} onClick={() => selectBizopsListPerspectiveTracker(perspectiveTracking)}>
      <SeverityAwareEntityLink
        severity={getSeverity(item)}
        label={businessPerspectiveName}
        href={createHref(location)}
      />
    </div>
  );
}

function getSeverity(item: BusinessPerspectiveItem) {
  return get(item, ['metrics', 'maxSeverity', 0, 1], 0);
}

export const perspectiveColumnDefinitions: ColumnDefinition<BusinessPerspectiveItem, bpListProps>[] = [
  {
    id: 'perspective_name',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.nameLabel'),
    getContent: BusinessPerspectiveNameColumnContent
  }
];
