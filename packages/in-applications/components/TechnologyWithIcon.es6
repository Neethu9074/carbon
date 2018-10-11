import React from 'react';

import { getIconSvgPath } from 'in-applications/technologyRegistry';

import locals from './TechnologyWithIcon.mless';

export default function TechnologyWithIcon({ technology }) {
  return (
    <div className={locals.wrapper}>
      <svg className={locals.icon} width={16} height={16} viewBox={`0 0 128 128`}>
        <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
        <path d={getIconSvgPath(technology)} />
      </svg>
      <span className={locals.text}>{technology}</span>
    </div>
  );
}
