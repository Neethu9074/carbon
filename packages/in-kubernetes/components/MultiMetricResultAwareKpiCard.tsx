/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactElement, ReactNode } from 'react';

import { HorizontalIndicator, LoadingSkeleton, Stack, SvgIcon } from '@instana/components';
import { Result } from '@instana/types';

import KpiCard from 'in-components/KpiCard/KpiCard';

import locals from 'in-components/KpiCard/ResultAwareKpiCard.mless';

export interface MultiMetricResultAwareKpiCardProps<T> {
  title: string;
  result: Array<Result<T>>;
  /**
   * Will be called for a non-erroneous/finished Result
   */
  renderKpiCard: (result: Array<Result<T>>) => ReactElement;
  useMaxAvailableHeight?: boolean;
  actions?: ReactNode;
}

export default function MultiMetricResultAwareKpiCard<T>({
  title,
  result,
  renderKpiCard,
  useMaxAvailableHeight,
  actions
}: MultiMetricResultAwareKpiCardProps<T>) {
  let hasErrors: boolean = false;
  let isLoading: boolean = false;
  result.forEach(result => {
    if (result.errors.length > 0) {
      hasErrors = true;
    }
    if (result.progress.loading) {
      isLoading = true;
    }
  });
  if (hasErrors) {
    return (
      <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <Stack align="center" distribution="center">
          <span title={result[0]?.errors[0]?.message}>
            <SvgIcon size="l" type="lib_help_error_error_circle" className={locals.error} />
          </span>
        </Stack>
      </KpiCard>
    );
  }

  if (isLoading) {
    return (
      <div className={locals.loadingBarContainer}>
        <HorizontalIndicator progress={result[0].progress} />
        <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
          <Stack align="start" distribution="center">
            <LoadingSkeleton className={locals.skeleton} />
          </Stack>
        </KpiCard>
      </div>
    );
  }

  return renderKpiCard(result);
}
