import rpt from 'prop-types';
import React from 'react';

import './Button.less';

const block = 'in-button';

export default function Button({
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
  autoFocus
}) {
  let classes = `${block} ${block}--${kind} ${block}--${size}`;
  if (className) {
    classes = `${classes} ${className}`;
  }

  // Do not use the disabled attribute as we want to continue to retrieve mouse events
  // sorry usability :(.
  if (disabled) {
    classes = `${classes} ${block}--disabled`;
  }

  if (onClick && disabled) {
    onClick = stopPropagation;
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
  kind: rpt.oneOf(['default', 'primary', 'secondary', 'secondaryv2', 'danger', 'info', 'success']),
  size: rpt.oneOf(['lg', 'sm', 'xs']),
  target: rpt.string,
  onClick: rpt.func,
  href: rpt.string,
  disabled: rpt.bool,
  autoFocus: rpt.bool
};

function stopPropagation(e) {
  e.stopPropagation();
}
