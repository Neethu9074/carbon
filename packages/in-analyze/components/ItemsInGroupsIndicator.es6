import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

import locals from './ItemsInGroupsIndicator.mless';

export default connectTo(
  props => ({
    containsPastLiveData: timeConfig$.flatMap(timeConfig =>
      containsPastLiveData$(timeConfig, props.containsPastLiveData)
    )
  }),

  function ItemsInGroupsIndicator({ numCalls, numTraces, numGroups, containsPastLiveData, withoutMargin = false }) {
    let numItems;
    let itemType;
    if (numCalls != undefined) {
      numItems = numCalls;
      itemType = 'Call';
    } else {
      numItems = numTraces;
      itemType = 'Trace';
    }

    let counter;
    if (numItems != undefined && numGroups != undefined) {
      counter = `${number.compact(numItems)} ${itemType}${numItems === 1 ? '' : 's'} (in ${numGroups} Group${
        numGroups === 1 ? '' : 's'
      })`;
    } else if (numItems != undefined) {
      counter = `${number.compact(numItems)} ${itemType}${numItems === 1 ? '' : 's'}`;
    } else if (numGroups != undefined) {
      counter = `${numGroups} Group${numGroups === 1 ? '' : 's'}`;
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
