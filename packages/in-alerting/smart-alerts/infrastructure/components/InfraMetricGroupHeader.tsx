/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { debounce } from 'lodash';
import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './InfraMetricGroupTableList.mless';

export interface InfraMetricGroupHeaderProps {
  isLoading?: boolean;
  totalHits?: number;
  setBackendQueryModel: (arg?: string) => void;
}

/**
 * Infra metric group header.
 * @param isLoading  is loading boolean value.
 * @param totalHits  totalHits number.
 * @param setBackendQueryModel The setBackendQueryModel.
 * @returns The infra metric group header.
 */
export function InfraMetricGroupHeader({
  isLoading,
  totalHits,
  setBackendQueryModel
}: InfraMetricGroupHeaderProps): JSX.Element {
  const topText = totalHits
    ? t('in-alerting:smartAlerts.infrastructure.groupedViewHeader', {
        count: totalHits,
        formattedCount: number.compact(totalHits)
      })
    : null;
  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper>
        <SearchInput withoutIcon onChange={handleChangeWithDebounce(setBackendQueryModel)} />
      </HorizontalFlexWrapper>
      <div className={locals.header}>
        <h3 className={locals.topText}>
          {!isLoading ? topText : t('in-alerting:smartAlerts.infrastructure.resultHeaderLoading')}
        </h3>
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
