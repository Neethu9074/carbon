/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';
import { lib } from 'in-themes/theme';

import locals from 'in-alerting/components/IconLabel.mless';

const IconLabel = forwardRef(
  ({ text = '', type, noBottomMargin, color = lib.colors.N900Primary, width, ellipsis }, ref) => {
    return (
      <HorizontalFlexWrapper
        ref={ref}
        className={classNames({
          [locals.container]: true,
          [locals.noBottomMargin]: noBottomMargin
        })}
        style={{ color, width }}
      >
        <SvgIcon className={locals.icon} color={color} type={type} />
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
  ellipsis: PropTypes.bool
};

export default IconLabel;
