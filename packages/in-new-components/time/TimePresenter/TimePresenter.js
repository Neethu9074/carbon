/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-new-components/time/timeframeFormatter';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import TimeIcon from 'in-new-components/time/TimeIcon';

import locals from './TimePresenter.mless';

export default function TimePresenter({
  onClick,
  timeConfig,
  historicData,
  retention,
  largeData,
  expanded,
  refSetter,
  darkTheme
}) {
  return (
    <DashboardHeaderButton
      expanded={expanded}
      darkTheme={darkTheme}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
      refSetter={refSetter}
      className={locals.button}
      noAutoMargin
    >
      <div className={locals.outerWrapper}>
        <TimeIcon
          className={locals.timeIcon}
          containsHistoricData={historicData}
          retention={retention}
          largeData={largeData}
          theme={darkTheme ? 'dark' : 'light'}
        />
        <div className={locals.displayTimeWrapper}>
          <div
            className={classNames({
              [locals.timeSettingTop]: true,
              [locals.timeSettingTopExpanded]: expanded
            })}
          >
            {timeDisplayTopFormat(timeConfig)}
          </div>
          <div
            className={classNames({
              [locals.timeSetting]: true,
              [locals.timeSettingExpanded]: expanded
            })}
          >
            {timeDisplayBottomFormat(timeConfig)}
          </div>
        </div>
      </div>
    </DashboardHeaderButton>
  );
}
