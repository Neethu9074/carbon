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
  withResultsInGroups = false,
  withAdjustedWindowSizeTooltip = false,
  renderHistoricDataIndicator = false
}) {
  if (hasErrors) {
    return <ErroneousResult />;
  }
  if (isLoading) {
    return <Placeholder />;
  }

  let topText;
  let bottomText;
  let totalCountText;
  if (withGrouping) {
    topText = t('in-components:analyzeView.groupedViewHeader', {
      count: totalHits,
      formattedCount: number.compact(totalHits)
    });
    if (withResultsInGroups) {
      bottomText = t('in-components:analyzeView.result', {
        count: totalRepresentedItemCount,
        formattedCount: number.compact(totalRepresentedItemCount),
        dataSource: dataSource
      });
    }
  } else {
    topText = t('in-components:analyzeView.result', {
      count: totalRetainedItemCount,
      formattedCount: number.compact(totalRetainedItemCount),
      dataSource: dataSource
    });
    const showRetainedItemsCount = renderHistoricDataIndicator && totalRepresentedItemCount > totalHits;
    if (showRetainedItemsCount) {
      totalCountText = t('in-components:analyzeView.groupedViewHeaderRetained', {
        count: totalRepresentedItemCount,
        formattedCount: number.compact(totalRepresentedItemCount)
      });
    }
  }

  return (
    <Presenter
      topText={topText}
      totalCountText={totalCountText}
      bottomText={bottomText}
      withAdjustedWindowSizeTooltip={withAdjustedWindowSizeTooltip}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
    />
  );
}

function Placeholder() {
  return <Presenter topText={t('in-components:analyzeView.resultHeaderLoading')} />;
}

function ErroneousResult() {
  return <Presenter />;
}

function generateTooltips(withAdjustedWindowSizeTooltip, renderHistoricDataIndicator) {
  const lines = [];
  if (renderHistoricDataIndicator) {
    lines.push(t('in-components:approximateDataIndicator.dataRetention'));
  }
  if (lines.length > 0) {
    return <MultiLineToolTipIcon lines={lines} label={'Approximate Data'} iconSize="s" />;
  }
}

function Presenter({
  topText,
  bottomText,
  totalCountText,
  withAdjustedWindowSizeTooltip,
  renderHistoricDataIndicator
}) {
  return (
    <div className={locals.header}>
      <div className={locals.topTextWithTooltip}>
        <h3 className={locals.topText}>
          {topText} <span className={locals.totalCountText}>{totalCountText}</span>
        </h3>
        {generateTooltips(withAdjustedWindowSizeTooltip, renderHistoricDataIndicator)}
      </div>
      {bottomText ? <span className={locals.bottomText}>{bottomText}</span> : null}
    </div>
  );
}
