import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

import locals from './ResultHeader.mless';

export default connectTo(
  props => ({
    containsPastLiveData: timeConfig$.flatMap(timeConfig =>
      containsPastLiveData$(timeConfig, props.containsPastLiveData)
    )
  }),

  function ResultHeader({ itemType, nbRows, nbItems, containsPastLiveData, withoutMargin = false }) {
    let counter = '';

    if (itemType == 'Group') {
      counter = formatCounter(nbRows, 'Group');
    } else {
      if (containsPastLiveData) {
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
        <span className={locals.number}>{counter}</span>
        {containsPastLiveData && <TimeIcon theme="light" containsPastLiveData />}
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
