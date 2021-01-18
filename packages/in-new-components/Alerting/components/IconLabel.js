import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';
import { lib } from 'in-themes/theme';

import locals from './IconLabel.mless';

const IconLabel = forwardRef(({ text = '', type, noBottomMargin, color = lib.colors.N900Primary }, ref) => {
  return (
    <HorizontalFlexWrapper
      ref={ref}
      className={classNames({
        [locals.container]: true,
        [locals.noBottomMargin]: noBottomMargin
      })}
      color={color}
    >
      <SvgIcon className={locals.icon} color={color} type={type} /> <span style={{ color }}>{text}</span>
    </HorizontalFlexWrapper>
  );
});

IconLabel.displayName = 'IconLabel';

IconLabel.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  noBottomMargin: PropTypes.bool
};

export default IconLabel;
