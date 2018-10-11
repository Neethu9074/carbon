import React, { Fragment } from 'react';

import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import AnalyzeHeader from 'in-analyze/AnalyzeView/AnalyzeHeader';
import Title from 'in-components/Title';

export default function AnalyzeCallsWorkspace({
  onChangeAnalyzeConfig,
  onChangeDataSource,
  filters,
  dataSource,
  isTracesDataSource,
  children
}) {
  return (
    <Fragment>
      <Title title={'Analyze Calls'} />

      <AnalyzeHeader filters={filters} onChangeDataSource={onChangeDataSource} dataSource={dataSource} />
      <QueryBuilderWorkspace
        isTracesDataSource={isTracesDataSource}
        filters={filters}
        onChangeAnalyzeConfig={onChangeAnalyzeConfig}
      />

      <MaxWidthFullscreenContainer>{children}</MaxWidthFullscreenContainer>
    </Fragment>
  );
}
