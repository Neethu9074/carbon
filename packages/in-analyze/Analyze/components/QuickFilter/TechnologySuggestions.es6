import React from 'react';

import { getIconSvgPath, getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import { compareIgnoreCase } from 'in-services/util/string';

import locals from './TechnologySuggestions.mless';

export default function TechnologySuggestions({ onValueClick }) {
  return (
    <ul className={locals.suggestionList}>
      {getTechnologyComboBoxItems()
        .sort((a, b) => compareIgnoreCase(a.label, b.label))
        .map(technology => (
          <li key={technology.value} className={locals.suggestion} onClick={() => onValueClick(technology.value)}>
            <svg className={locals.icon} width={16} height={16} viewBox={`0 0 128 128`}>
              <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
              <path d={getIconSvgPath(technology.value)} />
            </svg>
            {technology.label}
          </li>
        ))}
    </ul>
  );
}
