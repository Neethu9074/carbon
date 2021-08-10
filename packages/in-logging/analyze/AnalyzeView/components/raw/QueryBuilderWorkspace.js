/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Stack } from '@instana/components';

import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-components/workspace/Sections';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LoggingQueryBuilderWorkspace(props) {
  const { onFormModelChange, formModel, isGrouped, isValid, isLoading, tracking, children } = props;

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} withoutShadow />}>
      <Stack>
        <Sections>
          <QueryBuilderSection
            value={formModel}
            onChange={onFormModelChange}
            QueryBuilder={LogsQueryBuilder}
            useLastValidStateWhenErroneous
            tracking={tracking}
            hasError={!isValid}
          />
        </Sections>
        {!isValid && !isLoading && (
          <Message type="error" withIcon small>
            {t('in-logging:theQueryConfigurationIsInvalidPleaseAddressTheValidationFailuresBeforeContinuing')}
          </Message>
        )}
        {children}
      </Stack>
      <Footer />
    </Sticky>
  );
}
