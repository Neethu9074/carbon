import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import locals from './Button.mless';

export const kinds = ['default', 'primary', 'secondary', 'danger', 'info', 'success', 'warning'];
export const sizes = ['lg', 'sm', 'xs'];

export default connectTo(props => {
  if (props.href$) {
    return {
      href: props.href$
    };
  }
  return emptyObject;
}, Button);

function Button({
  className,
  kind = 'default',
  type = 'button',
  size = 'lg',
  onClick,
  style,
  children,
  target,
  href,
  disabled,
  autoFocus,
  outlineOnly,
  asBlock
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

  if (asBlock) {
    classes = `${classes} ${locals.block}`;
  }

  if (outlineOnly) {
    classes = `${classes} ${locals.outlineOnly}`;
  }

  if (disabled) {
    onClick = stopPropagationAndPreventDefault;
  }

  if (!href) {
    return (
      <button className={classes} type={type} onClick={onClick} style={style} autoFocus={autoFocus}>
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      onClick={onClick ? onClick : stopPropagation}
      style={style}
      target={target}
      autoFocus={autoFocus}
    >
      {children}
    </a>
  );
}

Button.propTypes = {
  className: rpt.string,
  style: rpt.object,
  children: rpt.node.isRequired,
  type: rpt.oneOf(['button', 'submit']),
  kind: rpt.oneOf(kinds),
  size: rpt.oneOf(sizes),
  target: rpt.string,
  onClick: rpt.func,
  href: rpt.string,
  // eslint-disable-next-line react/no-unused-prop-types
  href$: rpt.object,
  disabled: rpt.bool,
  autoFocus: rpt.bool,
  outlineOnly: rpt.bool,
  asBlock: rpt.bool
};
