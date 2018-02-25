import React from 'react';

import format from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimePresenter.mless';

export default function TimePresenter({ onClick, timeframe, className, expanded, refSetter }) {
  return (
    <a
      className={joinClassNames(locals.wrapper, className)}
      href="#"
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      ref={refSetter}
    >
      <SvgIcon
        width={16}
        className={evaluateClassNames({
          [locals.timeIcon]: true,
          [locals.timeIconExpanded]: expanded
        })}
        type="time"
      />

      <span
        className={evaluateClassNames({
          [locals.timeSetting]: true,
          [locals.timeSettingExpanded]: expanded
        })}
      >
        {format(timeframe)}
      </span>

      <SvgIcon
        width={8}
        className={evaluateClassNames({
          [locals.toggleIcon]: true,
          [locals.toggleIconExpanded]: expanded
        })}
        type="triangle_down"
      />
    </a>
  );
}
