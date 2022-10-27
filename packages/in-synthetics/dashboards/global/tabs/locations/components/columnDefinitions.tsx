/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { LocationListItem, PaginatedResult, Result } from '@instana/types';
import { formatDateTime } from '@instana/format-date';
import { SvgIcon } from '@instana/components';

import LocationListActionsColumn from 'in-synthetics/dashboards/global/tabs/locations/components/LocationListActionsColumn';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

export const columnDefinitions = [
  {
    id: 'location_name',
    sortable: false,
    label: t('in-synthetics:dashboard.locationList.locationLabel'),
    getContent(item: LocationListItem) {
      const locationDescription: string = item.description ?? t('in-synthetics:dashboard.locationList.notAvailable');
      return (
        <HorizontalFlexWrapper>
          <SvgIcon type={'lib_synthetic_location'} />
          <Tooltip content={locationDescription}>
            <div>
              <h4 className={locals.label}>{item.label}</h4>
            </div>
          </Tooltip>
        </HorizontalFlexWrapper>
      );
    }
  },
  {
    id: 'location_label',
    sortable: false,
    label: t('in-synthetics:dashboard.locationList.locationDisplayLabel'),
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.displayLabel}</h4>
        </div>
      );
    }
  },
  {
    id: 'status',
    label: t('in-synthetics:dashboard.locationList.status'),
    sortable: false,
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.status}</h4>
        </div>
      );
    }
  },
  {
    id: 'type',
    label: t('in-synthetics:dashboard.locationList.type'),
    sortable: false,
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.type}</h4>
        </div>
      );
    }
  },
  {
    id: 'total_tests',
    label: t('in-synthetics:dashboard.locationList.totalTests'),
    sortable: false,
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.linkedTests}</h4>
        </div>
      );
    }
  },
  {
    id: 'last_test_run',
    label: t('in-synthetics:dashboard.locationList.lastRun'),
    sortable: false,
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{formatDateTime(item.lastRunOn)}</h4>
        </div>
      );
    }
  },
  {
    id: 'action',
    label: t('in-synthetics:dashboard.testList.action'),
    sortable: false,
    getContent(item: LocationListItem, { progress }: Result<PaginatedResult<LocationListItem>>) {
      return (
        <HorizontalFlexWrapper>
          <div>
            <LocationListActionsColumn item={item} isLoading={progress?.loading ?? false} />
          </div>
        </HorizontalFlexWrapper>
      );
    }
  }
];
