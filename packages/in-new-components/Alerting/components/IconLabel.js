import PropTypes from 'prop-types';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './IconLabel.mless';

export default function IconLabel({ text = '', type }) {
  return (
    <HorizontalFlexWrapper className={locals.wrapper}>
      <SvgIcon className={locals.icon} type={type} /> {text}
    </HorizontalFlexWrapper>
  );
}

IconLabel.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};
