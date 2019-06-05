import React from 'react';

import { historicOrLargeDataResult$ } from 'in-new-components/time/TimeSelection/TimeSelection';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';

import locals from './ResultHeader.mless';

export default connectTo(
  {
    historicOrLargeDataResult: historicOrLargeDataResult$
  },

  function ResultHeader({ itemType, nbRows, nbItems, historicOrLargeDataResult, withoutMargin = false, withMaxWidth }) {
    let counter = '';
    const { containsPastLiveData, samplingLevel } = historicOrLargeDataResult;

    if (itemType == 'Group') {
      counter = formatCounter(nbRows, 'Group');
    } else {
      if (containsPastLiveData || (samplingIndicatorEnabled && samplingLevel && samplingLevel.samplingRatio < 1)) {
        counter = formatCounter(nbRows, 'Row');
      } else {
        counter = formatCounter(nbItems, itemType);
      }
    }

    return (
      <div
        className={evaluateClassNames({
          [locals.wrapper]: true,
          [locals.withMargin]: !withoutMargin
        })}
      >
        <span className={locals.result}>Result</span>
        <span
          className={evaluateClassNames({
            [locals.number]: true,
            [locals.withMaxWidth]: withMaxWidth
          })}
        >
          {counter}
        </span>
        {!samplingIndicatorEnabled && containsPastLiveData && <TimeIcon theme="light" containsPastLiveData />}
      </div>
    );
  }
);

function formatCounter(nb, unit) {
  if (nb != null) {
    return `${number.compact(nb)} ${unit}${nb === 1 ? '' : 's'}`;
  }
  return '';
}
