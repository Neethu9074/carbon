/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { SvgIcon, useTheme } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';

import locals from 'in-alerting/components/IconLabel.mless';

interface IconLabelProps {
  text?: string;
  type: string;
  color?: string;
  noBottomMargin?: boolean;
  width?: string | number;
  ellipsis?: boolean;
  /**
   * By default the icon has the same color as set in color prop.
   * Use this prop only if the icon should have a different color
   */
  iconColor?: string;
}

const IconLabel = forwardRef<HTMLDivElement, IconLabelProps>(
  ({ text = '', type, noBottomMargin, color, iconColor, width, ellipsis }, ref) => {
    const theme = useTheme();

    color ??= theme.ids.color.option.neutral['900'];

    return (
      <HorizontalFlexWrapper
        ref={ref}
        className={classNames({
          [locals.container]: true,
          [locals.noBottomMargin]: noBottomMargin
        })}
        style={{ color, width }}
      >
        <SvgIcon className={locals.icon} color={iconColor ?? color} type={type} />
        <div
          className={classNames({
            [locals.text]: true,
            [locals.ellipsis]: ellipsis
          })}
        >
          {text}
        </div>
      </HorizontalFlexWrapper>
    );
  }
);

IconLabel.displayName = 'IconLabel';

export default IconLabel;
