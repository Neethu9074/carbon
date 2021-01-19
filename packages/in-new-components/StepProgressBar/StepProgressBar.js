/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import theme from 'in-themes';
import React from 'react';

import locals from './StepProgressBar.mless';

const colors = [theme.lib.colors.lightBlue800, theme.lib.colors.cyan800, theme.lib.colors.green800];

export default function StepProgressBar({ stepTitles, step = 0 }) {
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
              [locals.titleSelectedStep]: step === i
            })}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
}

function getWidthInPercent(stepTitles, step) {
  return 100 * ((step + 1) / stepTitles.length);
}

function validateStep(stepTitles, step) {
  if (__DEV__) {
    const maxLen = stepTitles.length - 1;
    invariant(step >= 0 || step <= maxLen, `step with value "${step}" is out of range. I must be >=0 and <=${maxLen}`);
  }
}

StepProgressBar.propTypes = {
  stepTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  step: PropTypes.number
};
