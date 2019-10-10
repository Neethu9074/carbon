import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './ButtonRounded.mless';

export default function ButtonRounded({ children, iconType, onClick, withBoxShadow = false }) {
  return (
    <button
      className={evaluateClassNames({ [locals.button]: true, [locals.withShadow]: withBoxShadow })}
      onClick={e => (onClick ? onClick() : stopPropagationAndPreventDefault(e))}
    >
      <div className={locals.inner}>
        {iconType && <SvgIcon className={locals.icon} type={iconType} />}
        <div className={locals.label}>{children}</div>
      </div>
    </button>
  );
}

ButtonRounded.propTypes = {
  children: PropTypes.node.isRequired,
  iconType: PropTypes.string,
  onClick: PropTypes.func,
  withBoxShadow: PropTypes.bool
};
