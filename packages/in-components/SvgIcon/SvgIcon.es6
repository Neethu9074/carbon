/* eslint-disable no-console */
import React from 'react';

import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import icons from 'in-components/SvgIcon/registry.json';

import './SvgIcon.less';

const block = 'in-svg-icon';

export default function SvgIcon({
  type,
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
  'aria-label': ariaLabel
}) {
  ariaLabel = ariaLabel || type;
  role = role || (onClick ? 'button' : undefined);
  tabIndex = tabIndex != null ? tabIndex : onClick ? 0 : undefined;

  const icon = icons[type];
  if (!icon) {
    if (__DEV__) {
      console.error(`SVG icon ${type} is unknown.`);
    }
    return null;
  }

  let iconWidth;
  let iconHeight;

  if (maxWidth == null && maxHeight == null) {
    if (width) {
      iconWidth = width;
    } else if (height) {
      iconWidth = height * icon.ratio;
    } else {
      iconWidth = 1;
    }
    iconHeight = height ? height : iconWidth / icon.ratio;
  } else if (maxHeight != null) {
    iconHeight = maxHeight;
    iconWidth = maxWidth * icon.ratio;
  } else {
    iconWidth = maxWidth;
    iconHeight = maxWidth / icon.ratio;
  }

  style = style || {};
  style.width = `${iconWidth}px`;
  style.height = `${iconHeight}px`;

  let classNames = block;
  if (className) {
    classNames += ` ${className}`;
  }

  if (spinning && spinning === 'clockwise') {
    classNames += ` ${block}--spinning-clockwise`;
  } else if (spinning && spinning === 'counter-clockwise') {
    classNames += ` ${block}--spinning-counter-clockwise`;
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
    >
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={icon.path} />
    </svg>
  );
}
