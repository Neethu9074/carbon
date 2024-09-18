/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { TestResultListItem, TimeConfig } from '@instana/types';

import AssociationsContent from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContent';
import LocationsPresenter from 'in-synthetics/dashboards/global/tabs/tests/components/LocationsPresenter';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

export interface TestListProps extends ServerTablePresenterProps<TestResultListItem> {
  timeConfig: TimeConfig;
}

export interface TimeResult {
  time: number;
}

export interface TestResultListItemId extends TestResultListItem {
  id?: string;
}

export const columnDefinitions: ColumnDefinition<TestResultListItemId>[] = [
  {
    id: 'test_name',
    defaultOrderDirection: 'ASC',
    label: t('in-synthetics:dashboard.testList.testLabel'),
    getContent(item: TestResultListItemId) {
      return (
        <Tooltip content={item?.testResultCommonProperties?.testCommonProperties?.label} align="topLeft" delay={500}>
          <span className={locals.label}>{item?.testResultCommonProperties?.testCommonProperties?.label}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'status',
    label: t('in-synthetics:dashboard.testList.status'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItemId) {
      const status = item?.testResultCommonProperties?.testCommonProperties?.active
        ? t('in-synthetics:dashboard.testList.active')
        : t('in-synthetics:dashboard.testList.paused');
      return <span className={locals.label}>{status}</span>;
    }
  },
  {
    id: 'synthetic_type',
    label: t('in-synthetics:dashboard.testList.type'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItemId) {
      return (
        <div>
          <div className={locals.label}>{item?.testResultCommonProperties?.testCommonProperties?.type}</div>
          <span className={locals.secText}>
            {t('in-synthetics:dashboard.testList.frequencySubText', {
              count: item?.testResultCommonProperties?.testCommonProperties?.frequency
            })}
          </span>
        </div>
      );
    }
  },
  {
    id: 'location',
    label: t('in-synthetics:dashboard.testList.locationLabel'),
    defaultOrderDirection: 'ASC',
    getContent: function Content(item: TestResultListItem) {
      return <LocationsPresenter item={item} />;
    }
  },
  {
    id: syntheticRbacLimitedEnabled ? 'associationLabels' : 'applicationLabel',
    label: t('in-synthetics:dashboard.testList.associationLabel'),
    defaultOrderDirection: 'ASC',
    width: '20%',
    getContent(item: TestResultListItemId) {
      return <AssociationsContent item={item} shouldDisplayLink={false} />;
    }
  }
];
