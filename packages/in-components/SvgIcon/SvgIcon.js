/* eslint-disable no-console */
import React from 'react';

import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getFactor } from 'in-services/util/dom';

import icons from 'in-components/SvgIcon/registry.json';

import locals from './SvgIcon.mless';

export const sizes = {
  xxs: 12,
  xs: 16,
  s: 20,
  regular: 24,
  l: 32,
  xl: 48,
  xxl: 56
};

export default function SvgIcon({
  className,
  type,
  customIcon,
  color,
  onClick,
  style,
  spinning,
  tabIndex,
  role,
  'aria-label': ariaLabel,
  refSetter,
  id,
  iconPath,
  size = 'regular'
}) {
  ariaLabel = ariaLabel || type;
  role = role || (onClick ? 'button' : undefined);
  tabIndex = tabIndex != null ? tabIndex : onClick ? 0 : undefined;

  if (!type && !customIcon) {
    type = 'empty';
  }

  const icon = type ? icons[type] : customIcon;
  if (!icon) {
    if (__DEV__) {
      console.error(`SVG icon ${type} is unknown.`);
    }
    return null;
  }

  const sizeInPx = getPixelsBySize(size);
  const { iconWidth, iconHeight } = getIconDimensions(sizeInPx, iconPath, icon);

  style = style || {};
  style.minHeight = `${iconHeight}px`;
  style.maxHeight = style.minHeight;
  style.minWidth = `${iconWidth}px`;
  style.maxWidth = style.minWidth;

  return (
    <svg
      className={evaluateClassNames({
        [locals.icon]: true,
        [locals.spinningClockwise]: spinning && spinning === 'clockwise',
        [locals.spinningCounterClockwise]: spinning && spinning !== 'clockwise',
        [locals.clickable]: onClick,
        [className]: className
      })}
      width={sizeInPx}
      height={sizeInPx}
      style={style}
      viewBox={'0 0 ' + icon.width + ' ' + icon.height}
      fill={color}
      onClick={onClick}
      onKeyUp={getKeyboardActivatedOnClickHandler(onClick)}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      ref={refSetter}
      id={id}
    >
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={iconPath ? iconPath : icon.path} />
    </svg>
  );
}

export function getPixelsBySize(size) {
  if (typeof size === 'number') {
    return size;
  }
  return (sizes[size] || sizes.regular) / getFactor();
}

export function getPath(type) {
  return icons[type].path;
}

function getIconDimensions(sizeInPx, iconPath, icon) {
  if (iconPath) {
    return { iconWidth: sizeInPx, iconHeight: sizeInPx };
  }

  const iconRatio = icon.ratio > 1 ? icon.ratio : 1 / icon.ratio;

  if (icon.width > icon.height) {
    return { iconWidth: sizeInPx, iconHeight: sizeInPx / iconRatio };
  }
  return { iconWidth: sizeInPx / iconRatio, iconHeight: sizeInPx };
}
