/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error
import { timeDisplayBottomFormat, timeDisplayTopFormat } from 'in-components/time/timeframeFormatter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import DropdownButton from 'in-components/Button/DropdownButton';
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
  return (
    <DropdownButton
      data-test-id="time-picker"
      expanded={expanded}
      kind="tertiary"
      darkTheme={darkTheme}
      onClick={(e: FirstArgumentType<typeof stopPropagationAndPreventDefault>) => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
      ref={refSetter as React.MutableRefObject<HTMLButtonElement>}
      className={locals.carbonTimePicker}
      noAutoMargin
    >
      <div className={locals.carbonDisplayTimeWrapper}>
        <div className={locals.carbonTimeSettingTop}>{timeDisplayTopFormat(timeConfig)}</div>
        <div className={locals.carbonTimeSetting}>{timeDisplayBottomFormat(timeConfig)}</div>
      </div>
    </DropdownButton>
  );
}
