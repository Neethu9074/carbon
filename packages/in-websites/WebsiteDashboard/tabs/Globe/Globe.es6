import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getCountryBreakdown from 'in-subscription/websiteMonitoring/getCountryBreakdown';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import { createFilter } from 'in-analyze/filterBuilder';
import { timeConfig$ } from 'in-stores/time/config';
import GlobeView from 'in-new-components/GlobeView';

import locals from './Globe.mless';

export default function Summary({ websiteId }) {
  return (
    <div className={locals.wrapper}>
      <FullHeightWrapper
        render={height => (
          <GlobeView
            customHeight={height}
            getData$={() =>
              timeConfig$.flatMap(timeConfig => {
                const websiteFilter = createFilter({
                  name: 'beacon.website.id',
                  value: websiteId
                });
                websiteFilter.stringValue = websiteFilter.value;

                return getCountryBreakdown({
                  timeConfig,
                  tagFilters: [websiteFilter],
                  pagination: {
                    page: 1,
                    pageSize: 200
                  },
                  order: {
                    by: 'countryName',
                    direction: 'ASC'
                  }
                });
              })
            }
          />
        )}
      />
      <DisabledBodyScroll />
    </div>
  );
}
