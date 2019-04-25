import React from 'react';

import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimePresenter.mless';

export default function TimePresenter({ onClick, timeConfig, className, expanded, refSetter }) {
  return (
    <div className={locals.timePresenter}>
      <SvgIcon className={locals.timeIcon} width={24} type="lib_datetime_time" />
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
        <div className={locals.timeWrapper}>
          <div
            className={evaluateClassNames({
              [locals.timeSettingTop]: true,
              [locals.timeSettingTopExpanded]: expanded
            })}
          >
            {timeDisplayTopFormat(timeConfig)}
          </div>
          <div
            className={evaluateClassNames({
              [locals.timeSetting]: true,
              [locals.timeSettingExpanded]: expanded
            })}
          >
            {timeDisplayBottomFormat(timeConfig)}
          </div>
        </div>

        <SvgIcon
          width={24}
          className={evaluateClassNames({
            [locals.toggleIcon]: true,
            [locals.toggleIconExpanded]: expanded
          })}
          type="lib_arrow_drop_down"
        />
      </a>
    </div>
  );
}
