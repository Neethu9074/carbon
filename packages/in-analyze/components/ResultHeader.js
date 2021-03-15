/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { number } from 'in-services/formatters/number';
import { emptyObject } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ResultHeader.mless';

export default connectTo(
  {
    historicOrLargeDataResult: historicOrLargeDataResult$
  },

  function ResultHeader({
    itemType,
    nbRows,
    nbItems,
    resultCountLimit,
    historicOrLargeDataResult,
    withoutMargin = false,
    withMaxWidth,
    adjustedWindowSize
  }) {
    let counter = '';
    const { containsHistoricData, retention, samplingLevel } = historicOrLargeDataResult ?? emptyObject;

    if (itemType === 'Group') {
      counter = formatCounter(nbRows, 'Group', resultCountLimit);
    } else {
      if (containsHistoricData || (samplingIndicatorEnabled && samplingLevel && samplingLevel.samplingRatio < 1)) {
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
        {!samplingIndicatorEnabled && containsHistoricData && (
          <TimeIcon theme="light" containsHistoricData retention={retention} />
        )}
        {adjustedWindowSize && (
          <Tooltip content={t('in-analyze:resultHeaderTooltip')} align="bottomMiddle">
            <SvgIcon className={locals.adjustmentIcon} type="lib_approximately_equal" />
          </Tooltip>
        )}
      </div>
    );
  }
);

function formatCounter(nb, unit, limit = Number.MAX_SAFE_INTEGER) {
  if (nb != null) {
    return `${number.compact(nb)}${nb < limit ? '' : '+'} ${unit}${nb === 1 ? '' : 's'}`;
  }
  return 'Loading…';
}
