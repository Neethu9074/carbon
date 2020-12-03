import React from 'react';

import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from './Suggestion.mless';

export default function FacetedFilterHiddenCalls({
  title,
  includeSynthetic = false,
  includeInternal = false,
  setIncludeSynthetic,
  setIncludeInternal,
  openByDefault
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <HiddenCallCheck
        label="Show Synthetic calls"
        checked={includeSynthetic}
        onChange={() => setIncludeSynthetic(!includeSynthetic)}
      />
      <HiddenCallCheck
        label="Show Internal calls"
        checked={includeInternal}
        onChange={() => setIncludeInternal(!includeInternal)}
      />
    </FacetedExpandableCard>
  );
}

function HiddenCallCheck({ label, checked, onChange }) {
  return (
    <div className={locals.suggestion}>
      <CheckboxFancy labelClassName={locals.label} label={label} checked={checked} onChange={onChange} />
    </div>
  );
}
