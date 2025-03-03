/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import Tooltip from 'in-components/Tooltip';

import locals from 'in-kubernetes/Dashboards/CronJob/CronJob.mless';

interface HealthDotProps {
  color: string;
  iconSize: number;
  explanation?: string;
  className?: any;
}

export default function HealthDot({
  color = '#BAE6FF', // We don't have a alternative ids color for fadedTeal800
  explanation,
  iconSize,
  className
}: HealthDotProps) {
  const styles = {
    width: iconSize,
    height: iconSize,
    backgroundColor: color
  };

  const dot = <div style={styles} className={classNames({ [locals.dot]: true, [className]: true })} />;

  if (!explanation) {
    return <div className={locals.center}>{dot}</div>;
  }

  return (
    <div className={locals.center}>
      <Tooltip content={explanation}>{dot}</Tooltip>
    </div>
  );
}
