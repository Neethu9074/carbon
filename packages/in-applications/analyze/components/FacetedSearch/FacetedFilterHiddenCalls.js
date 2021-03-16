/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  ua2FacetedSearchSyntheticCallsToggledTracker,
  ua2FacetedSearchInternalCallsToggledTracker
} from 'in-applications/tracker';
import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

import locals from './Suggestion.mless';

export default function FacetedFilterHiddenCalls({
  title,
  includeSynthetic = false,
  includeInternal = false,
  setIncludeSynthetic,
  setIncludeInternal,
  dataSource,
  openByDefault
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <HiddenCallCheck
        label={t('in-applications:analyze.facetedSearch.showSyntheticCalls')}
        checked={includeSynthetic}
        onChange={() => {
          ua2FacetedSearchSyntheticCallsToggledTracker({ dataSource, value: !includeSynthetic });
          setIncludeSynthetic(!includeSynthetic);
        }}
      />
      <HiddenCallCheck
        label={t('in-applications:analyze.facetedSearch.showInternalCalls')}
        checked={includeInternal}
        onChange={() => {
          ua2FacetedSearchInternalCallsToggledTracker({ dataSource, value: !includeInternal });
          setIncludeInternal(!includeInternal);
        }}
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
