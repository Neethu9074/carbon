import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
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

  function ItemsInGroupsIndicator({ numCalls, numTraces, numGroups, containsPastLiveData }) {
    let numItems;
    let itemType;
    if (numCalls != undefined) {
      numItems = numCalls;
      itemType = 'Calls';
    } else {
      numItems = numTraces;
      itemType = 'Traces';
    }

    let counter;
    if (numItems != undefined && numGroups != undefined) {
      counter = `${number.compact(numItems)} ${itemType} (in ${numGroups} Groups)`;
    } else if (numItems != undefined) {
      counter = `${number.compact(numItems)} ${itemType}`;
    } else if (numGroups != undefined) {
      counter = `${numGroups} Groups`;
    }

    return (
      <div className={locals.wrapper}>
        <span className={locals.result}>Result</span>
        <span className={locals.number}>{counter}</span>
        {containsPastLiveData && <TimeIcon theme="light" containsPastLiveData />}
      </div>
    );
  }
);
