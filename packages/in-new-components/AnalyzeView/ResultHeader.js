/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { emptyObject } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ResultHeader.mless';

export default function ResultHeader({
  label,
  getItemName,
  totalRepresentedItemCount,
  totalHits,
  adjustedWindowSize,
  withSamplingTooltip = false,
  isLoading = true
}) {
  const historicOrLargeDataResult = useObservable(historicOrLargeDataResult$, []);
  const { containsHistoricData, retention } = historicOrLargeDataResult ?? emptyObject;
  const showSamplingTooltip = withSamplingTooltip && !samplingIndicatorEnabled && containsHistoricData;
  // for historic data show number of retained items
  // otherwise show total represented item count (a single batched call can represent multiple items)
  const resultCount = containsHistoricData ? totalHits : totalRepresentedItemCount;
  return (
    <div className={locals.wrapper}>
      {label && <span className={locals.result}>{label}</span>}
      {(totalHits == null && totalRepresentedItemCount == null) || historicOrLargeDataResult == null ? (
        <span className={locals.number}>
          {isLoading ? t('in-components:analyzeView.resultHeaderLoading') : t('in-components:analyze.noResults')}
        </span>
      ) : (
        <>
          {getItemName && <span className={locals.number}>{getItemName({ count: resultCount })}</span>}
          {showSamplingTooltip && (
            <TimeIcon
              theme="light"
              tooltipTheme="dark"
              tooltipAlign="rightMiddle"
              containsHistoricData
              retention={retention}
            />
          )}
          {adjustedWindowSize && (
            <Tooltip content={t('in-components:analyzeView.resultHeaderTooltip')} align="rightMiddle">
              <SvgIcon className={locals.adjustmentIcon} type="lib_approximately_equal" />
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
}

ResultHeader.propTypes = {
  label: rpt.string,
  getItemName: rpt.func,
  totalRepresentedItemCount: rpt.number,
  totalHits: rpt.number,
  adjustedWindowSize: rpt.number,
  withSamplingTooltip: rpt.bool,
  isLoading: rpt.bool
};
