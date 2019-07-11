import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import ArticleContent from 'in-new-components/ArticleContent';
import Sticky from 'in-components/Sticky';

export default function EmptyAnalyzeView() {
  return (
    <Sticky header={<AnalyzeHeader />}>
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          icon="lib_application_trace"
          title="No Calls found"
          renderExplanation={() => <ArticleContent id="analyzeNoData" />}
        />
      </CenterAlignmentColumn>
    </Sticky>
  );
}
