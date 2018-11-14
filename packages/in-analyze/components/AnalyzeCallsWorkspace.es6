import React, { Fragment } from 'react';

import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import AnalyzeHeader from 'in-analyze/AnalyzeView/AnalyzeHeader';
import Title from 'in-components/Title';

export default function AnalyzeCallsWorkspace(props) {
  const { onChangeDataSource, filters, dataSource, children } = props;
  return (
    <Fragment>
      <Title title={'Analyze Calls'} />

      <AnalyzeHeader filters={filters} onChangeDataSource={onChangeDataSource} dataSource={dataSource} />
      <QueryBuilderWorkspace {...props} />

      <MaxWidthFullscreenContainer>{children}</MaxWidthFullscreenContainer>
    </Fragment>
  );
}
