/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import invariant from 'invariant';
import React from 'react';

import { themes } from '@instana/design-tokens';

import locals from './StepProgressBar.mless';

export interface StepProgressBarProps {
  stepTitles: string[];
  step?: number;
}

export default function StepProgressBar({ stepTitles, step = 0 }: StepProgressBarProps) {
  const colors = [
    themes.default.ids.color.option.blue['400'],
    themes.default.ids.color.option.teal['400'],
    themes.default.ids.color.option.green['500']
  ];

  validateStep(stepTitles, step);
  return (
    <div className={locals.container}>
      <div className={locals.barBg}>
        <div
          className={locals.barInner}
          style={{
            width: `${getWidthInPercent(stepTitles, step)}%`,
            backgroundColor: colors[step % colors.length]
          }}
        />
      </div>
      <div className={locals.stepTitles}>
        {stepTitles.map((title, i) => (
          <div
            key={i}
            className={classNames({
              [locals.titleAlignCenter]: true,
              [locals.titleSelectedStep]: step === i
            })}
            style={{
              width: `${getWidthInPercent(stepTitles, 0)}%`
            }}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
}

function getWidthInPercent(stepTitles: string[], step: number) {
  return 100 * ((step + 1) / stepTitles.length);
}

function validateStep(stepTitles: string[], step: number) {
  if (__DEV__) {
    const maxLen = stepTitles.length - 1;
    invariant(step >= 0 || step <= maxLen, `step with value "${step}" is out of range. I must be >=0 and <=${maxLen}`);
  }
}
