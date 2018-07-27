import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

import locals from './CallsAndGroupsIndicator.mless';

export default connectTo(
  props => ({
    containsPastLiveData: timeConfig$.flatMap(timeConfig =>
      containsPastLiveData$(timeConfig, props.containsPastLiveData)
    )
  }),

  function CallsAndGroupsIndicator({ numCalls, numGroups, containsPastLiveData }) {
    let counter;
    if (numCalls != undefined && numGroups != undefined) {
      counter = `${number.compact(numCalls)} Calls (in ${numGroups} Groups)`;
    } else if (numCalls != undefined) {
      counter = `${number.compact(numCalls)} Calls`;
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
