import React, { Fragment } from 'react';
import { compose } from 'recompose';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import FilterButtonRow from 'in-analyze/Analyze/FilterButtonRow';
import RawTraces from 'in-analyze/Analyze/RawTraces/RawTraces';
import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import AnalyzeRoot from 'in-analyze/Analyze/AnalyzeRoot';
import { analyze } from 'in-analyze/navigation/paths';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => '',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: 'startTime',
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  })
)(Analyze);

function Analyze({ location, orderBy, orderDirection }) {
  const filter = buildFilter(location);
  return (
    <Fragment>
      <Title title="Traces" />
      <Breadcrumbs items={[<AnalyzeRoot location={location} />]} />

      <Sticky header={<FilterButtonRow filter={filter} />}>
        <MaxWidthFullscreenContainer>
          <RawTraces orderBy={orderBy} orderDirection={orderDirection} filter={filter} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}
