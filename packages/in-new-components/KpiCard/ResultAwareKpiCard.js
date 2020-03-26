import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default function ResultAwareKpiCard({ title, result, renderKpiCard, useMaxAvailableHeight }) {
  if (result.errors.length > 0) {
    return (
      <KpiCard title={title} useMaxAvailableHeight={useMaxAvailableHeight}>
        <ErroneousResultPresenter errors={result.errors} />
      </KpiCard>
    );
  }

  if (result.progress.loading) {
    return (
      <KpiCard title={title} withoutPadding useMaxAvailableHeight={useMaxAvailableHeight}>
        <HorizontalIndicator progress={result.progress} />
      </KpiCard>
    );
  }

  return renderKpiCard(result);
}
