import React, { Fragment } from 'react';

import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Title from 'in-components/Title';

export default function AnalyzeTracesWorkspace(props) {
  const { filters, children } = props;
  return (
    <Fragment>
      <Title title="Analyze Traces" />

      <AnalyzeHeader isGrouped={!!filters.getIn(['group', 'name'])} />
      <QueryBuilderWorkspace {...props} />

      <MaxWidthFullscreenContainer>{children}</MaxWidthFullscreenContainer>
    </Fragment>
  );
}
