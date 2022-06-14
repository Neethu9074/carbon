/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from './MigrationResultIconLabel.mless';

interface MigrationResultIconLabelProps {
  text?: string;
  type: string;
  toolTip: string;
  color?: string;
  noBottomMargin?: boolean;
  width?: string | number;
  ellipsis?: boolean;
  size?: Size;
  /**
   * By default the icon has the same color as set in color prop.
   * Use this prop only if the icon should have a different color
   */
  iconColor?: string;
}

const MigrationResultIconLabel = forwardRef<HTMLDivElement, MigrationResultIconLabelProps>(
  (
    {
      text = '',
      type,
      noBottomMargin,
      color = theme.lib.colors.N900Primary,
      iconColor,
      width,
      ellipsis,
      toolTip = '',
      size
    },
    ref
  ) => {
    return (
      <div className={locals.padIcon}>
        <Tooltip content={toolTip}>
          <HorizontalFlexWrapper
            ref={ref}
            className={classNames({
              [locals.container]: true,
              [locals.noBottomMargin]: noBottomMargin
            })}
            style={{ color, width }}
          >
            {type !== '' ? (
              <SvgIcon className={locals.icon} color={iconColor ?? color} type={type} size={size ?? size} />
            ) : (
              <div className={locals.noImport} />
            )}
            <div
              className={classNames({
                [locals.text]: true,
                [locals.ellipsis]: ellipsis,
                [locals.padIcon]: true
              })}
            >
              {text}
            </div>
          </HorizontalFlexWrapper>
        </Tooltip>
      </div>
    );
  }
);

MigrationResultIconLabel.displayName = 'MigrationResultIconLabel';

export default MigrationResultIconLabel;
