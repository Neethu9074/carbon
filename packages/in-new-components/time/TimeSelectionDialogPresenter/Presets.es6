import { range } from 'lodash';
import React from 'react';

import { getFixedTimePresets, getLivePresets } from 'in-new-components/time/timePresets';
import Header from 'in-new-components/time/TimeSelectionDialogPresenter/Header';
import formatTime from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Presets.mless';

export default function Presets({ timeConfig, onChange }) {
  const column1 = getLivePresets();
  const column2 = getFixedTimePresets();

  return (
    <div className={locals.wrapper}>
      <Header>Presets</Header>

      {range(0, Math.max(column1.length, column2.length)).map(i => (
        <div className={locals.row} key={i}>
          {i < column1.length && (
            <SelectableItem timeConfig={timeConfig} newTimeframe={column1[i]} onChange={onChange} />
          )}
          {i < column2.length && (
            <SelectableItem timeConfig={timeConfig} newTimeframe={column2[i]} onChange={onChange} />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectableItem({ timeConfig, newTimeframe, onChange }) {
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
    </a>
  );
}
