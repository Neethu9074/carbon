/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton } from '@instana/components';

// @ts-expect-error - Could not find a declaration file
import { timeDisplayBottomFormat, timeDisplayTopFormat } from 'in-components/time/timeframeFormatter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { TimeConfig } from 'in-types';

import locals from './DatePresenter.mless';

export interface TimePresenterProps {
  onClick: (args: void) => void;
  timeConfig: TimeConfig;
  expanded: boolean;
  refSetter?: React.MutableRefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
  darkTheme?: boolean;
}

type FirstArgumentType<T> = T extends (first: infer ArgType, ...args: any[]) => any ? ArgType : never;

export default function DatePresenter({ onClick, timeConfig, refSetter }: TimePresenterProps) {
  return (
    <div data-testid="date-presenter-button">
      <DashboardButton
        onClick={(e: FirstArgumentType<typeof stopPropagationAndPreventDefault>) => {
          stopPropagationAndPreventDefault(e);
          onClick();
        }}
        ref={refSetter}
        icon="lib_arrow_drop_down"
        kind="tertiary"
        iconSize="xs"
        className={locals.carbonTimePicker}
      >
        <div className={locals.carbonDisplayTimeWrapper}>
          <div className={locals.carbonTimeSettingTop}>{timeDisplayTopFormat(timeConfig)}</div>
          <div className={locals.carbonTimeSetting}>{timeDisplayBottomFormat(timeConfig)}</div>
        </div>
      </DashboardButton>
    </div>
  );
}
