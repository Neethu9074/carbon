/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './CountHeader.mless';

export default function CountHeader({
  totalRepresentedItemCount,
  totalRetainedItemCount,
  totalHits,
  dataSource,
  isLoading,
  hasErrors,
  withGrouping = false,
  withAdjustedWindowSizeTooltip = false,
  renderHistoricDataIndicator = false,
  fastQueryModeEnabled
}) {
  if (hasErrors) {
    return <ErroneousResult />;
  }
  if (isLoading) {
    return <Placeholder />;
  }

  let topText;
  let totalRepresentedText;

  const showRetainedItemsCount = renderHistoricDataIndicator && totalRepresentedItemCount > totalRetainedItemCount;

  if (withGrouping) {
    topText = t('in-components:analyzeView.groupedViewHeader', {
      count: totalHits,
      formattedCount: number.compact(totalHits)
    });
  } else {
    topText = t('in-components:analyzeView.result', {
      count: totalRetainedItemCount,
      formattedCount: number.compact(totalRetainedItemCount),
      dataSource: dataSource
    });

    if (showRetainedItemsCount) {
      totalRepresentedText = t('in-components:analyzeView.groupedViewHeaderRetained', {
        count: totalRepresentedItemCount,
        formattedCount: number.compact(totalRepresentedItemCount)
      });
    }
  }

  return (
    <Presenter
      topText={topText}
      totalRepresentedText={totalRepresentedText}
      withAdjustedWindowSizeTooltip={withAdjustedWindowSizeTooltip}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
      fastQueryModeEnabled={fastQueryModeEnabled}
    />
  );
}

function Placeholder() {
  return <Presenter topText={t('in-components:analyzeView.resultHeaderLoading')} />;
}

export function ErroneousResult() {
  return (
    <div className={locals.header}>
      <div className={locals.topTextWithTooltip}>
        <h3 className={locals.topText} />
      </div>
    </div>
  );
}

function generateTooltips(withAdjustedWindowSizeTooltip, renderHistoricDataIndicator, fastQueryModeEnabled) {
  const lines = [];
  if (renderHistoricDataIndicator) {
    lines.push(
      fastQueryModeEnabled
        ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
        : t('in-components:approximateDataIndicator.dataRetention')
    );
  }
  if (lines.length > 0) {
    return <MultiLineToolTipIcon lines={lines} label={'Approximate Data'} iconSize="s" />;
  }
}

function Presenter({
  topText,
  totalRepresentedText,
  withAdjustedWindowSizeTooltip,
  renderHistoricDataIndicator,
  fastQueryModeEnabled
}) {
  return (
    <div className={locals.header}>
      <div className={locals.topTextWithTooltip}>
        <h3 className={locals.topText}>
          {topText}{' '}
          {totalRepresentedText && <span className={locals.totalRepresentedText}>{totalRepresentedText}</span>}
        </h3>
        {generateTooltips(withAdjustedWindowSizeTooltip, renderHistoricDataIndicator, fastQueryModeEnabled)}
      </div>
    </div>
  );
}
