import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TraceGroupsWithCharts from 'in-analyze/Analyze/TraceGroups/TraceGroupsWithCharts';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import FilterButtonRow from 'in-analyze/Analyze/FilterButtonRow';
import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import AnalyzeRoot from 'in-analyze/Analyze/AnalyzeRoot';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function Analyze({ location }) {
  const filter = buildFilter(location);
  return (
    <Fragment>
      <Title title="Traces" />
      <Breadcrumbs items={[<AnalyzeRoot location={location} />]} />

      <Sticky header={<FilterButtonRow filter={filter} />}>
        <MaxWidthFullscreenContainer>
          <TraceGroupsWithCharts filter={filter} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}
