import React, { Fragment } from 'react';

import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function AnalyzeTracesWorkspace(props) {
  const { filters, children } = props;
  return (
    <Fragment>
      <Title title="Analyze Traces" />

      <Sticky header={<AnalyzeHeader isGrouped={!!filters.getIn(['group', 'name'])} />}>
        <QueryBuilderWorkspace {...props} />
      </Sticky>

      <MaxWidthFullscreenContainer>{children}</MaxWidthFullscreenContainer>
    </Fragment>
  );
}
