/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonDropdown, IconButton, Tooltip } from '@instana/components';

import { t } from 'in-i18n';

import locals from './TableSortingConfigurator.mless';

export interface SortOption {
  label: string;
  value: string;
}

export type SortOrderBy = 'ASC' | 'DESC';

export interface SortOnChangeProp {
  by: string;
  direction: SortOrderBy;
}

interface Props {
  options: SortOption[];
  orderBy: SortOnChangeProp;
  onChange: (prop: SortOnChangeProp) => void;
}

export default function TableSortingConfigurator({ options, orderBy, onChange }: Props) {
  const items = [
    {
      label: t('in-alerting:table.sortBy'),
      disabled: true,
      value: ''
    },
    ...options
  ];

  return (
    <div className={locals.carbonConfigurtor}>
      <div className={locals.dropdownWidth}>
        <CarbonDropdown
          items={items}
          onChange={({ selectedItem }: { selectedItem: SortOption }) =>
            onChange({ by: selectedItem.value, direction: orderBy.direction })
          }
          label={''}
          id="table-sorting"
          titleText=""
          selectedItem={items.find(item => item.value === orderBy.by)}
        />
      </div>
      <Tooltip
        content={
          orderBy.direction === 'ASC'
            ? t('in-components:sortingConfigurator.buttonAscending')
            : t('in-components:sortingConfigurator.buttonDescending')
        }
      >
        <IconButton
          type={orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending'}
          className={locals.sorting}
          onClick={() =>
            onChange({
              by: orderBy.by,
              direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
            })
          }
          size="compact"
        />
      </Tooltip>
    </div>
  );
}
