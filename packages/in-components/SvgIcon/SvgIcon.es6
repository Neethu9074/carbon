/* eslint-disable no-console */
import React from 'react';

import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import icons from 'in-components/SvgIcon/registry.json';

import './SvgIcon.less';

const block = 'in-svg-icon';

export default function SvgIcon({
  type,
  customIcon,
  width,
  height,
  maxWidth,
  maxHeight,
  className,
  color,
  onClick,
  style,
  spinning,
  tabIndex,
  role,
  'aria-label': ariaLabel,
  refSetter,
  id,
  iconPath
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

  let iconWidth;
  let iconHeight;
  const iconRatio = iconPath ? 1 : icon.ratio;

  if (!maxWidth && !maxHeight) {
    if (width) {
      iconWidth = width;
    } else if (height) {
      iconWidth = height * iconRatio;
    } else {
      iconWidth = 1;
    }
    iconHeight = height ? height : iconWidth / iconRatio;
  } else if (maxHeight != null) {
    if (!maxWidth) {
      maxWidth = width || height || maxHeight;
    }
    iconHeight = maxHeight;
    iconWidth = maxWidth * iconRatio;
  } else {
    if (!maxWidth) {
      maxWidth = width || height || maxHeight;
    }
    iconWidth = maxWidth;
    iconHeight = maxWidth / iconRatio;
  }

  style = style || {};
  style.minHeight = `${iconHeight}px`;
  style.maxHeight = style.minHeight;
  style.minWidth = `${iconWidth}px`;
  style.maxWidth = style.minWidth;

  let classNames = block;
  if (className) {
    classNames += ` ${className}`;
  }

  if (spinning && spinning === 'clockwise') {
    classNames += ` ${block}--spinning-clockwise`;
  } else if (spinning) {
    classNames += ` ${block}--spinning-counter-clockwise`;
  }

  if (onClick) {
    classNames += ` ${block}--clickable`;
  }

  return (
    <svg
      className={classNames}
      width={width}
      height={height}
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

export function getPath(type) {
  return icons[type].path;
}
