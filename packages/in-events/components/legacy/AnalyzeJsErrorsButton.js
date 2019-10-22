import React from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import Button from 'in-new-components/Button';

export default function AnalyzeJsErrorsButton({ websiteLabel, tagFilters, timeConfigFromEvent }) {
  return (
    <Button
      kind="primary"
      icon="lib_website_error"
      href$={getLinkToAnalyze({
        beaconType: 'error',
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group: defaultGroupings.error
      })}
      timeConfig={timeConfigFromEvent}
    >
      Analyze JS Errors
    </Button>
  );
}
