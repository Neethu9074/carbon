/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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

import locals from './ResultHeader.mless';

export default connectTo(
  {
    historicOrLargeDataResult: historicOrLargeDataResult$
  },

  function ResultHeader({
    itemType,
    nbRows,
    nbItems,
    hideResultCount = false,
    historicOrLargeDataResult,
    withoutMargin = false,
    withMaxWidth,
    adjustedWindowSize
  }) {
    let counter = '';
    const { containsHistoricData, retention, samplingLevel } = historicOrLargeDataResult ?? emptyObject;

    if (!hideResultCount) {
      if (itemType === 'Group') {
        counter = formatCounter(nbRows, 'Group');
      } else {
        if (containsHistoricData || (samplingIndicatorEnabled && samplingLevel && samplingLevel.samplingRatio < 1)) {
          counter = formatCounter(nbRows, 'Row');
        } else {
          counter = formatCounter(nbItems, itemType);
        }
      }
    }

    return (
      <div
        className={classNames({
          [locals.wrapper]: true,
          [locals.withMargin]: !withoutMargin
        })}
      >
        <span className={locals.result}>Result</span>
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

function formatCounter(nb, unit) {
  if (nb != null) {
    return `${number.compact(nb)} ${unit}${nb === 1 ? '' : 's'}`;
  }
  return 'Loading…';
}
