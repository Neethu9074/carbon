/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, ReactNode } from 'react';

import { HorizontalIndicator, LoadingSkeleton, Stack, SvgIcon } from '@instana/components';

import KpiCard from 'in-components/KpiCard/KpiCard';
import { Result } from 'in-types';

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
  isInModal?: boolean;
  extraInfo?: string;
}

export default function ResultAwareKpiCard<T>({
  title,
  result,
  renderKpiCard,
  useMaxAvailableHeight,
  isInModal,
  actions,
  extraInfo
}: ResultAwareKpiCardProps<T>) {
  if (result.errors.length > 0) {
    return (
      <KpiCard
        title={title}
        useMaxAvailableHeight={useMaxAvailableHeight}
        actions={actions}
        isInModal={isInModal}
        extraInfo={extraInfo}
      >
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
      <div className={locals.loadingBarContainer}>
        <HorizontalIndicator progress={result.progress} />
        <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions} extraInfo={extraInfo}>
          <Stack align="start" distribution="center">
            <LoadingSkeleton className={locals.skeleton} />
          </Stack>
        </KpiCard>
      </div>
    );
  }

  return renderKpiCard(result);
}
