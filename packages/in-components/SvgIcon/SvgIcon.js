/* eslint-disable no-console */
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import { evaluateClassNames } from 'in-services/util/classnames';
import icons from 'in-components/SvgIcon/registry.json';
import { emptyObject } from 'in-services/fixedObjects';
import { getFactor } from 'in-services/util/dom';
import { getSingular } from 'in-sdk/pluginName';

import locals from './SvgIcon.mless';

const informationAboutUnnecessaryEventHandlerCalls = () => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      `stopPropagation/preventDefault was called in response to an SvgIcon's onClick handler. This is ` +
        `no longer necessary. Please remove the stopPropagation/preventDefault call in the onClick handler code path. ` +
        `Stack trace for this unnecessary call:`,
      new Error().stack
    );
  }
};

// The old (pre 2020-07-27) SvgIcon API did pass a MouseClick event to its
// callers whenever the onClick event was triggered. This was removed in
// order to establish a consistent API between mouse and keyboard activation
// of the default interaction. To retain backwards compatibility we raise
// the onClick event with an immutable event placeholder so that all old
// code paths
const eventPlaceholder = Object.freeze({
  stopPropagation: informationAboutUnnecessaryEventHandlerCalls,
  preventDefault: informationAboutUnnecessaryEventHandlerCalls
});

export const sizes = {
  xxs: 12,
  xs: 16,
  s: 20,
  regular: 24,
  l: 32,
  xl: 48,
  xxl: 56,
  xxxl: 96
};

export const infrastructurePluginPrefix = 'plugin:';

const SvgIcon = forwardRef(function SvgIcon(
  {
    className,
    type,
    color,
    onClick,
    style,
    spinning,
    tabIndex = 0,
    role,
    'aria-label': ariaLabel,
    refSetter,
    id,
    iconPath,
    size = 'regular',
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave
  },
  ref
) {
  role = role || (onClick ? 'button' : undefined);

  if (type?.startsWith(infrastructurePluginPrefix)) {
    const plugin = type.substring(infrastructurePluginPrefix.length);
    type = getIconType(plugin);
    if (!ariaLabel) {
      ariaLabel = `${getSingular(plugin)} icon`;
    }
  }
  if (type) {
    iconPath = icons[type]?.path;
    ariaLabel = ariaLabel ?? type;
  }

  const sizeInPx = getPixelsBySize(size);

  style = style || {};
  style.minHeight = `${sizeInPx}px`;
  style.maxHeight = style.minHeight;
  style.minWidth = `${sizeInPx}px`;
  style.maxWidth = style.minWidth;

  let interactivityProps = emptyObject;
  if (onClick) {
    interactivityProps = toInteractiveElement({
      onDefaultInteraction: () => onClick(eventPlaceholder),
      ariaLabel,
      role,
      tabIndex
    });
  }

  return (
    <svg
      className={evaluateClassNames({
        [locals.icon]: true,
        [locals.spinningCounterClockwise]: spinning,
        [locals.clickable]: onClick,
        [className]: className
      })}
      width={sizeInPx}
      height={sizeInPx}
      style={style}
      viewBox="0 0 24 24"
      fill={color}
      aria-label={ariaLabel}
      {...interactivityProps}
      ref={ref || refSetter}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={id}
    >
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={iconPath} />
    </svg>
  );
});

export default SvgIcon;

export function getPixelsBySize(size) {
  if (typeof size === 'number') {
    return size;
  }
  return (sizes[size] || sizes.regular) / getFactor();
}

export function getPath(type) {
  return icons[type].path;
}

SvgIcon.defaultProps = {
  size: 'regular'
};

SvgIcon.propTypes = {
  'aria-label': PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  iconPath: PropTypes.string,
  viewBox: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  refSetter: PropTypes.func,
  role: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xxs', 'xs', 's', 'regular', 'l', 'xl', 'xxl', 'xxxl']),
    PropTypes.number
  ]),
  spinning: PropTypes.bool,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  type: PropTypes.string
};
