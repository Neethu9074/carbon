/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

//@ts-expect-error needs TS migration
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import { FacetedSearchItem } from 'in-components/AnalyzeView/StateManagement';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';

export default function FacetedFilterRenderer(props: FacetedSearchItem) {
  const { trackUa2FacetedSearchFilterAdded, trackUa2FacetedSearchGroupChanged } = useAnalyzeTracker();
  return (
    <FacetedFilterMultiSelect
      {...props}
      openByDefault={false}
      tracker={{
        suggestionClicked: trackUa2FacetedSearchFilterAdded,
        groupClicked: trackUa2FacetedSearchGroupChanged
      }}
    />
  );
}
