import PropTypes from 'prop-types';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './IconLabel.mless';
import { lib } from 'in-themes/theme';

export default function IconLabel({ text = '', type, color = lib.colors.N900Primary, noBottomMargin }) {
  return (
    <HorizontalFlexWrapper className={noBottomMargin ? null : locals.withBottomMargin}>
      <SvgIcon className={locals.icon} color={color} type={type} />
      <span style={{ color }}>{text}</span>
    </HorizontalFlexWrapper>
  );
}

IconLabel.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  noBottomMargin: PropTypes.bool
};
