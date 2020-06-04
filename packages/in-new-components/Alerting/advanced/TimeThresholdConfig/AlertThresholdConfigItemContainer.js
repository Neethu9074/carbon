import PropTypes from 'prop-types';
import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './TimeThresholdConfig.mless';

export default function AlertThresholdConfigItemContainer({ children, iconType, hasExtraColumnOnRight }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.columns4]: hasExtraColumnOnRight,
        [locals.columns3]: !hasExtraColumnOnRight,
        [locals.alertConfigItemContainer]: true
      })}
    >
      <SvgIcon className={locals.icon} type={iconType} />
      {children}
    </div>
  );
}

AlertThresholdConfigItemContainer.propTypes = {
  children: PropTypes.node.isRequired,
  hasExtraColumnOnRight: PropTypes.bool,
  iconType: PropTypes.string
};
