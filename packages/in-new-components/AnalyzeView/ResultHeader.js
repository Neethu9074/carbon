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
  adjustedWindowSize,
  withSamplingTooltip = false,
  isValid = true
}) {
  const historicOrLargeDataResult = useObservable(
    withSamplingTooltip && !samplingIndicatorEnabled ? historicOrLargeDataResult$ : null,
    []
  );
  const { containsHistoricData, retention } = historicOrLargeDataResult ?? emptyObject;

  return (
    <div className={locals.wrapper}>
      {label && <span className={locals.result}>{label}</span>}
      {totalRepresentedItemCount == null ? (
        <span className={locals.number}>
          {isValid ? t('in-new-components:analyzeView.resultHeaderLoading') : t('in-new-components:analyze.noResults')}
        </span>
      ) : (
        <>
          <span className={locals.number}>{getItemName({ count: totalRepresentedItemCount })}</span>
          {containsHistoricData && (
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
  adjustedWindowSize: rpt.number,
  withSamplingTooltip: rpt.bool,
  isValid: rpt.bool
};
