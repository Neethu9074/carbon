/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { LocationStatus, TestResultListItem, TimeConfig } from '@instana/types';
import { SvgIcon } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import HealthDot from 'in-components/health/HealthDot';
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
    getContent(item: TestResultListItemId) {
      const locationStatusList: LocationStatus[] =
        item?.testResultCommonProperties?.testCommonProperties?.locationStatusList ?? [];
      const totalLocations = locationStatusList.length == 0 ? 0 : locationStatusList.length;

      if (totalLocations === 1) {
        const locationStatus: LocationStatus = locationStatusList[0];
        const severity = locationStatus.successRate == 1 ? 0 : 10;
        if (locationStatus.totalTestRuns != 0) {
          return (
            <HorizontalFlexWrapper>
              <SvgIcon type={'lib_synthetic_location'} />
              <div>
                <span className={locals.label}>
                  {item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels &&
                    item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels[0]}
                </span>
                <HealthDot severity={severity} iconSize={5} />
              </div>
            </HorizontalFlexWrapper>
          );
        } else {
          return (
            <HorizontalFlexWrapper>
              <SvgIcon type={'lib_synthetic_location'} />
              <div>
                <span className={locals.label}>
                  {item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels &&
                    item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels[0]}
                </span>
              </div>
            </HorizontalFlexWrapper>
          );
        }
      } else {
        let severities = locationStatusList
          .filter(location => {
            if (location.totalTestRuns != 0) {
              return true;
            }
            return false;
          })
          .map(location => {
            return {
              sev: location.successRate == 1 ? 0 : 10,
              id: location.locationId
            };
          });

        return (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_synthetic_location'} />
            <div>
              <span className={locals.label}>
                {t('in-synthetics:dashboard.testList.locations', { totalLocations })}
              </span>
              <HorizontalFlexWrapper>
                {severities.map(severity => {
                  return (
                    <HealthDot key={severity.id} severity={severity.sev} iconSize={5} className={locals.dotPadding} />
                  );
                })}
              </HorizontalFlexWrapper>
            </div>
          </HorizontalFlexWrapper>
        );
      }
    }
  },
  {
    id: 'applicationLabel',
    label: t('in-synthetics:dashboard.testList.applicationLabel'),
    defaultOrderDirection: 'ASC',
    width: '20%',
    getContent(item: TestResultListItemId) {
      const applicationLabel = item.testResultCommonProperties.testCommonProperties?.applicationLabel;
      if (applicationLabel != null && applicationLabel !== '') {
        return (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_application_invert'} />
            <span className={locals.label}>{applicationLabel}</span>
          </HorizontalFlexWrapper>
        );
      } else {
        return (
          <div>
            <span className={locals.label}>{''}</span>
          </div>
        );
      }
    }
  }
];
