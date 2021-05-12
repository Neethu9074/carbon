/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function ResultAwareKpiCard({ title, result, renderKpiCard, useMaxAvailableHeight, actions }) {
  if (result.errors.length > 0) {
    return (
      <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <ErroneousResultPresenter errors={result.errors} />
      </KpiCard>
    );
  }

  if (result.progress.loading) {
    return (
      <KpiCard title={title} withoutPadding useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
        <HorizontalIndicator progress={result.progress} />
      </KpiCard>
    );
  }

  return renderKpiCard(result);
}
