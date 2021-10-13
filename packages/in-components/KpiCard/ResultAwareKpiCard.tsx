/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, ReactNode } from 'react';

import { HorizontalIndicator } from '@instana/components';
import { Stack, SvgIcon } from '@instana/components';

import KpiCard from 'in-components/KpiCard/KpiCard';
import { Result } from 'in-types';

// @ts-ignore
import locals from './ResultAwareKpiCard.mless';

export interface ResultAwareKpiCardProps<T> {
  title: string;
  result: Result<T>;
  /**
   * Will be called for a non-erroneous/finished Result
   */
  renderKpiCard: (result: Result<T>) => ReactElement;
  useMaxAvailableHeight?: boolean;
  actions?: ReactNode;
}

export default function ResultAwareKpiCard<T>({
  title,
  result,
  renderKpiCard,
  useMaxAvailableHeight,
  actions
}: ResultAwareKpiCardProps<T>) {
  if (result.errors.length > 0) {
    return (
      <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <Stack align="center" distribution="center">
          <span title={result.errors[0].message}>
            <SvgIcon size="l" type="lib_help_error_error_circle" className={locals.error} />
          </span>
        </Stack>
      </KpiCard>
    );
  }

  if (result.progress.loading) {
    return (
      <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <Stack align="center" distribution="center">
          <div className={locals.loadingBarContainer}>
            <HorizontalIndicator className={locals.horizontalIndicator} progress={result.progress} rounded />
          </div>
        </Stack>
      </KpiCard>
    );
  }

  return renderKpiCard(result);
}
