/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { themes } from '@instana/design-tokens';

import SapThresholdTooltip from 'in-sap/Dashboards/tables/SapThresholdTooltip.js';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-kubernetes/Dashboards/CronJob/CronJob.mless';

export function HealthDot({
  type,
  yellowToGreen,
  greenToYellow,
  redToYellow,
  yellowToRed,
  unit,
  color = '#BAE6FF', // We don't have a alternative ids color for fadedTeal800
  explanation,
  iconSize,
  className
}) {
  const dot = (
    <div
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor: color
      }}
      className={classNames({ [locals.dot]: true, [className]: true })}
    />
  );
  if (!explanation) {
    return dot;
  }
  return (
    <Tooltip
      content={
        <SapThresholdTooltip
          type={type}
          yellowToGreen={yellowToGreen}
          greenToYellow={greenToYellow}
          redToYellow={redToYellow}
          yellowToRed={yellowToRed}
          unit={unit}
        />
      }
    >
      {dot}
    </Tooltip>
  );
}

export const statusToColour = {
  Grey: themes.default.ids.color.option.green[500],
  Green: themes.default.ids.color.option.green[500],
  Red: themes.default.ids.color.option.red[500],
  Unknown: themes.default.ids.color.option.neutral[400]
};

HealthDot.propTypes = {
  type: PropTypes.string,
  yellowToGreen: PropTypes.string,
  greenToYellow: PropTypes.string,
  redToYellow: PropTypes.string,
  yellowToRed: PropTypes.string,
  unit: PropTypes.string,
  color: PropTypes.string,
  explanation: PropTypes.string,
  iconSize: PropTypes.number,
  className: PropTypes.string
};
