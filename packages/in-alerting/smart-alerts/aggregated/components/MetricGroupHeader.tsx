/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { debounce } from 'lodash';
import React from 'react';

import { SearchInput } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/aggregated/components/MetricGroupHeader.mless';

export interface MetricGroupHeaderProps {
  isLoading?: boolean;
  totalHits?: number;
  setBackendQueryModel: (arg?: string) => void;
}

/**
 *  metric group header.
 * @param isLoading  is loading boolean value.
 * @param totalHits  totalHits number.
 * @param setBackendQueryModel The setBackendQueryModel.
 * @returns The  metric group header.
 */
export default function MetricGroupHeader({
  isLoading,
  totalHits,
  setBackendQueryModel
}: MetricGroupHeaderProps): JSX.Element {
  const topText = totalHits
    ? t('in-alerting:components.groupedViewHeader', {
        count: totalHits,
        formattedCount: number.compact(totalHits)
      })
    : null;
  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper>
        <SearchInput
          withoutIcon
          onChange={handleChangeWithDebounce(setBackendQueryModel)}
          placeholder={t('in-components:searchInput.placeholderSearch')}
        />
      </HorizontalFlexWrapper>
      <div className={locals.header}>
        <AlertTypography
          variant="heading-100"
          color="colorNavy900"
          content={!isLoading ? topText : t('in-alerting:components.resultHeaderLoading')}
        />
      </div>
    </div>
  );
}

/**
 * Handles the change with debounce.
 * @param searchHandler The searchHandler function.
 * @returns The function to handle the change with debounce.
 */
function handleChangeWithDebounce(searchHandler: (arg?: string) => void) {
  const debounceFn = debounce(searchHandler, 500);
  return function handleChange(value: string) {
    debounceFn(value);
  };
}
