import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import TimeIcon from 'in-new-components/time/TimeIcon';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';

import locals from './CallsAndGroupsIndicator.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    containsPastLiveData: timeConfig$.flatMap(timeConfig =>
      containsPastLiveData$(timeConfig, props.containsPastLiveData)
    )
  }),

  function CallsAndGroupsIndicator({ numCalls, numGroups, containsPastLiveData }) {
    return (
      <div className={locals.wrapper}>
        <span className={locals.result}>Result</span>
        <span className={locals.number}>
          {`${number.compact(numCalls)} Calls${numGroups ? ` (in ${numGroups} Groups)` : ''}`}
        </span>
        {containsPastLiveData && <TimeIcon theme="light" containsPastLiveData />}
      </div>
    );
  }
);
