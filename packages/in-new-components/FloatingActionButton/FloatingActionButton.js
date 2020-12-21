import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import classNames from 'classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './FloatingActionButton.mless';

export default function FloatingActionButton({ children, iconType, onClick, withBoxShadow }) {
  return (
    <button
      className={classNames({
        [locals.button]: true,
        [locals.withShadow]: withBoxShadow,
        [locals.hasIcon]: !!iconType
      })}
      onClick={e => (onClick ? onClick() : stopPropagationAndPreventDefault(e))}
    >
      <div className={locals.inner}>
        {iconType && <SvgIcon className={locals.icon} type={iconType} />}
        <div className={locals.label}>{children}</div>
      </div>
    </button>
  );
}

FloatingActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  iconType: PropTypes.string,
  onClick: PropTypes.func,
  withBoxShadow: PropTypes.bool
};
