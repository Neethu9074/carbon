import { compose } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import hover from 'in-new-components/ToggleButton/hover';
import { emptyObject } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import locals from './ToggleButton.mless';

export default compose(
  connectTo(props => {
    if (props.href$) {
      return {
        href: props.href$
      };
    }
    return emptyObject;
  }),
  hover
)(ToggleButton);

function ToggleButton({
  hovered,
  className,
  checked,
  onChange,
  style,
  children,
  href,
  disabled,
  target,
  iconOff,
  iconOffSpinning,
  iconOffHover,
  iconOffHoverSpinning,
  iconOn,
  iconOnSpinning,
  iconOnHover,
  iconOnHoverSpinning,
  darkTheme
}) {
  let classes;

  if (darkTheme) {
    classes = `${locals.toggleButton} ${checked ? locals.onDark : locals.offDark}`;
  } else {
    classes = `${locals.toggleButton} ${checked ? locals.onLight : locals.offLight}`;
  }
  if (className) {
    classes = `${classes} ${className}`;
  }

  if (disabled) {
    classes = `${classes} ${locals.disabled}`;
    onChange = stopPropagationAndPreventDefault;
  }

  // to keep display state of icon and text in sync we do not use the CSS :hover pseudo selector but the value from the
  // hover hoc
  if (hovered) {
    classes = `${classes} ${locals.hover}`;
  }

  let iconElement = null;
  if (!checked && !hovered && iconOff) {
    iconElement = (
      <SvgIcon
        type={iconOff}
        color={theme.lib.colors.black}
        spinning={iconOffSpinning}
        className={evaluateClassNames({
          [locals.icon]: true,
          [locals.iconLight]: darkTheme
        })}
      />
    );
  } else if (!checked && hovered && (iconOffHover || iconOff)) {
    iconElement = (
      <SvgIcon
        type={iconOffHover ? iconOffHover : iconOff}
        color={theme.lib.colors.black}
        spinning={iconOffHoverSpinning}
        className={locals.icon}
      />
    );
  } else if (checked && !hovered && iconOn) {
    iconElement = (
      <SvgIcon type={iconOn} color={theme.lib.colors.black} spinning={iconOnSpinning} className={locals.icon} />
    );
  } else if (checked && hovered && (iconOnHover || iconOn)) {
    iconElement = (
      <SvgIcon
        type={iconOnHover ? iconOnHover : iconOn}
        color={theme.lib.colors.black}
        spinning={iconOnHoverSpinning}
        className={locals.icon}
      />
    );
  }

  if (!href) {
    return (
      <button className={classes} onClick={onChange} style={style}>
        {iconElement} {children}
      </button>
    );
  } else {
    return (
      <a href={href} target={target} className={classes} onClick={onChange ? onChange : stopPropagation} style={style}>
        {iconElement} {children}
      </a>
    );
  }
}

ToggleButton.propTypes = {
  hovered: rpt.bool,
  iconOff: rpt.string,
  iconOffSpinning: rpt.string,
  iconOffHover: rpt.string,
  iconOffHoverSpinning: rpt.string,
  iconOn: rpt.string,
  iconOnSpinning: rpt.string,
  iconOnHover: rpt.string,
  iconOnHoverSpinning: rpt.string,
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
