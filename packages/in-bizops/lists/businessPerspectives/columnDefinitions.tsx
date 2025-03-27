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
import BizOpsHealthIndicator from 'in-bizops/components/BizOpsHealthIndicator';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { bizopsPerspectivesListSelect } from 'in-bizops/tracker';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface bpListProps extends ServerTablePresenterProps<BusinessPerspectiveItem> {
  timeConfig: TimeConfig;
}

const BusinessPerspectiveNameColumnContent = ({ item }: { item: BusinessPerspectiveItem }) => {
  const { location, createHref } = useNavigation();

  const businessPerspectiveId: string = item.businessPerspective.id;
  // @ts-expect-error transition from label -> name
  const businessPerspectiveName: string = (item.businessPerspective.name || item.businessPerspective.label) ?? '';

  location.pathname = `${businessPerspectiveDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveId', businessPerspectiveId);
  setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveName', businessPerspectiveName);

  const perspectiveTracking = {
    path: location.pathname,
    perspectiveId: businessPerspectiveId,
    perspectiveName: businessPerspectiveName
  };

  return (
    <div className={locals.tracker} onClick={() => bizopsPerspectivesListSelect(perspectiveTracking)}>
      <SeverityAwareEntityLink
        severity={getSeverity(item)}
        label={businessPerspectiveName}
        href={createHref(location)}
      />
    </div>
  );
};

function getSeverity(item: BusinessPerspectiveItem) {
  return get(item, ['metrics', 'maxSeverity', 0, 1], 0);
}

export const perspectiveColumnDefinitions: ColumnDefinition<BusinessPerspectiveItem, bpListProps>[] = [
  {
    id: 'business.perspective.name',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.nameLabel'),
    getContent: (item: BusinessPerspectiveItem) => <BusinessPerspectiveNameColumnContent item={item} />
  },
  {
    id: 'perspective_description',
    sortable: false,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:perspectives.lists.descriptionLabel'),
    ellipsis: '20vw',
    getContent(item: BusinessPerspectiveItem) {
      return (
        <div>
          <h4 className={locals.bizops_ellipses} title={item.businessPerspective.description}>
            {item.businessPerspective.description}
          </h4>
        </div>
      );
    }
  },
  {
    id: 'perspective_process_count',
    sortable: false,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:perspectives.lists.numberProcessesLabel'),
    getContent(item: BusinessPerspectiveItem) {
      return (
        <div>
          <h4>{item.metrics.business_process_definitions_count[0][1]}</h4>
        </div>
      );
    }
  },
  {
    id: 'health',
    sortable: false,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.healthLabel'),
    getContent(item: BusinessPerspectiveItem, { timeConfig }) {
      const rawServiceIds = item.services && item.services.map(service => service.id);
      const serviceIds = [...new Set(rawServiceIds)]; // Removes serviceId dupes
      return (
        <BizOpsHealthIndicator
          serviceIds={serviceIds}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          timeConfig={timeConfig}
          inContentArea
        />
      );
    }
  }
];
