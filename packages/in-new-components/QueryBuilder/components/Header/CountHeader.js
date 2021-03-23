/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { emptyObject } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './CountHeader.mless';

export default function CountHeader({
  totalRepresentedItemCount,
  totalHits,
  withGrouping = false,
  withResultsInGroups = false,
  withSamplingTooltip = false,
  withAdjustedWindowSizeTooltip = false
}) {
  const historicOrLargeDataResult = useObservable(historicOrLargeDataResult$, []);
  if ((totalHits == null && totalRepresentedItemCount == null) || historicOrLargeDataResult == null) {
    return <Placeholder />;
  }

  let topText;
  let bottomText;
  if (withGrouping) {
    topText = t('in-new-components:analyzeView.groupedViewHeader', {
      count: totalHits,
      formattedCount: number.compact(totalHits)
    });
    if (withResultsInGroups) {
      bottomText = t('in-new-components:analyzeView.result', {
        count: totalRepresentedItemCount,
        formattedCount: number.compact(totalRepresentedItemCount)
      });
    }
  } else {
    topText = t('in-new-components:analyzeView.result', {
      count: totalRepresentedItemCount,
      formattedCount: number.compact(totalRepresentedItemCount)
    });
    const showRetainedItemsCount =
      historicOrLargeDataResult.containsHistoricData && totalRepresentedItemCount > totalHits;
    if (showRetainedItemsCount) {
      bottomText = t('in-new-components:analyzeView.resultRetained', {
        count: totalHits,
        formattedCount: number.compact(totalHits)
      });
    }
  }

  return (
    <Presenter
      topText={topText}
      bottomText={bottomText}
      historicOrLargeDataResult={historicOrLargeDataResult}
      withSamplingTooltip={withSamplingTooltip}
      withAdjustedWindowSizeTooltip={withAdjustedWindowSizeTooltip}
    />
  );
}

function Placeholder() {
  return <Presenter topText={t('in-new-components:analyzeView.resultHeaderLoading')} />;
}

function Presenter({
  topText,
  bottomText,
  historicOrLargeDataResult,
  withSamplingTooltip,
  withAdjustedWindowSizeTooltip
}) {
  const { containsHistoricData, retention } = historicOrLargeDataResult ?? emptyObject;
  const showSamplingTooltip = withSamplingTooltip && !samplingIndicatorEnabled && containsHistoricData;
  return (
    <div className={locals.header}>
      <div className={locals.topTextWithTooltip}>
        <h3 className={locals.topText}>{topText}</h3>
        {showSamplingTooltip && (
          <TimeIcon
            theme="light"
            tooltipTheme="dark"
            tooltipAlign="rightMiddle"
            containsHistoricData
            retention={retention}
          />
        )}
        {withAdjustedWindowSizeTooltip && (
          <Tooltip content={t('in-new-components:analyzeView.resultHeaderTooltip')} align="rightMiddle">
            <SvgIcon className={locals.adjustmentIcon} type="lib_approximately_equal" />
          </Tooltip>
        )}
      </div>
      <span className={locals.bottomText}>{bottomText}</span>
    </div>
  );
}
