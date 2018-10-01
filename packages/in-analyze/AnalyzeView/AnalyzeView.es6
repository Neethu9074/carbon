import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { getConfigHocs } from 'in-analyze/navigation/analyzeConfig';

import QueryBuilderWorkspace from 'in-analyze/AnalyzeView/components/QueryBuilderWorkspace';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { activeDialog$ } from 'in-components/DialogPresenter/store';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import AnalyzeHeader from 'in-analyze/AnalyzeView/AnalyzeHeader';
import GroupedTraces from 'in-analyze/components/GroupedTraces';
import GroupedCalls from 'in-analyze/components/GroupedCalls';
import RawTraces from 'in-analyze/components/RawTraces';
import RawCalls from 'in-analyze/components/RawCalls';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default compose(
  connectTo({
    activeDialog: activeDialog$
  }),
  getConfigHocs()
)(AnalyzeView);

function AnalyzeView(props) {
  const {
    activeDialog,
    onChangeAnalyzeConfig,
    onChangeDataSource,
    filters,
    isRawView,
    isTracesDataSource,
    dataSource
  } = props;

  return (
    <Fragment>
      <Title title={isTracesDataSource ? 'Analyze Traces' : 'Analyze Calls'} />

      <AnalyzeHeader onChangeDataSource={onChangeDataSource} dataSource={dataSource} />
      <QueryBuilderWorkspace filters={filters} onChangeAnalyzeConfig={onChangeAnalyzeConfig} />

      <MaxWidthFullscreenContainer>
        {isRawView ? (
          isTracesDataSource ? (
            <RawTraces {...props} filters={filters} />
          ) : (
            <RawCalls {...props} filters={filters} />
          )
        ) : isTracesDataSource ? (
          <GroupedTraces {...props} filters={filters} />
        ) : (
          <GroupedCalls {...props} filters={filters} />
        )}
      </MaxWidthFullscreenContainer>

      {activeDialog && <DisabledBodyScroll />}
    </Fragment>
  );
}
