/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { historicOrLargeDataResult$ } from 'in-components/time/TimeSelection/TimeSelection';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './CountHeader.mless';

export default function CountHeader({
  totalRepresentedItemCount,
  totalHits,
  isLoading,
  hasErrors,
  withGrouping = false,
  withResultsInGroups = false,
  withAdjustedWindowSizeTooltip = false,
  renderHistoricDataIndicator = false
}) {
  const historicOrLargeDataResult = useObservable(historicOrLargeDataResult$, []);

  if (hasErrors) {
    return <ErroneousResult />;
  }
  if (isLoading || historicOrLargeDataResult == null) {
    return <Placeholder />;
  }

  let topText;
  let bottomText;
  if (withGrouping) {
    topText = t('in-components:analyzeView.groupedViewHeader', {
      count: totalHits,
      formattedCount: number.compact(totalHits)
    });
    if (withResultsInGroups) {
      bottomText = t('in-components:analyzeView.result', {
        count: totalRepresentedItemCount,
        formattedCount: number.compact(totalRepresentedItemCount)
      });
    }
  } else {
    topText = t('in-components:analyzeView.result', {
      count: totalRepresentedItemCount,
      formattedCount: number.compact(totalRepresentedItemCount)
    });
    const showRetainedItemsCount =
      historicOrLargeDataResult.containsHistoricData && totalRepresentedItemCount > totalHits;
    if (showRetainedItemsCount) {
      bottomText = t('in-components:analyzeView.resultRetained', {
        count: totalHits,
        formattedCount: number.compact(totalHits)
      });
    }
  }

  return (
    <Presenter
      topText={topText}
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
  if (withAdjustedWindowSizeTooltip) {
    lines.push(t('in-components:analyzeView.resultHeaderTooltip'));
  }
  if (renderHistoricDataIndicator) {
    lines.push(t('in-components:approximateDataIndicator.dataRetention'));
  }
  if (lines.length > 0) {
    return <MultiLineToolTipIcon lines={lines} />;
  }
}

function Presenter({ topText, bottomText, withAdjustedWindowSizeTooltip, renderHistoricDataIndicator }) {
  return (
    <div className={locals.header}>
      <div className={locals.topTextWithTooltip}>
        <h3 className={locals.topText}>{topText}</h3>
        {generateTooltips(withAdjustedWindowSizeTooltip, renderHistoricDataIndicator)}
      </div>
      {bottomText ? <span className={locals.bottomText}>{bottomText}</span> : null}
    </div>
  );
}
