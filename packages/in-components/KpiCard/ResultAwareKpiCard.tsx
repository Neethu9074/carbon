/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { Stack, SvgIcon } from '@instana/components';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
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
  renderKpiCard: (result: Result<T>) => ReactNode;
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
        <SvgIcon size="l" type="lib_help_error_error_circle" className={locals.error} />
      </KpiCard>
    );
  }

  if (result.progress.loading) {
    return (
      <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <Stack align="center" distribution="center">
          <IndeterminateLoadingIndicator size="xl" />
        </Stack>
      </KpiCard>
    );
  }

  return renderKpiCard(result);
}
