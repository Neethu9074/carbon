import React from 'react';

import SearchableList from 'in-analyze/AnalyzeView/components/QuickFilter/SearchableList';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import TechnologyWithIcon from 'in-applications/components/TechnologyWithIcon';
import { compareIgnoreCase } from 'in-services/util/string';

export default function TechnologySuggestions(props) {
  return (
    <SearchableList
      {...props}
      items={getTechnologyComboBoxItems().sort((a, b) => compareIgnoreCase(a.label, b.label))}
      renderItem={renderItem}
    />
  );
}

function renderItem(renderIcon, item) {
  return <TechnologyWithIcon technology={item.value} />;
}
