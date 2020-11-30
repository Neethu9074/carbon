import PropTypes from 'prop-types';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './IconLabel.mless';

export default function IconLabel({ text = '', type, noBottomMargin }) {
  return (
    <HorizontalFlexWrapper className={noBottomMargin ? null : locals.withBottomMargin}>
      <SvgIcon className={locals.icon} type={type} /> {text}
    </HorizontalFlexWrapper>
  );
}

IconLabel.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  noBottomMargin: PropTypes.bool
};
