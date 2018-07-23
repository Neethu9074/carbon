import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BackToExploreBreadcrumb from 'in-analyze/shared/BackToExploreBreadcrumb';
import AnalyzeTracesBreadcrumb from 'in-analyze/shared/AnalyzeTracesBreadcrumb';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import FilterButtonRow from 'in-analyze/shared/FilterButtonRow';
import { buildFilter } from 'in-analyze/shared/filterBuilder';
import AnalyzeHeader from 'in-analyze/shared/AnalyzeHeader';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

import locals from './TraceTablePage.mless';

export default function TraceTablePage({ location, children }) {
  const filter = buildFilter(location);
  return (
    <Fragment>
      <Title title="Traces" />
      <Breadcrumbs items={[<BackToExploreBreadcrumb />, <AnalyzeTracesBreadcrumb />]} />

      <Sticky
        header={
          <div>
            <BreadcrumbHeader />
            <AnalyzeHeader location={location} />
            <FilterButtonRow filter={filter} />
          </div>
        }
      >
        <MaxWidthFullscreenContainer className={locals.traceTablePage}>{children}</MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}
