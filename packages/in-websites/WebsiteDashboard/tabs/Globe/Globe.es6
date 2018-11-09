import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import { createFilter } from 'in-analyze/filterBuilder';
import GlobeView from 'in-new-components/GlobeView';

import locals from './Globe.mless';

export default function Summary({ websiteId }) {
  return (
    <div className={locals.wrapper}>
      <FullHeightWrapper
        render={height => (
          <GlobeView
            customHeight={height}
            getTagFilters={() => {
              const websiteFilter = createFilter({
                name: 'beacon.website.id',
                value: websiteId
              });
              websiteFilter.stringValue = websiteFilter.value;
              return [websiteFilter];
            }}
          />
        )}
      />
      <DisabledBodyScroll />
    </div>
  );
}
