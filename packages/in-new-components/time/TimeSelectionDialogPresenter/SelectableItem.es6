import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import formatTime from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimeIcon from 'in-new-components/time/TimeIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './SelectableItem.mless';

export default connectTo(
  props => ({
    containsPastLiveData: containsPastLiveData$(
      { windowSize: props.newTimeframe.windowSize, to: props.newTimeframe.to, focusedMoment: props.newTimeframe.to },
      false
    )
  }),
  function SelectableItem({ timeConfig, newTimeframe, onChange, containsPastLiveData }) {
    return (
      <a
        className={evaluateClassNames({
          [locals.item]: true,
          [locals.activeItem]: timeConfig.to === newTimeframe.to && timeConfig.windowSize === newTimeframe.windowSize
        })}
        href="#"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onChange(newTimeframe);
        }}
      >
        {newTimeframe.label || formatTime(newTimeframe)}
        {containsPastLiveData && <TimeIcon theme="light" className={locals.timeIcon} containsPastLiveData />}
      </a>
    );
  }
);
