/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { getColorBySeverity } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import { useTheme } from 'in-themes';

import locals from './HealthDot.mless';

interface Props {
  severity?: number;
  explanation?: string;
  iconSize?: number;
  className?: string;
}

export default function HealthDot({ severity = 0, explanation, iconSize, className }: Props) {
  const theme = useTheme();
  const dot = (
    <div
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor: getColorBySeverity(severity, { defaultColor: theme.ids.color.option.green['500'] })
      }}
      // @ts-expect-error classnames explicitly can handle undefined object keys
      className={classNames({ [locals.dot]: true, [className]: true })}
    />
  );
  if (!explanation) {
    return dot;
  }
  return <Tooltip content={explanation}>{dot}</Tooltip>;
}
