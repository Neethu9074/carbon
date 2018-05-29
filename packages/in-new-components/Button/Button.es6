import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { emptyObject } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Button.mless';

export const kinds = ['primary', 'secondary', 'action', 'subtle', 'create', 'danger'];
export const sizes = ['normal', 'compact'];

const iconDimensions = {
  normal: 24,
  compact: 16
};

export default connectTo(props => {
  if (props.href$) {
    return {
      href: props.href$
    };
  }
  return emptyObject;
}, Button);

function Button({
  icon,
  iconSpinning,
  className,
  kind = 'primary',
  size = 'normal',
  type = 'button',
  onClick,
  style,
  children,
  href,
  disabled,
  target
}) {
  let classes = `${locals.button} ${locals[kind] || ''} ${locals[size] || ''}`;
  if (className) {
    classes = `${classes} ${className}`;
  }

  // Do not use the disabled attribute as we want to continue to retrieve mouse events
  // sorry usability :(.
  if (disabled) {
    classes = `${classes} ${locals.disabled} ${locals[kind + 'Disabled']}`;
  }

  if (disabled) {
    onClick = stopPropagationAndPreventDefault;
  }

  const iconElement = icon && (
    <SvgIcon type={icon} spinning={iconSpinning} maxHeight={iconDimensions[size]} className={locals.icon} />
  );

  if (!href) {
    return (
      <button className={classes} onClick={onClick} style={style} type={type}>
        {iconElement} {children}
      </button>
    );
  }

  return (
    <a href={href} target={target} className={classes} onClick={onClick ? onClick : stopPropagation} style={style}>
      {iconElement} {children}
    </a>
  );
}

Button.propTypes = {
  icon: rpt.string,
  iconSpinning: rpt.bool,
  className: rpt.string,
  style: rpt.object,
  children: rpt.node.isRequired,
  kind: rpt.oneOf(kinds),
  size: rpt.oneOf(sizes),
  type: rpt.string,
  onClick: rpt.func,
  href: rpt.string,
  // eslint-disable-next-line react/no-unused-prop-types
  href$: rpt.object,
  target: rpt.string,
  disabled: rpt.bool
};
