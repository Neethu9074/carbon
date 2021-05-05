/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import QueryBuilderSection, {
  DEFAULT_MAX_EXPRESSION_DEPTH
} from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import { error } from 'in-new-components/Message/types';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LoggingQueryBuilderWorkspace(props) {
  const { onFormModelChange, formModel, isGrouped, isInvalid, tracking, children } = props;

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} withoutShadow />}>
      <Stack>
        <Sections>
          <QueryBuilderSection
            value={formModel}
            onChange={onFormModelChange}
            QueryBuilder={LogsQueryBuilder}
            useLastValidStateWhenErroneous
            maxExpressionDepth={DEFAULT_MAX_EXPRESSION_DEPTH}
            tracking={tracking}
            actions={<TagSelector {...props} compact maxSelectableTags={3} />}
            hasError={isInvalid}
          />
        </Sections>
        {isInvalid && (
          <Message type={error} withIcon small>
            {t('in-logging:theQueryConfigurationIsInvalidPleaseAddressTheValidationFailuresBeforeContinuing')}
          </Message>
        )}
        {children}
      </Stack>
      <Footer />
    </Sticky>
  );
}
