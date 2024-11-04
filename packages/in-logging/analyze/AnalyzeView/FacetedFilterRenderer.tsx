/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

//@ts-expect-error needs TS migration
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { FacetedSearchItem } from 'in-components/AnalyzeView/StateManagement';

export default function FacetedFilterRenderer(props: FacetedSearchItem) {
  const { trackUa2FacetedSearchFilterAdded, trackUa2FacetedSearchGroupChanged } = useApplicationTracker();
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
