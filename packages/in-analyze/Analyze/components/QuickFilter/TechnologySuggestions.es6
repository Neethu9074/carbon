import React from 'react';

import { getIconSvgPath, getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import SearchableList from 'in-analyze/Analyze/components/QuickFilter/SearchableList';
import { compareIgnoreCase } from 'in-services/util/string';

import locals from './TechnologySuggestions.mless';

export default function TechnologySuggestions(props) {
  return (
    <SearchableList
      {...props}
      items={getTechnologyComboBoxItems().sort((a, b) => compareIgnoreCase(a.label, b.label))}
      renderIcon={renderIcon}
    />
  );
}

function renderIcon(item) {
  return (
    <svg className={locals.icon} width={16} height={16} viewBox={`0 0 128 128`}>
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={getIconSvgPath(item.value)} />
    </svg>
  );
}
