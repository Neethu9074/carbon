import React from 'react';

import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-new-components/time/timeframeFormatter';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import TimeIcon from 'in-new-components/time/TimeIcon';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TimePresenter.mless';

export default function TimePresenter({
  onClick,
  timeConfig,
  historicData,
  largeData,
  samplingLevel,
  className,
  expanded,
  refSetter,
  darkTheme
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.outerWrapper]: true,
        [locals.dark]: darkTheme
      })}
    >
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
        <TimeIcon
          className={locals.timeIcon}
          containsPastLiveData={historicData}
          largeData={largeData}
          samplingLevel={samplingLevel}
          theme={darkTheme ? 'dark' : 'light'}
        />
        <div className={locals.displayTimeWrapper}>
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
