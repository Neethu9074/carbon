import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import locals from './ToggleButton.mless';

export default connectTo(props => {
  if (props.href$) {
    return {
      href: props.href$
    };
  }
  return emptyObject;
}, ToggleButton);

function ToggleButton({ className, checked, onChange, style, children, href, disabled, target }) {
  let classes = `${locals.toggleButton} ${checked ? locals.on : locals.off}`;
  if (className) {
    classes = `${classes} ${className}`;
  }

  if (disabled) {
    classes = `${classes} ${locals.disabled}`;
  }

  if (disabled) {
    onChange = stopPropagationAndPreventDefault;
  }

  if (!href) {
    return (
      <button className={classes} onClick={onChange} style={style}>
        {children}
      </button>
    );
  } else {
    return (
      <a href={href} target={target} className={classes} onClick={onChange ? onChange : stopPropagation} style={style}>
        {children}
      </a>
    );
  }
}

ToggleButton.propTypes = {
  className: rpt.string,
  style: rpt.object,
  children: rpt.node.isRequired,
  checked: rpt.bool,
  onChange: rpt.func,
  href: rpt.string,
  // eslint-disable-next-line react/no-unused-prop-types
  href$: rpt.object,
  target: rpt.string,
  disabled: rpt.bool
};
