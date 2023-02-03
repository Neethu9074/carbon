/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ResultHeader.mless';

export default function ResultHeader({
  itemType,
  nbRows,
  nbItems,
  resultCountLimit,
  withoutMargin = false,
  withMaxWidth,
  adjustedWindowSize,
  resultPrecisionDetails
}) {
  let counter = '';
  const hasApproximateData = resultPrecisionDetails.resultPrecision === 'PRECISION_APPROXIMATE';

  if (itemType === 'Group') {
    counter = formatCounter(nbRows, 'Group', resultCountLimit);
  } else {
    if (hasApproximateData) {
      counter = formatCounter(nbRows, 'Row', resultCountLimit);
    } else {
      counter = formatCounter(nbItems, itemType, resultCountLimit);
    }
  }

  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.withMargin]: !withoutMargin
      })}
    >
      <span className={locals.result}>{t('in-analyze:analyzeView.components.resultHeader.result')}</span>
      <span
        className={classNames({
          [locals.number]: true,
          [locals.withMaxWidth]: withMaxWidth
        })}
      >
        {counter}
      </span>
      {adjustedWindowSize && (
        <Tooltip content={t('in-analyze:resultHeaderTooltip')} align="bottomMiddle">
          <SvgIcon className={locals.adjustmentIcon} type="lib_approximately_equal" />
        </Tooltip>
      )}
    </div>
  );
}

function formatCounter(nb, unit, limit = Number.MAX_SAFE_INTEGER) {
  if (nb != null) {
    return t('in-analyze:analyzeView.components.resultHeader.counter', {
      context: unit,
      count: nb,
      number: nb < limit ? number.compact(nb) : number.compact(nb) + '+'
    });
  }
  return t('in-analyze:analyzeView.components.resultHeader.loading');
}
