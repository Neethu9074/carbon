import React from 'react';

import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import { error } from 'in-new-components/Message/types';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function LoggingQueryBuilderWorkspace(props) {
  const { onTagFilterExpressionChange, tagFilterExpression, isGrouped, isInvalid, children } = props;

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} withoutShadow />}>
      <Stack>
        <Sections>
          <QueryBuilderSection
            {...props}
            value={tagFilterExpression}
            onChange={onTagFilterExpressionChange}
            QueryBuilder={LogsQueryBuilder}
            CustomActions={CustomActions}
          />
        </Sections>
        {isInvalid && (
          <Message type={error} withIcon small>
            The query configuration is invalid. Please address the validation failures before continuing.
          </Message>
        )}
        {children}
      </Stack>
      <Footer />
    </Sticky>
  );
}

function CustomActions(props) {
  return <TagSelector {...props} compact maxSelectableTags={3} />;
}
