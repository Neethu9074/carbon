/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { colors } from 'in-custom-dashboards/widgets/Chart/FormComponent/colors';

import locals from 'in-applications/Dashboards/service/tabs/troubleshooting/infobox/ColorIndicator.mless';

export const getColorForValue = (value: string) => {
  return colors.find(c => c.id === value)?.color ?? value;
};

export interface ColorIndicatorProps {
  color: string;
  shape: 'rect' | 'dot';
}

export default function ColorIndicator({ color, shape }: ColorIndicatorProps) {
  return (
    <span
      style={{ background: color }}
      className={classNames({
        [locals.colorIndicator]: true,
        [locals.rect]: shape === 'rect',
        [locals.dot]: shape === 'dot'
      })}
    />
  );
}
