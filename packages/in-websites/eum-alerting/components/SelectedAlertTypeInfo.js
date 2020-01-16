import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './SelectedAlertTypeInfo.mless';

export default function SelectedAlertTypeInfo({ title, description, svgIconType }) {
  return (
    <div className={locals.outerWrapper}>
      <div className={locals.innerWrapper}>
        {svgIconType && <SvgIcon className={locals.icon} type={svgIconType} />}

        <div>
          <span className={locals.heading}>{title}</span>
          <p className={locals.text}>{description}</p>
        </div>
      </div>
    </div>
  );
}

SelectedAlertTypeInfo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  svgIconType: PropTypes.string
};
