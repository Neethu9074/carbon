import { range } from 'lodash';
import React from 'react';

import { getFixedTimePresets, getLivePresets } from 'in-new-components/time/timePresets';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import formatTime from 'in-new-components/time/timeframeFormatter';

import locals from './TimeSelectionDialogPresenter.mless';

export default function TimeSelectionDialogPresenter({ timeframe, onChange, className }) {
  const column1 = getLivePresets();
  const column2 = getFixedTimePresets();

  return (
    <section className={joinClassNames(locals.wrapper, className)}>
      <h1 className={locals.header}>Presets</h1>

      {range(0, Math.max(column1.length, column2.length)).map(i => (
        <div className={locals.row} key={i}>
          {i < column1.length && <SelectableItem timeframe={timeframe} newTimeframe={column1[i]} onChange={onChange} />}
          {i < column2.length && <SelectableItem timeframe={timeframe} newTimeframe={column2[i]} onChange={onChange} />}
        </div>
      ))}
    </section>
  );
}

function SelectableItem({ timeframe, newTimeframe, onChange }) {
  return (
    <a
      className={evaluateClassNames({
        [locals.item]: true,
        [locals.activeItem]: timeframe.to === newTimeframe.to && timeframe.windowSize === newTimeframe.windowSize
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
