import React from 'react';

import { getPixelsBySize } from 'in-components/SvgIcon';
import { getIconSvgPath } from 'in-sdk/snapshot';
import theme from 'in-themes';

export default function PluginIcon({
  className,
  onClick,
  style,
  size = 'xs',
  color = theme.lib.colors.N700Medium,
  snapshot,
  plugin
}) {
  const path = getIconSvgPath(snapshot ? snapshot : plugin);
  const sizeInPx = getPixelsBySize(size);

  style = style || {};
  style.minWidth = sizeInPx;
  style.minHeight = sizeInPx;
  style.maxWidth = sizeInPx;
  style.maxHeight = sizeInPx;

  return (
    <svg
      className={className}
      width={sizeInPx}
      height={sizeInPx}
      style={style}
      viewBox={`0 0 128 128`}
      fill={color}
      onClick={onClick}
    >
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={path} />
    </svg>
  );
}
