import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import AnalyzeRootBreadcrumb from 'in-analyze/Analyze/AnalyzeRootBreadcrumb';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import FilterButtonRow from 'in-analyze/Analyze/FilterButtonRow';
import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

/*
 * Shared layout for trace groups and raw traces.
 */
export default function TraceTablePage({ location, children }) {
  const filter = buildFilter(location);
  return (
    <Fragment>
      <Title title="Traces" />
      <Breadcrumbs items={[<AnalyzeRootBreadcrumb location={location} />]} />

      <Sticky
        header={
          <div>
            <BreadcrumbHeader />
            <FilterButtonRow filter={filter} />
          </div>
        }
      >
        <MaxWidthFullscreenContainer>{children}</MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}
