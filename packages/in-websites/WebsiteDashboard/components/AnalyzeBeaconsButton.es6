import { get } from 'lodash';
import React from 'react';

import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { defaultGroupings } from 'in-websites/tags';
import Button from 'in-new-components/Button';

export default function AnalyzeBeaconsButton({ tagFilters, result }) {
  const label = get(result, ['data', 'label']);
  let tagFiltersForAnalyze = tagFilters;
  if (label) {
    // replace website ID filter with something more understandable by users.
    tagFiltersForAnalyze = tagFiltersForAnalyze.filter(f => f.name !== 'beacon.website.id').concat({
      name: 'beacon.website.name',
      operator: 'EQUALS',
      stringValue: result.data.label
    });
  }

  return (
    <Button
      kind="primary"
      icon="lib_application_trace"
      href$={getLinkToAnalyze({
        beaconType: 'pageLoad',
        tagFilters: tagFiltersForAnalyze,
        group: defaultGroupings.pageLoad
      })}
    >
      Analyze Page Loads
    </Button>
  );
}
