/*
 * (c) Copyright IBM Corp. 2022
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
  size?: Size;
}

const MigrationResultIconLabel = forwardRef<HTMLDivElement, MigrationResultIconLabelProps>(
  ({ text = '', type, noBottomMargin, color = theme.lib.colors.N900Primary, size, toolTip = '' }, ref) => {
    return (
      <div className={locals.padIcon}>
        <Tooltip content={toolTip}>
          <HorizontalFlexWrapper
            ref={ref}
            className={classNames({
              [locals.container]: true,
              [locals.noBottomMargin]: noBottomMargin
            })}
            style={{ color }}
          >
            {type !== '' ? (
              <SvgIcon className={locals.icon} color={color} type={type} size={size ?? size} />
            ) : (
              <div className={locals.noImport} />
            )}
            <div
              className={classNames({
                [locals.text]: true,
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
