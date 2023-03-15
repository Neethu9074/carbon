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
  fastQueryModeEnabled,
  isLoading = true,
  resultPrecisionDetails,
  subLabel
}) {
  // for historic data show number of retained items
  // otherwise show total represented item count (a single batched call can represent multiple items)
  const isApproximateData = resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';
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
          {getItemName && (
            <div>
              <div className={locals.labelWrapper}>
                <span className={locals.number}>{getItemName({ count: resultCount })}</span>
                {isApproximateData && (
                  <Tooltip
                    content={
                      fastQueryModeEnabled
                        ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
                        : t('in-components:approximateDataIndicator.dataRetention')
                    }
                    align="rightMiddle"
                  >
                    <SvgIcon className={locals.adjustmentIcon} type="lib_approximately_equal" />
                  </Tooltip>
                )}
              </div>
              {!!subLabel && <p className={locals.text}>{subLabel}</p>}
            </div>
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
  fastQueryModeEnabled: rpt.bool,
  isLoading: rpt.bool,
  resultPrecisionDetails: rpt.shape({
    resultPrecision: rpt.string
  }),
  subLabel: rpt.string
};
