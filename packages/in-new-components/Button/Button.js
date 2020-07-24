import rpt from 'prop-types';
import React from 'react';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import { useObservableConfig } from 'in-components/Link/Link';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

export const kinds = [
  'primary',
  'primaryv2',
  'secondary',
  'secondaryDarker',
  'action',
  'subtle',
  'create',
  'danger',
  'warning',
  'info',
  'fixedInline'
];
export const sizes = ['xl', 'normal', 'compact'];

const iconDimensions = {
  xl: 'regular',
  normal: 'regular',
  compact: 'xs'
};

export default function Button({
  icon,
  iconSpinning,
  iconSize,
  id,
  className,
  kind = 'primary',
  size = 'normal',
  type = 'button',
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  children,
  href,
  href$,
  disabled,
  target,
  refSetter,
  autoFocus,
  noAutoMargin
}) {
  // Avoid changing the element type every time the link goes from unresolved to resolved.
  // This can cause several problems: Lost focus, tooltip component breaking…
  const willBeALink = href$ || href;
  const resolvedHref = useObservable(href$, [href$], useObservableConfig) || href;
  let classes = `${locals.button} ${noAutoMargin ? locals.noAutoMargin : ''} ${locals[kind] || ''} ${locals[size] ||
    ''}`;

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
      <SvgIcon
        className={evaluateClassNames({
          [locals.icon]: true,
          [locals.noHorizontalMargin]: !children
        })}
        type={icon}
        spinning={iconSpinning}
        size={iconSize || iconDimensions[size]}
      />
    );
  }

  if (!willBeALink) {
    return (
      <button
        id={id}
        className={classes}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
        type={type}
        ref={refSetter}
        autoFocus={autoFocus}
      >
        {iconElement} {children}
      </button>
    );
  }

  return (
    <a
      id={id}
      href={resolvedHref}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={classes}
      onClick={onClick ? onClick : stopPropagation}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      ref={refSetter}
      autoFocus={autoFocus}
    >
      {iconElement} {children}
    </a>
  );
}

Button.propTypes = {
  /** Icon here */
  icon: rpt.string,
  iconSpinning: rpt.bool,
  iconSize: rpt.oneOf(['xs', 's', 'm', 'l']),
  id: rpt.string,
  className: rpt.string,
  style: rpt.object,
  children: rpt.node,
  kind: rpt.oneOf(kinds),
  size: rpt.oneOf(sizes),
  onMouseEnter: rpt.func,
  onMouseLeave: rpt.func,
  type: rpt.string,
  onClick: rpt.func,
  href: rpt.string,
  href$: rpt.object,
  target: rpt.string,
  disabled: rpt.bool,
  refSetter: rpt.func,
  autoFocus: rpt.bool,
  noAutoMargin: rpt.bool
};
