/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import { noop } from 'lodash';
import React from 'react';

import { Li, Stack, Ul, RadioButton, Checkbox } from '@instana/components';
import { Progress } from '@instana/types';
import { t } from '@instana/i18n-react';

import SloTableSelectionSkeleton from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelectionSkeleton';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';

import locals from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection.mless';

interface ColumnDataBase {
  id: string;
  label: string;
}

interface SloTableSelectionProps<COLUMN_DATA extends ColumnDataBase> {
  selectedIds: string[];
  columns: Partial<keyof COLUMN_DATA>[];
  disabled?: boolean;
  itemList?: COLUMN_DATA[];
  onChange: (itemData: COLUMN_DATA) => void;
  progress: Progress;
  canLoadMore?: boolean;
  loadMore?: () => void;
  hasError?: boolean;
  asRadioButton?: boolean;
  skeletonRows?: number;
}

export default function SloTableSelection<COLUMN_DATA extends ColumnDataBase>({
  selectedIds,
  columns,
  canLoadMore,
  disabled = false,
  itemList,
  hasError,
  loadMore,
  onChange,
  progress,
  asRadioButton,
  skeletonRows = 3
}: SloTableSelectionProps<COLUMN_DATA>) {
  if (progress.loading) return <SloTableSelectionSkeleton numRows={skeletonRows} numColumns={columns.length} />;

  const isDataAvailable = itemList !== undefined && itemList.length > 0;

  if (!isDataAvailable) return <NoDataAvailable height={160} text={t('in-service-levels:general.noData')} />;

  const shouldRenderMoreButton = canLoadMore && loadMore && !disabled;

  const BoxComponent = asRadioButton ? RadioButton : Checkbox

  return (
    <Ul
      className={classNames({
        [locals.withError]: hasError
      })}
    >
      {itemList.map((itemData, rowIndex) => {
        return (
          <Li
            className={classNames({
              [locals.disabled]: disabled
            })}
            onClick={disabled ? noop : () => onChange(itemData)}
            key={itemData.id}
          >
            <Stack direction="horizontal">
              <BoxComponent
                checked={selectedIds.includes(itemData.id)}
                disabled={disabled}
                onChange={disabled ? noop : () => onChange(itemData)}
              />
              {columns.map(columnKey => {
                if (!columnKey || typeof columnKey !== 'string') return;
                return (
                  <div key={`slo-table-col-${columnKey}-${rowIndex}`} className={locals.checkBoxItem}>
                    {itemData[columnKey]}
                  </div>
                );
              })}
            </Stack>
          </Li>
        );
      })}

      {shouldRenderMoreButton && (
        <Li onClick={loadMore} className={locals.loadMore}>
          {t('in-service-levels:general.loadMore')}
        </Li>
      )}
    </Ul>
  );
}
