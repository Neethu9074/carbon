import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './FloatingActionButton.mless';

export const positions = {
  bottomRight: 'bottomRight'
};

export default function FloatingActionButton({
  children,
  iconType,
  onClick,
  position = positions.bottomRight,
  withBoxShadow = false
}) {
  return (
    <button
      className={evaluateClassNames({
        [locals.button]: true,
        [locals.withShadow]: withBoxShadow,
        [locals.hasIcon]: !!iconType,
        [locals[position]]: position
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
  withBoxShadow: PropTypes.bool,
  position: PropTypes.oneOf(Object.values(positions))
};
