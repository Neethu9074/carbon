import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import locals from './Button.mless';

export const kinds = ['primary', 'secondary'];
export const sizes = ['normal', 'compact'];

export default connectTo(props => {
  if (props.href$) {
    return {
      href: props.href$
    };
  }
  return emptyObject;
}, Button);

function Button({ className, kind = 'primary', size = 'normal', onClick, style, children, href, disabled }) {
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

  if (!href) {
    return (
      <button className={classes} onClick={onClick} style={style}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} className={locals.link} onClick={onClick ? onClick : stopPropagation} style={style}>
      {children}
    </a>
  );
}

Button.propTypes = {
  className: rpt.string,
  style: rpt.object,
  children: rpt.node.isRequired,
  kind: rpt.oneOf(kinds),
  size: rpt.oneOf(sizes),
  onClick: rpt.func,
  href: rpt.string,
  // eslint-disable-next-line react/no-unused-prop-types
  href$: rpt.object,
  disabled: rpt.bool
};
