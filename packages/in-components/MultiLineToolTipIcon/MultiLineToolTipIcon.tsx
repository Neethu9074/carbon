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
}

export default function MultiLineToolTipIcon({
  withMargin = false,
  lines = [],
  iconSize = SvgIconSizes.regular
}: Props) {
  return (
    <Tooltip
      align="bottomMiddle"
      content={lines.map((line, idx) => (
        <p className={locals.tooltipItem} key={idx}>
          {line}
        </p>
      ))}
    >
      <SvgIcon
        type="lib_approximately_equal"
        size={iconSize}
        className={classNames(locals.indicator, {
          [locals.withMargin]: withMargin
        })}
      />
    </Tooltip>
  );
}
