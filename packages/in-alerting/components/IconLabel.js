/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import theme from 'in-themes';

import locals from 'in-alerting/components/IconLabel.mless';

const IconLabel = forwardRef(
  ({ text = '', type, noBottomMargin, color = theme.lib.colors.N900Primary, iconColor, width, ellipsis }, ref) => {
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

IconLabel.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  noBottomMargin: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ellipsis: PropTypes.bool,
  /**
   * By default the icon has the same color as set in color prop.
   * Use this prop only if the icon should have a different color
   */
  iconColor: PropTypes.string
};

export default IconLabel;
