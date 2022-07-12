/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ResultHeader.mless';

export default function ResultHeader({
  label,
  getItemName,
  totalRepresentedItemCount,
  totalHits,
  adjustedWindowSize,
  isLoading = true,
  resultPrecisionDetails,
  hideTooltip
}) {
  // for historic data show number of retained items
  // otherwise show total represented item count (a single batched call can represent multiple items)
  const isApproximateData = resultPrecisionDetails === 'PRECISION_APPROXIMATE';
  const resultCount = isApproximateData ? totalHits : totalRepresentedItemCount;

  return (
    <div className={locals.wrapper}>
      {label && <span className={locals.result}>{label}</span>}
      {(totalHits == null && totalRepresentedItemCount == null) || isApproximateData == null ? (
        <span className={locals.number}>
          {isLoading ? t('in-components:analyzeView.resultHeaderLoading') : t('in-components:analyze.noResults')}
        </span>
      ) : (
        <>
          {getItemName && <span className={locals.number}>{getItemName({ count: resultCount })}</span>}
          {adjustedWindowSize && !hideTooltip && (
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
  isLoading: rpt.bool,
  resultPrecisionDetails: rpt.shape({
    resultPrecision: rpt.string
  }),
  hideTooltip: rpt.bool
};
