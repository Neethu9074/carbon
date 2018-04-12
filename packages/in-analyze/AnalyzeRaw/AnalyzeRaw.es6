import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import AnalyzeRootBreadcrumb from 'in-analyze/Analyze/AnalyzeRootBreadcrumb';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import FilterButtonRow from 'in-analyze/Analyze/FilterButtonRow';
import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import RawTraces from 'in-analyze/AnalyzeRaw/RawTraces';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function AnalyzeRaw({ location }) {
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
        <MaxWidthFullscreenContainer>
          <RawTraces filter={filter} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}
