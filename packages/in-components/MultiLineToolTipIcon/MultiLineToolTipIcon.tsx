/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, SvgIconSizes } from '@instana/components';

import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon.mless';

interface Props {
  withMargin?: boolean;
  lines: string[];
  iconSize?: SvgIconSizes;
  icon?: string;
  label?: string;
}

export default function MultiLineToolTipIcon({
  withMargin = false,
  lines = [],
  iconSize = SvgIconSizes.regular,
  icon = 'lib_approximately_equal',
  label
}: Props) {
  return (
    <Tooltip
      align="bottomLeft"
      content={lines.map((line, idx) => (
        <p className={locals.tooltipItem} key={idx}>
          {line}
        </p>
      ))}
    >
      <div className={locals.container}>
        <SvgIcon
          type={icon}
          size={iconSize}
          className={classNames(locals.indicator, {
            [locals.withMargin]: withMargin
          })}
        />
        {label && <p className={locals.label}>{label}</p>}
      </div>
    </Tooltip>
  );
}
