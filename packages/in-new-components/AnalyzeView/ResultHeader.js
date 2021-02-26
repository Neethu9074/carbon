/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { emptyObject } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './ResultHeader.mless';

export default function ResultHeader({
  label,
  getItemName,
  totalRepresentedItemCount,
  totalHits,
  adjustedWindowSize,
  withSamplingTooltip = false,
  isValid = true
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
          {isValid ? t('in-new-components:analyzeView.resultHeaderLoading') : t('in-new-components:analyze.noResults')}
        </span>
      ) : (
        <>
          <span className={locals.number}>{getItemName({ count: resultCount })}</span>
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
            <Tooltip content={t('in-new-components:analyzeView.resultHeaderTooltip')} align="rightMiddle">
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
  getItemName: rpt.func.isRequired,
  totalRepresentedItemCount: rpt.number,
  totalHits: rpt.number,
  adjustedWindowSize: rpt.number,
  withSamplingTooltip: rpt.bool,
  isValid: rpt.bool
};
