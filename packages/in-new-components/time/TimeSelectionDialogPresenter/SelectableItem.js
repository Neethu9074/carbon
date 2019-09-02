import React from 'react';

import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import { format } from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimeIcon from 'in-new-components/time/TimeIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './SelectableItem.mless';

export default connectTo(
  props => ({
    containsPastLiveData:
      !props.hideTimeIcon &&
      containsPastLiveData$(
        { windowSize: props.newTimeframe.windowSize, to: props.newTimeframe.to, focusedMoment: props.newTimeframe.to },
        false
      )
  }),
  function SelectableItem({ timeConfig, newTimeframe, onChange, containsPastLiveData, hideTimeIcon = false }) {
    const isActive = timeConfig.to === newTimeframe.to && timeConfig.windowSize === newTimeframe.windowSize;
    return (
      <a
        className={evaluateClassNames({
          [locals.item]: true,
          [locals.activeItem]: isActive
        })}
        href="#"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onChange(newTimeframe);
        }}
      >
        {newTimeframe.label || format(newTimeframe)}
        {containsPastLiveData &&
          !hideTimeIcon && (
            <TimeIcon theme={isActive ? 'dark' : 'light'} className={locals.timeIcon} containsPastLiveData />
          )}
      </a>
    );
  }
);
