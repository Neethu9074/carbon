import React from 'react';

import { getPixelsBySize } from 'in-components/SvgIcon';
import { getIconSvgPath } from 'in-sdk/snapshot';

import locals from './TechnologyLabelWithIcon.mless';

export default function TechnologyLabelWithIcon({ plugin, path, label, is10Icon = false }) {
  if (!path && plugin) {
    path = getIconSvgPath(plugin);
  }

  const dimension = is10Icon ? 128 : 24;
  const sizeInPx = getPixelsBySize(is10Icon ? 'xs' : 'regular');

  return (
    <div className={locals.wrapper}>
      {path && (
        <svg className={locals.icon} width={sizeInPx} height={sizeInPx} viewBox={`0 0 ${dimension} ${dimension}`}>
          {/* Ensure that the whole width/height is clickable in Safari */}
          <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
          <path d={path} />
        </svg>
      )}
      <span className={locals.label}>{label}</span>
    </div>
  );
}
