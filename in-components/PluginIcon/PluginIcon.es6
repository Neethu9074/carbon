import React from 'react';

import {getIconSvgPath} from 'in-sdk/snapshot';


export default function PluginIcon({
  className,
  onClick,
  style,
  dimension = 16,
  color = '#fff',
  snapshot,
  plugin
}) {
  const path = getIconSvgPath(snapshot ? snapshot : plugin);

  style = style || {};
  style.width = `${dimension}px`;
  style.height = `${dimension}px`;

  return (
    <svg className={className}
         width={dimension}
         height={dimension}
         style={style}
         viewBox={`0 0 128 128`}
         fill={color}
         onClick={onClick}>
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width='100%'
            height='100%'
            fill='rgba(0, 0, 0, 0)' />
      <path d={path} />
    </svg>
  );
}
