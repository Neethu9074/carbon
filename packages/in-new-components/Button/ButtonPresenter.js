import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

export const kinds = [
  'primary',
  'primaryv2',
  'secondary',
  'action',
  'action--danger',
  'subtle',
  'create',
  'danger',
  'warning',
  'info'
];
export const sizes = ['normal', 'compact'];

const iconDimensions = {
  normal: 'regular',
  compact: 'xs'
};

export default function ButtonPresenter({
  icon,
  iconSpinning,
  iconSize,
  className,
  kind = 'primary',
  size = 'normal',
  type = 'button',
  onClick,
  style,
  children,
  href,
  disabled,
  target,
  refSetter,
  autoFocus
}) {
  let classes = `${locals.button} ${locals[kind] || ''} ${locals[size] || ''}`;
  if (className) {
    classes = `${classes} ${className}`;
  }

  // Do not use the disabled attribute as we want to continue to retrieve mouse events
  // sorry usability :(.
  if (disabled) {
    classes = `${classes} ${locals.disabled}`;
  }

  if (disabled) {
    onClick = stopPropagationAndPreventDefault;
  }

  let iconElement;
  if (icon) {
    iconElement = (
      <SvgIcon type={icon} spinning={iconSpinning} size={iconSize || iconDimensions[size]} className={locals.icon} />
    );
  }

  if (!href) {
    return (
      <button className={classes} onClick={onClick} style={style} type={type} ref={refSetter} autoFocus={autoFocus}>
        {iconElement} {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={classes}
      onClick={onClick ? onClick : stopPropagation}
      style={style}
      ref={refSetter}
      autoFocus={autoFocus}
    >
      {iconElement} {children}
    </a>
  );
}

ButtonPresenter.propTypes = {
  icon: rpt.string,
  iconSpinning: rpt.bool,
  iconSize: rpt.oneOf(['m', 'l']),
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
  disabled: rpt.bool,
  refSetter: rpt.func,
  autoFocus: rpt.bool
};
