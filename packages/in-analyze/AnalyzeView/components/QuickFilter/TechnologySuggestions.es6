import React from 'react';

import SearchableList from 'in-analyze/AnalyzeView/components/QuickFilter/SearchableList';
import { getTechnologyComboBoxItems } from 'in-applications/technologyRegistry';
import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
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
  return <TechnologyLabelWithIcon plugin={item.value} label={item.value} is10Icon />;
}
