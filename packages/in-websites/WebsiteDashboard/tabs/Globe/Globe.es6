import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getCountryBreakdown from 'in-subscription/websiteMonitoring/getCountryBreakdown';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import GlobeView from 'in-new-components/GlobeView';

import locals from './Globe.mless';

export default function Summary({ tagFilters, timeConfig }) {
  return (
    <div className={locals.wrapper}>
      <FullHeightWrapper
        render={height => (
          <GlobeView
            customHeight={height}
            getData$={() =>
              getCountryBreakdown({
                timeConfig,
                tagFilters,
                pagination: {
                  page: 1,
                  pageSize: 200
                },
                order: {
                  by: 'countryName',
                  direction: 'ASC'
                }
              })
            }
          />
        )}
      />
      <DisabledBodyScroll />
    </div>
  );
}
