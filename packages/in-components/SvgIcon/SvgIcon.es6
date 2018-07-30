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
  'aria-label': ariaLabel,
  refSetter
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

  if (!maxWidth && !maxHeight) {
    if (width) {
      iconWidth = width;
    } else if (height) {
      iconWidth = height * icon.ratio;
    } else {
      iconWidth = 1;
    }
    iconHeight = height ? height : iconWidth / icon.ratio;
  } else if (maxHeight != null) {
    if (!maxWidth) {
      maxWidth = width || height || maxHeight;
    }
    iconHeight = maxHeight;
    iconWidth = maxWidth * icon.ratio;
  } else {
    if (!maxWidth) {
      maxWidth = width || height || maxHeight;
    }
    iconWidth = maxWidth;
    iconHeight = maxWidth / icon.ratio;
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
    >
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={icon.path} />
    </svg>
  );
}
