import React from 'react';

import { getIconSvgPath } from 'in-sdk/snapshot';

import locals from './TechnologyLabelWithIcon.mless';

export default function TechnologyLabelWithIcon({ plugin, path, label, dimension = 128 }) {
  if (!path && plugin) {
    path = getIconSvgPath(plugin);
  }

  return (
    <div className={locals.wrapper}>
      {path && (
        <svg className={locals.icon} width={16} height={16} viewBox={`0 0 ${dimension} ${dimension}`}>
          {/* Ensure that the whole width/height is clickable in Safari */}
          <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
          <path d={path} />
        </svg>
      )}
      <span className={locals.label}>{label}</span>
    </div>
  );
}
