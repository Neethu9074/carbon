/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { BusinessPerspectiveItem, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { businessPerspectiveDashboard, summaryTab } from 'in-bizops/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
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
  },
  {
    id: 'perspective_description',
    sortable: true,
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
    sortable: true,
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
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.healthLabel'),
    getContent(item: BusinessPerspectiveItem, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          // TODO: This service ID should be supplied by the backend, uncomment when available
          //serviceId={item.service?.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          //@ts-expect-error type error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];
