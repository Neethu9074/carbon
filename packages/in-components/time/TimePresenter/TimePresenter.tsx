/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

// @ts-expect-error
import { timeDisplayBottomFormat, timeDisplayTopFormat } from 'in-components/time/timeframeFormatter';
// @ts-expect-error
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import TimeIcon from 'in-components/time/TimeIcon';
import { TimeConfig } from 'in-types';

import locals from './TimePresenter.mless';

export interface TimePresenterProps {
  onClick: (args: void) => void;
  timeConfig: TimeConfig;
  expanded: boolean;
  refSetter?: React.MutableRefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
  darkTheme?: boolean;
}

type FirstArgumentType<T> = T extends (first: infer ArgType, ...args: any[]) => any ? ArgType : never;

export default function TimePresenter({ onClick, timeConfig, expanded, refSetter, darkTheme }: TimePresenterProps) {
  if (carbonButtonEnabled) {
    return (
      <DashboardHeaderButton
        data-test-id="time-picker"
        expanded={expanded}
        darkTheme={darkTheme}
        onClick={(e: FirstArgumentType<typeof stopPropagationAndPreventDefault>) => {
          stopPropagationAndPreventDefault(e);
          onClick();
        }}
        refSetter={refSetter}
        className={locals.carbonTimePicker}
        noAutoMargin
      >
        <div className={locals.carbonDisplayTimeWrapper}>
          <div className={locals.carbonTimeSettingTop}>{timeDisplayTopFormat(timeConfig)}</div>
          <div className={locals.carbonTimeSetting}>{timeDisplayBottomFormat(timeConfig)}</div>
        </div>
      </DashboardHeaderButton>
    );
  }
  return (
    <DashboardHeaderButton
      expanded={expanded}
      darkTheme={darkTheme}
      onClick={(e: FirstArgumentType<typeof stopPropagationAndPreventDefault>) => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
      refSetter={refSetter}
      className={locals.button}
      noAutoMargin
    >
      <div className={locals.outerWrapper}>
        <TimeIcon className={locals.timeIcon} theme={darkTheme ? 'dark' : 'light'} />
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
